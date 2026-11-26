<?php

namespace Tests\Feature;

use App\Models\CorporateEvent;
use App\Models\NewsArticle;
use App\Models\NewsCategory;
use App\Models\ResourceDocument;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class NewsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_news_filters_published_articles_and_returns_related_content(): void
    {
        $category = NewsCategory::query()->create(['slug' => 'approved-news', 'name' => 'Approved news']);
        $article = $this->createArticle('published-news', 'published', $category, ['featured' => true]);
        $related = $this->createArticle('related-news', 'published', $category);
        $this->createArticle('draft-news', 'draft', $category);
        $this->createArticle('future-news', 'scheduled', $category, ['published_at' => now()->addDay()]);

        $this->getJson('/api/news?category=approved-news&featured=1&per_page=1')
            ->assertOk()
            ->assertJsonPath('data.0.slug', $article->slug)
            ->assertJsonPath('total', 1);

        $this->getJson('/api/news/'.$article->slug)
            ->assertOk()
            ->assertJsonPath('relatedArticles.0.slug', $related->slug);

        $this->getJson('/api/news/draft-news')->assertNotFound();
        $this->getJson('/api/news/future-news')->assertNotFound();
    }

    public function test_scheduled_articles_are_public_only_after_their_publication_time(): void
    {
        $article = $this->createArticle('released-scheduled-news', 'scheduled', null, [
            'published_at' => now()->subMinute(),
        ]);

        $this->getJson('/api/news/'.$article->slug)->assertOk();
    }

    public function test_events_are_published_only_and_split_by_start_and_end_time(): void
    {
        $past = $this->createEvent('past-approved-event', now()->subDays(3), now()->subDays(2));
        $upcoming = $this->createEvent('upcoming-approved-event', now()->addDays(3));
        $this->createEvent('draft-event', now()->addDay(), null, 'draft');

        $this->getJson('/api/events?period=past')
            ->assertOk()
            ->assertJsonPath('data.0.slug', $past->slug)
            ->assertJsonPath('total', 1);
        $this->getJson('/api/events?period=upcoming')
            ->assertOk()
            ->assertJsonPath('data.0.slug', $upcoming->slug)
            ->assertJsonPath('total', 1);
        $this->getJson('/api/events/draft-event')->assertNotFound();
    }

    public function test_events_admin_filters_and_permissions_allow_assigned_content_editors(): void
    {
        $matching = $this->createEvent('matching-draft-event', now()->addDays(3), null, 'draft');
        $this->createEvent('other-published-event', now()->addDays(4), null, 'published');

        $editor = User::factory()->create(['is_admin' => false]);
        $editor->roles()->attach(Role::query()->where('name', 'content_editor')->firstOrFail());

        $this->actingAs($editor)
            ->getJson('/api/admin/events?q=matching&status=draft')
            ->assertOk()
            ->assertJsonPath('data.0.id', $matching->id)
            ->assertJsonPath('total', 1);

        $this->actingAs($editor)->post('/api/admin/events', [
            'title' => 'Editor-created event',
            'slug' => 'editor-created-event',
            'summary' => 'An event created by an assigned content editor.',
            'starts_at' => now()->addDays(5)->toDateTimeString(),
            'venue' => 'CONSOL',
            'status' => 'draft',
        ], ['Accept' => 'application/json'])->assertCreated();
    }

    public function test_resource_download_requires_public_approval_and_published_status(): void
    {
        Storage::fake('local');
        $published = $this->createResource('public-approved-resource', true, 'published');
        $draft = $this->createResource('draft-resource', true, 'draft');
        $unapproved = $this->createResource('unapproved-resource', false, 'published');

        $this->get('/api/resources')->assertOk()->assertJsonPath('data.0.slug', $published->slug);
        $this->get(route('api.resources.download', $published))->assertOk();
        $this->get(route('api.resources.download', $draft))->assertNotFound();
        $this->get(route('api.resources.download', $unapproved))->assertNotFound();
    }

    public function test_administrator_can_create_approved_resource_and_non_admin_is_denied(): void
    {
        Storage::fake('local');
        $payload = [
            'title' => 'Approved publication',
            'slug' => 'approved-publication',
            'description' => 'A publication cleared for public release.',
            'file' => UploadedFile::fake()->create('approved-publication.pdf', 200, 'application/pdf'),
            'approved_for_publication' => '1',
            'status' => 'published',
        ];

        $this->post('/api/admin/resources', $payload, ['Accept' => 'application/json'])->assertUnauthorized();
        $editor = User::factory()->create(['is_admin' => false]);
        $this->actingAs($editor)->post('/api/admin/resources', $payload, ['Accept' => 'application/json'])->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();
        $response = $this->actingAs($admin)
            ->post('/api/admin/resources', $payload, ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('status', 'published')
            ->assertJsonPath('approvedForPublication', true);

        $resource = ResourceDocument::query()->where('slug', 'approved-publication')->firstOrFail();
        Storage::disk('local')->assertExists($resource->file_path);
        $this->getJson('/api/resources')->assertJsonPath('data.0.slug', 'approved-publication');
        $this->assertNotEmpty($response->json('downloadUrl'));
    }

    public function test_resource_upload_rejects_non_pdf_files(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['is_admin' => true])->save();

        $this->actingAs($admin)->post('/api/admin/resources', [
            'title' => 'Invalid document',
            'slug' => 'invalid-document',
            'description' => 'Should be rejected.',
            'file' => UploadedFile::fake()->create('bad.pdf', 20, 'text/plain'),
            'approved_for_publication' => '0',
            'status' => 'draft',
        ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file']);
    }

    private function createArticle(string $slug, string $status, ?NewsCategory $category = null, array $overrides = []): NewsArticle
    {
        return NewsArticle::query()->create([
            'news_category_id' => $category?->id,
            'slug' => $slug,
            'title' => ucfirst(str_replace('-', ' ', $slug)),
            'excerpt' => 'Verified published article excerpt.',
            'body' => 'Verified article body.',
            'status' => $status,
            'featured' => false,
            'published_at' => now()->subDay(),
            ...$overrides,
        ]);
    }

    private function createEvent(string $slug, $startsAt, $endsAt = null, string $status = 'published'): CorporateEvent
    {
        return CorporateEvent::query()->create([
            'slug' => $slug,
            'title' => ucfirst(str_replace('-', ' ', $slug)),
            'summary' => 'Verified event summary.',
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'venue' => 'Approved event venue',
            'status' => $status,
            'published_at' => now()->subDay(),
        ]);
    }

    private function createResource(string $slug, bool $approved, string $status): ResourceDocument
    {
        $file = UploadedFile::fake()->create($slug.'.pdf', 100, 'application/pdf');
        $path = $file->store('resources', ['disk' => 'local']);

        return ResourceDocument::query()->create([
            'slug' => $slug,
            'title' => ucfirst(str_replace('-', ' ', $slug)),
            'description' => 'Approved resource description.',
            'file_path' => $path,
            'file_name' => $slug.'.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => $file->getSize(),
            'approved_for_publication' => $approved,
            'status' => $status,
            'published_at' => now()->subDay(),
        ]);
    }
}
