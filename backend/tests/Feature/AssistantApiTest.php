<?php

namespace Tests\Feature;

use App\Models\Service;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AssistantApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_assistant_uses_published_content_and_returns_only_valid_source_links(): void
    {
        config(['services.openai.api_key' => 'server-only-key']);
        $published = Service::query()->create([
            'slug' => 'approved-service',
            'title' => 'Approved service',
            'category' => 'construction-management',
            'summary' => 'Published construction management information.',
            'description' => 'The published project management service.',
            'status' => 'published',
        ]);
        Service::query()->create([
            'slug' => 'draft-service',
            'title' => 'Draft service',
            'category' => 'construction-management',
            'summary' => 'Draft project management information.',
            'status' => 'draft',
        ]);
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [[
                    'message' => [
                        'content' => json_encode([
                            'answer' => 'The published service offers project management.',
                            'source_ids' => ['service:'.$published->slug, 'untrusted:source'],
                        ], JSON_THROW_ON_ERROR),
                    ],
                ]],
            ]),
        ]);

        $this->postJson('/api/assistant/chat', ['message' => 'Tell me about project management services'])
            ->assertOk()
            ->assertJsonPath('answer', 'The published service offers project management.')
            ->assertJsonPath('sources.0.title', 'Approved service')
            ->assertJsonPath('sources.0.url', '/services/approved-service')
            ->assertJsonCount(1, 'sources');

        Http::assertSent(fn (HttpRequest $request) => $request->hasHeader('Authorization', 'Bearer server-only-key')
            && str_contains($request->data()['messages'][1]['content'], 'Published construction management information.')
            && ! str_contains($request->data()['messages'][1]['content'], 'Draft service'));
    }

    public function test_assistant_returns_a_contact_fallback_without_calling_the_provider_when_no_content_matches(): void
    {
        Http::fake();

        $this->postJson('/api/assistant/chat', ['message' => 'Tell me about an unpublished zyxwv topic'])
            ->assertOk()
            ->assertJsonPath('sources', [])
            ->assertJsonPath('contactUrl', '/contact')
            ->assertJsonPath('answer', 'I could not find approved published information about that. Please contact CONSOL for help.');

        Http::assertNothingSent();
    }

    public function test_assistant_reports_missing_provider_configuration_and_validates_input(): void
    {
        Service::query()->create([
            'slug' => 'published-service',
            'title' => 'Published service',
            'category' => 'construction-management',
            'summary' => 'Published construction service information.',
            'status' => 'published',
        ]);
        config(['services.openai.api_key' => null]);

        $this->postJson('/api/assistant/chat', ['message' => 'Tell me about construction services'])
            ->assertStatus(503)
            ->assertJsonStructure(['message']);

        $this->postJson('/api/assistant/chat', ['message' => str_repeat('a', 1201)])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['message']);
    }

    public function test_assistant_reports_provider_failures_without_exposing_provider_details(): void
    {
        config(['services.openai.api_key' => 'server-only-key']);
        Service::query()->create([
            'slug' => 'published-service',
            'title' => 'Published service',
            'category' => 'construction-management',
            'summary' => 'Published construction service information.',
            'status' => 'published',
        ]);
        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response(['error' => 'private provider detail'], 500),
        ]);

        $this->postJson('/api/assistant/chat', ['message' => 'Tell me about construction services'])
            ->assertStatus(502)
            ->assertJsonMissing(['message' => 'private provider detail'])
            ->assertJsonPath('message', 'The CONSOL assistant is temporarily unavailable. Please try again or contact CONSOL.');
    }
}
