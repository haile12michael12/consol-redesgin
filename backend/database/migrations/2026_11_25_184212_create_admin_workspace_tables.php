<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->index();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->timestamps();
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->primary(['permission_id', 'role_id']);
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'user_id']);
        });

        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('original_name');
            $table->string('path')->unique();
            $table->string('mime_type', 127);
            $table->unsignedBigInteger('file_size');
            $table->string('alt')->nullable();
            $table->string('collection')->default('general')->index();
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('group')->default('general')->index();
            $table->json('value');
            $table->boolean('is_public')->default(false);
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        foreach ([
            'site.name' => 'Construction Solutions PLC',
            'site.tagline' => 'Your partner in growth',
            'contact.email' => 'info@constructionsolutionsplc.com',
            'contact.landline' => '+251 114 70 04 52',
            'contact.mobile' => '+251 911 51 30 11',
            'contact.address' => 'Meskel Flower to Wello Sefer Street, Martereza Building, 3rd Floor, Suite 301, Addis Ababa, Ethiopia',
        ] as $key => $value) {
            DB::table('settings')->insert([
                'key' => $key,
                'group' => str($key)->before('.')->toString(),
                'value' => json_encode($value, JSON_THROW_ON_ERROR),
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $permissionNames = [
            'pages.manage', 'services.manage', 'projects.manage', 'training.manage',
            'registrations.manage', 'certificates.manage', 'news.manage', 'resources.manage',
            'inquiries.manage', 'media.manage', 'users.manage', 'settings.manage', 'analytics.view',
        ];
        foreach ($permissionNames as $permissionName) {
            DB::table('permissions')->insert([
                'name' => $permissionName,
                'label' => str($permissionName)->replace('.', ' ')->title()->toString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $roles = [
            'administrator' => ['Administrator', $permissionNames],
            'content_editor' => ['Content editor', ['analytics.view', 'pages.manage', 'services.manage', 'projects.manage', 'news.manage', 'resources.manage', 'media.manage']],
            'training_manager' => ['Training manager', ['analytics.view', 'training.manage', 'registrations.manage', 'certificates.manage']],
            'inquiry_manager' => ['Inquiry manager', ['analytics.view', 'inquiries.manage']],
        ];

        foreach ($roles as $name => [$label, $assignedPermissions]) {
            $roleId = DB::table('roles')->insertGetId([
                'name' => $name,
                'label' => $label,
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($assignedPermissions as $permissionName) {
                DB::table('permission_role')->insert([
                    'role_id' => $roleId,
                    'permission_id' => DB::table('permissions')->where('name', $permissionName)->value('id'),
                ]);
            }
        }

        $administratorRoleId = DB::table('roles')->where('name', 'administrator')->value('id');
        foreach (DB::table('users')->where('is_admin', true)->pluck('id') as $userId) {
            DB::table('role_user')->insert([
                'role_id' => $administratorRoleId,
                'user_id' => $userId,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('media');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropColumn('is_active');
        });
    }
};
