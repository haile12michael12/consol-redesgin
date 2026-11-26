<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ServicesApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_api_only_returns_published_services_and_resolves_by_slug(): void
    {
        $published = $this->createService('published');
        $this->createService('draft');

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $published->slug);

        $this->getJson('/api/services/'.$published->slug)
            ->assertOk()
            ->assertJsonPath('slug', $published->slug)
            ->assertJsonPath('benefits', []);

        $this->getJson('/api/services/draft')
            ->assertNotFound();
    }

    public function test_service_changes_require_an_administrator_and_support_crud(): void
    {
        $payload = [
            'title' => 'Verified consultancy',
            'slug' => 'verified-consultancy',
            'category' => 'construction-management',
            'summary' => 'Published description from CONSOL.',
            'scope' => ['Published scope item'],
            'status' => 'draft',
        ];

        $this->postJson('/api/admin/services', $payload)->assertUnauthorized();

        $editor = User::factory()->create(['is_admin' => false]);
        $this->actingAs($editor)->postJson('/api/admin/services', $payload)->assertForbidden();

        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();
        $this->actingAs($administrator)
            ->postJson('/api/admin/services', $payload)
            ->assertCreated()
            ->assertJsonPath('status', 'draft');

        $service = Service::query()->where('slug', $payload['slug'])->firstOrFail();
        $this->assertDatabaseHas('services', ['id' => $service->id, 'status' => 'draft']);

        $this->putJson('/api/admin/services/'.$service->id, [
            ...$payload,
            'status' => 'published',
        ])->assertOk()->assertJsonPath('status', 'published');

        $this->getJson('/api/services')->assertJsonCount(1);
        $this->deleteJson('/api/admin/services/'.$service->id)->assertOk();
        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    public function test_admin_session_login_and_logout(): void
    {
        $administrator = User::factory()->create([
            'password' => Hash::make('valid-password'),
        ]);
        $administrator->forceFill(['is_admin' => true])->save();

        $this->withHeader('Origin', 'http://localhost');
        $this->getJson('/api/auth/me')->assertUnauthorized();
        $this->get('/sanctum/csrf-cookie')->assertNoContent();

        $this->postJson('/api/auth/login', [
            'email' => $administrator->email,
            'password' => 'valid-password',
        ])->assertOk()->assertJsonPath('user.is_admin', true);

        $this->getJson('/api/auth/me')->assertOk()->assertJsonPath('user.email', $administrator->email);
        $this->postJson('/api/auth/logout')->assertOk();
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    private function createService(string $status): Service
    {
        return Service::query()->create([
            'slug' => $status,
            'title' => ucfirst($status).' service',
            'category' => 'construction-management',
            'summary' => 'Service summary.',
            'scope' => ['Published scope item'],
            'status' => $status,
        ]);
    }
}
