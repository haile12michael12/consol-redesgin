<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Enrollment;
use App\Models\Inquiry;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardAnalyticsTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_401_without_authentication_and_403_for_non_admins(): void
    {
        $this->getJson('/api/admin/analytics')->assertUnauthorized();

        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)->getJson('/api/admin/analytics')->assertForbidden();
    }

    public function test_admin_receives_live_content_counts_and_monthly_request_series(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 25)->setTime(12, 0));

        $category = CourseCategory::query()->create([
            'slug' => 'analytics-category',
            'name' => 'Analytics category',
        ]);
        $course = Course::query()->create([
            'course_category_id' => $category->id,
            'slug' => 'analytics-course',
            'title' => 'Analytics course',
            'summary' => 'Course summary',
            'description' => 'Course description',
            'status' => 'published',
        ]);
        Service::query()->create([
            'slug' => 'published-service',
            'title' => 'Published service',
            'category' => 'research',
            'summary' => 'Published service summary',
            'status' => 'published',
        ]);
        Service::query()->create([
            'slug' => 'draft-service',
            'title' => 'Draft service',
            'category' => 'research',
            'summary' => 'Draft service summary',
            'status' => 'draft',
        ]);
        Project::query()->create([
            'slug' => 'analytics-project',
            'title' => 'Analytics project',
            'summary' => 'Project summary',
            'overview' => 'Project overview',
            'status' => 'draft',
        ]);
        Enrollment::query()->create([
            'reference' => '2f4833a6-39ca-4bdb-92e1-9c65039bf85c',
            'course_id' => $course->id,
            'full_name' => 'Training Applicant',
            'email' => 'applicant@example.com',
            'phone' => '+251911123456',
            'status' => 'pending',
            'consent_at' => now(),
        ]);
        NewsArticle::query()->create([
            'slug' => 'analytics-article',
            'title' => 'Analytics article',
            'excerpt' => 'Article excerpt',
            'body' => 'Article body',
            'status' => 'draft',
        ]);
        Inquiry::query()->create([
            'type' => 'contact',
            'name' => 'Current Contact',
            'email' => 'current@example.com',
            'subject' => 'Current enquiry',
            'project_description' => 'A current enquiry for dashboard analytics.',
            'status' => 'new',
        ]);

        $administrator = User::factory()->create(['is_admin' => true]);

        $this->actingAs($administrator)
            ->getJson('/api/admin/analytics')
            ->assertOk()
            ->assertJsonPath('counts.totalInquiries', 1)
            ->assertJsonPath('counts.publishedServices', 1)
            ->assertJsonPath('counts.totalProjects', 1)
            ->assertJsonPath('counts.trainingCourses', 1)
            ->assertJsonPath('counts.trainingRegistrations', 1)
            ->assertJsonPath('counts.newsArticles', 1)
            ->assertJsonPath('charts.inquiries.5.count', 1)
            ->assertJsonPath('charts.registrations.5.count', 1);
    }

    public function test_successful_admin_mutations_appear_in_recent_activity(): void
    {
        $administrator = User::factory()->create(['is_admin' => true]);

        $this->actingAs($administrator)
            ->postJson('/api/admin/services', [
                'slug' => 'audited-service',
                'title' => 'Audited service',
                'category' => 'research',
                'summary' => 'A service created to verify recent activity.',
                'status' => 'draft',
            ])
            ->assertCreated();

        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $administrator->id,
            'action' => 'created',
            'resource' => 'services',
        ]);

        $this->getJson('/api/admin/analytics')
            ->assertOk()
            ->assertJsonPath('recentActivity.0.action', 'created')
            ->assertJsonPath('recentActivity.0.resource', 'services')
            ->assertJsonPath('recentActivity.0.actor', $administrator->name);
    }
}
