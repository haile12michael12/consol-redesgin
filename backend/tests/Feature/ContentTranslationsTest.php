<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\ContentTranslation;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Role;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContentTranslationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_amharic_content_is_not_public_until_an_authorized_administrator_approves_it(): void
    {
        $service = Service::query()->create([
            'slug' => 'translation-service',
            'title' => 'English title',
            'category' => 'training',
            'summary' => 'English summary',
            'status' => ContentStatus::Published->value,
        ]);
        $editor = User::factory()->create(['is_admin' => false]);
        $editor->roles()->attach(Role::query()->where('name', 'content_editor')->firstOrFail());

        $payload = [
            'fields' => [
                'title' => 'የአማርኛ ርዕስ',
                'summary' => 'የአማርኛ ማጠቃለያ',
            ],
            'status' => 'pending_review',
        ];

        $this->actingAs($editor)
            ->putJson("/api/admin/translations/services/{$service->id}", $payload)
            ->assertOk()
            ->assertJsonPath('status', 'pending_review');

        $this->actingAs($editor)
            ->postJson("/api/admin/translations/services/{$service->id}/approve")
            ->assertForbidden();

        $this->getJson('/api/services/translation-service', ['Accept-Language' => 'am'])
            ->assertOk()
            ->assertJsonPath('title', 'English title')
            ->assertJsonPath('summary', 'English summary');

        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();
        $this->actingAs($administrator)
            ->postJson("/api/admin/translations/services/{$service->id}/approve")
            ->assertOk()
            ->assertJsonPath('status', 'published');

        $this->getJson('/api/services/translation-service', ['Accept-Language' => 'am'])
            ->assertOk()
            ->assertJsonPath('title', 'የአማርኛ ርዕስ')
            ->assertJsonPath('summary', 'የአማርኛ ማጠቃለያ');

        $this->actingAs($editor)
            ->putJson("/api/admin/translations/services/{$service->id}", [
                'fields' => ['title' => 'አዲስ ረቂቅ', 'summary' => 'አዲስ ማጠቃለያ'],
                'status' => 'pending_review',
            ])
            ->assertOk();

        $this->getJson('/api/services/translation-service', ['Accept-Language' => 'am'])
            ->assertOk()
            ->assertJsonPath('title', 'የአማርኛ ርዕስ');

        $this->assertDatabaseHas('content_translations', [
            'translatable_type' => Service::class,
            'translatable_id' => $service->id,
            'status' => 'pending_review',
            'reviewed_by' => $administrator->id,
        ]);
    }

    public function test_published_translations_are_applied_to_news_projects_and_training_responses(): void
    {
        $project = Project::query()->create([
            'slug' => 'translated-project',
            'title' => 'English project',
            'summary' => 'English project summary',
            'overview' => 'English overview',
            'status' => ContentStatus::Published->value,
        ]);
        $article = NewsArticle::query()->create([
            'slug' => 'translated-article',
            'title' => 'English article',
            'excerpt' => 'English excerpt',
            'body' => 'English body',
            'status' => ContentStatus::Published->value,
            'published_at' => now(),
        ]);
        $category = CourseCategory::query()->create([
            'slug' => 'translated-course-category',
            'name' => 'English category',
            'sort_order' => 0,
        ]);
        $course = Course::query()->create([
            'course_category_id' => $category->id,
            'slug' => 'translated-course',
            'title' => 'English course',
            'summary' => 'English course summary',
            'description' => 'English course description',
            'status' => ContentStatus::Published->value,
        ]);

        foreach ([
            [$project, ['title' => 'የፕሮጀክት ርዕስ', 'summary' => 'የፕሮጀክት ማጠቃለያ', 'overview' => 'የፕሮጀክት እይታ']],
            [$article, ['title' => 'የዜና ርዕስ', 'excerpt' => 'የዜና ማጠቃለያ', 'body' => 'የዜና ይዘት']],
            [$course, ['title' => 'የኮርስ ርዕስ', 'summary' => 'የኮርስ ማጠቃለያ', 'description' => 'የኮርስ መግለጫ']],
        ] as [$record, $fields]) {
            $record->translations()->create([
                'locale' => 'am',
                'fields' => $fields,
                'published_fields' => $fields,
                'status' => 'published',
            ]);
        }

        $headers = ['Accept-Language' => 'am'];
        $this->getJson('/api/projects/translated-project', $headers)
            ->assertOk()
            ->assertJsonPath('title', 'የፕሮጀክት ርዕስ');
        $this->getJson('/api/news/translated-article', $headers)
            ->assertOk()
            ->assertJsonPath('title', 'የዜና ርዕስ')
            ->assertJsonPath('body.0', 'የዜና ይዘት');
        $this->getJson('/api/courses/translated-course', $headers)
            ->assertOk()
            ->assertJsonPath('title', 'የኮርስ ርዕስ')
            ->assertJsonPath('summary', 'የኮርስ ማጠቃለያ');
    }
}
