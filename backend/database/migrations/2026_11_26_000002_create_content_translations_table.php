<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_translations', function (Blueprint $table) {
            $table->id();
            $table->morphs('translatable');
            $table->string('locale', 5);
            $table->json('fields');
            $table->json('published_fields')->nullable();
            $table->string('status')->default('draft')->index();
            $table->foreignId('submitted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
            $table->unique(['translatable_type', 'translatable_id', 'locale']);
        });

        foreach ([
            'translations.manage' => 'Manage content translations',
            'translations.approve' => 'Approve content translations',
        ] as $name => $label) {
            DB::table('permissions')->insert([
                'name' => $name,
                'label' => $label,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $manageId = DB::table('permissions')->where('name', 'translations.manage')->value('id');
        $approveId = DB::table('permissions')->where('name', 'translations.approve')->value('id');

        $editorRoleIds = DB::table('roles')->where('name', 'content_editor')->pluck('id');
        foreach ($editorRoleIds as $roleId) {
            DB::table('permission_role')->insert([
                'permission_id' => $manageId,
                'role_id' => $roleId,
            ]);
        }

        $administratorRoleIds = DB::table('roles')
            ->whereIn('name', ['administrator', 'super_admin'])
            ->pluck('id');
        foreach ($administratorRoleIds as $roleId) {
            DB::table('permission_role')->insert([
                'permission_id' => $manageId,
                'role_id' => $roleId,
            ]);
            DB::table('permission_role')->insert([
                'permission_id' => $approveId,
                'role_id' => $roleId,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('content_translations');

        $permissionIds = DB::table('permissions')
            ->whereIn('name', ['translations.manage', 'translations.approve'])
            ->pluck('id');

        DB::table('permission_role')->whereIn('permission_id', $permissionIds)->delete();
        DB::table('permissions')->whereIn('id', $permissionIds)->delete();
    }
};
