<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_published_pages_are_public_and_admins_can_manage_pages(): void
    {
        $this->getJson('/api/admin/pages')->assertUnauthorized();
        $administrator = User::factory()->create(['is_admin' => true]);

        $published = $this->actingAs($administrator)
            ->postJson('/api/admin/pages', [
                'title' => 'Verified page',
                'slug' => 'verified-page',
                'path' => '/verified-page',
                'content' => 'Reviewed page content.',
                'status' => 'published',
            ])
            ->assertCreated()
            ->json();
        $draft = $this->postJson('/api/admin/pages', [
            'title' => 'Private draft',
            'slug' => 'private-draft',
            'path' => '/private-draft',
            'content' => 'Unpublished page content.',
            'status' => 'draft',
        ])->assertCreated()->json();

        $this->getJson('/api/pages')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'verified-page');
        $this->getJson('/api/pages/private-draft')->assertNotFound();

        $this->putJson('/api/admin/pages/'.$published['id'], [
            'title' => 'Updated verified page',
            'slug' => 'verified-page',
            'path' => '/verified-page',
            'content' => 'Updated reviewed page content.',
            'status' => 'published',
        ])->assertOk()->assertJsonPath('title', 'Updated verified page');

        $this->deleteJson('/api/admin/pages/'.$draft['id'])->assertOk();
        $this->assertDatabaseMissing('pages', ['id' => $draft['id']]);
    }
}
