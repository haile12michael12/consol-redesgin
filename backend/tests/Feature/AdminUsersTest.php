<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUsersTest extends TestCase
{
    use RefreshDatabase;

    public function test_admins_can_create_users_assign_roles_and_manage_custom_roles(): void
    {
        $this->getJson('/api/admin/users')->assertUnauthorized();
        $administrator = User::factory()->create(['is_admin' => true]);
        $trainingRole = Role::query()->where('name', 'training_manager')->firstOrFail();

        $created = $this->actingAs($administrator)
            ->postJson('/api/admin/users', [
                'name' => 'Training Staff',
                'email' => 'training.staff@example.com',
                'password' => 'SecurePassword!123',
                'role_ids' => [$trainingRole->id],
            ])
            ->assertCreated()
            ->assertJsonPath('roles.0.name', 'training_manager')
            ->json();

        $this->assertDatabaseHas('users', [
            'id' => $created['id'],
            'email' => 'training.staff@example.com',
            'is_active' => true,
        ]);
        $this->getJson('/api/admin/users')
            ->assertOk()
            ->assertJsonMissingPath('data.0.password');

        $permission = Permission::query()->where('name', 'news.manage')->firstOrFail();
        $role = $this->postJson('/api/admin/roles', [
            'name' => 'news_reviewer',
            'label' => 'News reviewer',
            'permission_ids' => [$permission->id],
        ])->assertCreated()->json();
        $this->putJson('/api/admin/roles/'.$role['id'], [
            'label' => 'Senior news reviewer',
            'permission_ids' => [$permission->id],
        ])->assertOk()->assertJsonPath('label', 'Senior news reviewer');
        $this->deleteJson('/api/admin/roles/'.$role['id'])->assertOk();
    }

    public function test_admin_cannot_deactivate_their_own_account(): void
    {
        $administrator = User::factory()->create(['is_admin' => true]);

        $this->actingAs($administrator)
            ->putJson('/api/admin/users/'.$administrator->id, [
                'is_active' => false,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['is_active']);
    }
}
