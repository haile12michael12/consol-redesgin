<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectImage;
use App\Models\User;
use Database\Seeders\ProjectSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_projects_are_paginated_filterable_and_published_only(): void
    {
        $category = $this->createCategory('construction-management');
        $project = $this->createProject('verified-project', ContentStatus::Published->value, [$category], [
            'year' => 2022,
            'project_type' => 'Institutional consultancy',
            'featured' => true,
            'client' => 'Approved Client',
            'client_approved' => true,
        ]);
        $this->createProject('another-project', ContentStatus::Published->value, [$category], [
            'year' => 2021,
        ]);
        $this->createProject('draft-project', ContentStatus::Draft->value, [$category], [
            'year' => 2022,
            'featured' => true,
        ]);

        $this->getJson('/api/projects?q=verified&category=construction-management&year=2022&featured=1&per_page=1')
            ->assertOk()
            ->assertJsonPath('data.0.slug', $project->slug)
            ->assertJsonPath('data.0.client', 'Approved Client')
            ->assertJsonPath('total', 1);

        $this->getJson('/api/projects/categories')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $category->slug);
        $this->getJson('/api/projects/types')
            ->assertOk()
            ->assertExactJson([[
                'value' => 'Institutional consultancy',
                'label' => 'Institutional consultancy',
            ]]);

        $this->getJson('/api/projects?project_type=Institutional%20consultancy')
            ->assertOk()
            ->assertJsonPath('data.0.slug', $project->slug)
            ->assertJsonPath('total', 1);

        $this->getJson('/api/projects/draft-project')->assertNotFound();
    }

    public function test_case_study_fields_are_returned_without_fabricated_fallbacks(): void
    {
        $project = $this->createProject('case-study-fields', ContentStatus::Published->value, [], [
            'project_type' => 'Research',
            'project_date' => '2024-06-15',
            'context' => 'Verified project context.',
            'objectives' => ['Verified objective.'],
            'challenge' => 'Documented challenge.',
            'approach' => 'Approved methodology.',
            'milestones' => [[
                'date' => '2024-06',
                'title' => 'Inception',
                'description' => 'Approved milestone.',
            ]],
            'outcomes' => ['Documented outcome.'],
        ]);

        $this->getJson('/api/projects/'.$project->slug)
            ->assertOk()
            ->assertJsonPath('projectType', 'Research')
            ->assertJsonPath('projectDate', '2024-06-15')
            ->assertJsonPath('context', 'Verified project context.')
            ->assertJsonPath('objectives.0', 'Verified objective.')
            ->assertJsonPath('challenge', 'Documented challenge.')
            ->assertJsonPath('approach', 'Approved methodology.')
            ->assertJsonPath('milestones.0.title', 'Inception')
            ->assertJsonPath('outcomes.0', 'Documented outcome.');
    }

    public function test_project_detail_hides_unapproved_client_and_location_and_returns_related_work(): void
    {
        $category = $this->createCategory('research');
        $project = $this->createProject('private-details-project', ContentStatus::Published->value, [$category], [
            'client' => 'Unapproved client',
            'location' => 'Unapproved location',
            'client_approved' => false,
            'location_approved' => false,
        ]);
        $related = $this->createProject('related-project', ContentStatus::Published->value, [$category]);

        $this->getJson('/api/projects/'.$project->slug)
            ->assertOk()
            ->assertJsonPath('client', null)
            ->assertJsonPath('location', null)
            ->assertJsonPath('relatedProjects.0.slug', $related->slug);
    }

    public function test_project_admin_requires_administrator_and_supports_image_upload_and_category_crud(): void
    {
        Storage::fake('local');
        $payload = [
            'name' => 'Verified category',
            'slug' => 'verified-category',
            'sort_order' => 5,
        ];

        $this->postJson('/api/admin/projects/categories', $payload)->assertUnauthorized();

        $editor = User::factory()->create(['is_admin' => false]);
        $this->actingAs($editor)->postJson('/api/admin/projects/categories', $payload)->assertForbidden();

        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();
        $category = $this->actingAs($administrator)
            ->postJson('/api/admin/projects/categories', $payload)
            ->assertCreated()
            ->assertJsonPath('slug', 'verified-category')
            ->json();

        $projectPayload = [
            'title' => 'Approved project',
            'slug' => 'approved-project',
            'summary' => 'Verified summary.',
            'overview' => 'Verified overview.',
            'project_type' => 'Verified project type',
            'project_date' => '2023-08-12',
            'context' => 'Verified project context',
            'objectives' => ['Verified objective'],
            'challenge' => 'Verified challenge',
            'approach' => 'Verified approach',
            'milestones' => [['date' => '2023-08', 'title' => 'Verified milestone']],
            'categories' => [$category['id']],
            'scope' => ['Verified scope item'],
            'services' => ['Verified service'],
            'outcomes' => [],
            'status' => 'draft',
            'featured' => '1',
            'images' => [UploadedFile::fake()->image('cover.jpg', 800, 600)],
            'image_alts' => ['Approved project cover photograph'],
        ];

        $this->post('/api/admin/projects', $projectPayload, ['Accept' => 'application/json'])
            ->assertCreated()
            ->assertJsonPath('status', 'draft')
            ->assertJsonPath('featured', true)
            ->assertJsonPath('images.0.alt', 'Approved project cover photograph');

        $project = Project::query()->where('slug', 'approved-project')->firstOrFail();
        $image = ProjectImage::query()->where('project_id', $project->id)->firstOrFail();
        Storage::disk('local')->assertExists($image->path);

        $this->putJson('/api/admin/projects/'.$project->id, [
            ...$projectPayload,
            'images' => [],
            'image_alts' => [],
            'status' => 'published',
            'client' => 'Unapproved client',
            'client_approved' => '0',
        ])->assertOk()->assertJsonPath('status', 'published');

        $this->getJson('/api/projects/approved-project')
            ->assertOk()
            ->assertJsonPath('client', null);

        $this->deleteJson('/api/admin/projects/'.$project->id)->assertOk();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
        Storage::disk('local')->assertMissing($image->path);

        $this->deleteJson('/api/admin/projects/categories/'.$category['id'])
            ->assertOk();
    }

    public function test_project_images_from_drafts_are_not_publicly_retrievable(): void
    {
        Storage::fake('local');
        $project = $this->createProject('draft-with-image', ContentStatus::Draft->value);
        $path = UploadedFile::fake()->image('draft.jpg')->store('projects', ['disk' => 'local']);
        $image = $project->images()->create([
            'path' => $path,
            'is_cover' => true,
            'sort_order' => 0,
        ]);

        $this->get('/api/project-images/'.$image->id)->assertNotFound();

        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();
        $this->actingAs($administrator)->get('/api/project-images/'.$image->id)->assertOk();
    }

    public function test_published_project_images_are_served_with_safe_headers(): void
    {
        Storage::fake('local');
        $project = $this->createProject('published-with-image', ContentStatus::Published->value);
        $path = UploadedFile::fake()->image('published.jpg')->store('projects', ['disk' => 'local']);
        $image = $project->images()->create([
            'path' => $path,
            'is_cover' => true,
            'sort_order' => 0,
        ]);

        $this->get('/api/project-images/'.$image->id)
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Cache-Control', 'max-age=3600, private');
    }

    public function test_project_seeder_contains_only_verified_engagements_without_invented_outcomes_or_photos(): void
    {
        $this->seed(ProjectSeeder::class);

        $this->assertSame(12, Project::query()->where('status', ContentStatus::Published->value)->count());

        $project = Project::query()
            ->with('images')
            ->where('slug', 'opm-maturity-improvement-construction-industry')
            ->firstOrFail();

        $this->assertSame([], $project->outcomes);
        $this->assertCount(0, $project->images);

        $this->seed(ProjectSeeder::class);
        $this->assertSame(12, Project::query()->count());
    }

    public function test_project_upload_validation_rejects_non_image_files(): void
    {
        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();
        $category = $this->createCategory('secure-upload');

        $this->actingAs($administrator)
            ->post('/api/admin/projects', [
                'title' => 'Validated project',
                'slug' => 'validated-project',
                'summary' => 'Verified summary.',
                'overview' => 'Verified overview.',
                'categories' => [$category->id],
                'status' => 'draft',
                'featured' => '0',
                'images' => [UploadedFile::fake()->create('payload.jpg', 10, 'text/plain')],
            ], ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['images.0']);

        $this->assertDatabaseMissing('projects', ['slug' => 'validated-project']);
    }

    private function createCategory(string $slug): ProjectCategory
    {
        return ProjectCategory::query()->create([
            'slug' => $slug,
            'name' => ucfirst($slug),
            'sort_order' => 0,
        ]);
    }

    private function createProject(string $slug, string $status, array $categories = [], array $overrides = []): Project
    {
        $project = Project::query()->create([
            'slug' => $slug,
            'title' => ucfirst(str_replace('-', ' ', $slug)),
            'summary' => 'Verified project summary.',
            'overview' => 'Verified project overview.',
            'scope' => ['Verified scope item'],
            'services' => [],
            'outcomes' => [],
            'status' => $status,
            'featured' => false,
            ...$overrides,
        ]);
        $project->categories()->sync(collect($categories)->pluck('id'));

        return $project;
    }
}
