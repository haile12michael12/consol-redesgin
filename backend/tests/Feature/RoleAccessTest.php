<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_training_manager_can_access_training_but_not_page_management(): void
    {
        $trainingManager = User::factory()->create(['is_admin' => false]);
        $trainingRole = Role::query()->where('name', 'training_manager')->firstOrFail();
        $trainingManager->roles()->attach($trainingRole);

        $this->assertDatabaseHas('role_user', ['role_id' => $trainingRole->id, 'user_id' => $trainingManager->id]);
        $this->assertTrue($trainingManager->is_active);
        $this->assertTrue($trainingManager->canAccessAdmin());
        $this->assertTrue($trainingManager->hasPermission('training.manage'));

        $this->actingAs($trainingManager)
            ->getJson('/api/admin/training/courses')
            ->assertOk();
        $this->getJson('/api/admin/pages')->assertForbidden();
    }

    public function test_inactive_administrator_cannot_access_admin_endpoints(): void
    {
        $administrator = User::factory()->create([
            'is_admin' => true,
            'is_active' => false,
        ]);

        $this->actingAs($administrator)
            ->getJson('/api/admin/analytics')
            ->assertForbidden();
    }

    public function test_configured_project_manager_can_manage_projects_but_not_training(): void
    {
        $manager = User::factory()->create(['is_admin' => false]);
        $role = Role::query()->where('name', 'project_manager')->firstOrFail();
        $manager->roles()->attach($role);

        $this->actingAs($manager)->getJson('/api/admin/projects')->assertOk();
        $this->getJson('/api/admin/training/courses')->assertForbidden();
        $this->assertFalse($manager->hasPermission('events.manage'));
    }
}
