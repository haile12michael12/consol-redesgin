<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $permissionLabels = [
            'events.manage' => 'Manage events',
            'analytics.view' => 'View dashboard and analytics',
        ];

        foreach ($permissionLabels as $name => $label) {
            DB::table('permissions')->updateOrInsert(
                ['name' => $name],
                ['label' => $label, 'updated_at' => $now, 'created_at' => $now],
            );
        }

        $allPermissions = DB::table('permissions')->pluck('id', 'name');
        $roles = [
            'super_admin' => ['Super Admin', $allPermissions->keys()->all()],
            'administrator' => ['Administrator', $allPermissions->keys()->all()],
            'content_editor' => ['Content Editor', [
                'analytics.view', 'pages.manage', 'services.manage', 'projects.manage',
                'news.manage', 'events.manage', 'resources.manage', 'media.manage',
            ]],
            'training_manager' => ['Training Manager', [
                'analytics.view', 'training.manage', 'registrations.manage', 'certificates.manage',
            ]],
            'project_manager' => ['Project Manager', [
                'analytics.view', 'projects.manage',
            ]],
            'inquiry_manager' => ['Inquiry Manager', [
                'analytics.view', 'inquiries.manage',
            ]],
        ];

        foreach ($roles as $name => [$label, $permissionNames]) {
            DB::table('roles')->updateOrInsert(
                ['name' => $name],
                ['label' => $label, 'is_system' => true, 'updated_at' => $now, 'created_at' => $now],
            );
            $roleId = DB::table('roles')->where('name', $name)->value('id');
            $permissionIds = collect($permissionNames)
                ->map(fn (string $permission) => $allPermissions->get($permission))
                ->filter()
                ->map(fn ($permissionId) => [
                    'role_id' => $roleId,
                    'permission_id' => (int) $permissionId,
                ])
                ->all();

            DB::table('permission_role')->where('role_id', $roleId)->delete();
            if ($permissionIds !== []) {
                DB::table('permission_role')->insert($permissionIds);
            }
        }

        $administratorRoleId = DB::table('roles')->where('name', 'administrator')->value('id');
        foreach (DB::table('users')->where('is_admin', true)->pluck('id') as $userId) {
            DB::table('role_user')->updateOrInsert(
                ['role_id' => $administratorRoleId, 'user_id' => $userId],
            );
        }
    }

    public function down(): void
    {
        $eventPermissionId = DB::table('permissions')->where('name', 'events.manage')->value('id');
        if ($eventPermissionId) {
            DB::table('permission_role')->where('permission_id', $eventPermissionId)->delete();
            DB::table('permissions')->where('id', $eventPermissionId)->delete();
        }

        DB::table('role_user')->whereIn(
            'role_id',
            DB::table('roles')->whereIn('name', ['super_admin', 'project_manager'])->select('id'),
        )->delete();
        DB::table('permission_role')->whereIn(
            'role_id',
            DB::table('roles')->whereIn('name', ['super_admin', 'project_manager'])->select('id'),
        )->delete();
        DB::table('roles')->whereIn('name', ['super_admin', 'project_manager'])->delete();
    }
};
