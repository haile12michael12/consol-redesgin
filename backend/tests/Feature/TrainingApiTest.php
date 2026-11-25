<?php

namespace Tests\Feature;

use App\Enums\ContentStatus;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseSchedule;
use App\Models\Enrollment;
use App\Models\Instructor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrainingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_course_catalogue_and_profiles_only_expose_published_records(): void
    {
        $category = $this->createCategory();
        $course = $this->createCourse($category, ['featured' => true]);
        $instructor = Instructor::query()->create([
            'slug' => 'verified-instructor',
            'name' => 'Verified Instructor',
            'biography' => 'Approved biography.',
            'professional_background' => 'Approved background.',
            'status' => ContentStatus::Published->value,
        ]);
        $course->instructors()->attach($instructor);
        $this->createCourse($category, ['slug' => 'unpublished-course', 'status' => ContentStatus::Draft->value]);
        Instructor::query()->create([
            'slug' => 'draft-instructor',
            'name' => 'Draft Instructor',
            'status' => ContentStatus::Draft->value,
        ]);

        $this->getJson('/api/courses?category='.$category->slug)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', $course->slug)
            ->assertJsonPath('data.0.category.slug', $category->slug)
            ->assertJsonPath('data.0.instructors.0.name', $instructor->name);

        $this->getJson('/api/courses/unpublished-course')->assertNotFound();
        $this->getJson('/api/instructors')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $instructor->slug);
        $this->getJson('/api/courses/categories')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $category->slug);
    }

    public function test_public_schedule_and_registration_confirm_only_valid_open_schedule(): void
    {
        $category = $this->createCategory();
        $course = $this->createCourse($category, ['registration_enabled' => true]);
        $schedule = $this->createSchedule($course);

        $this->getJson('/api/schedules')
            ->assertOk()
            ->assertJsonPath('data.0.registrationOpen', true)
            ->assertJsonPath('data.0.course.slug', $course->slug);

        $payload = $this->registrationPayload($course, $schedule);
        $response = $this->postJson('/api/registrations', $payload)
            ->assertCreated()
            ->assertJsonPath('status', 'pending')
            ->assertJsonPath('course.slug', $course->slug);

        $this->assertDatabaseHas('enrollments', [
            'reference' => $response->json('reference'),
            'course_id' => $course->id,
            'course_schedule_id' => $schedule->id,
            'status' => 'pending',
        ]);
        $this->getJson('/api/registrations/'.$response->json('reference'))
            ->assertOk()
            ->assertJsonPath('reference', $response->json('reference'))
            ->assertJsonPath('schedule.label', $schedule->label);
    }

    public function test_registration_rejects_unpublished_courses_mismatched_schedules_and_missing_consent(): void
    {
        $category = $this->createCategory();
        $course = $this->createCourse($category, ['registration_enabled' => true]);
        $otherCourse = $this->createCourse($category, ['slug' => 'other-course']);
        $schedule = $this->createSchedule($otherCourse);

        $this->postJson('/api/registrations', $this->registrationPayload($course, $schedule))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['course_schedule_id']);

        $draft = $this->createCourse($category, [
            'slug' => 'draft-course',
            'status' => ContentStatus::Draft->value,
            'registration_enabled' => false,
        ]);
        $this->postJson('/api/registrations', $this->registrationPayload($draft))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['course_id']);

        $this->postJson('/api/registrations', [
            ...$this->registrationPayload($course),
            'consent' => false,
        ])->assertUnprocessable()->assertJsonValidationErrors(['consent']);

        $this->assertDatabaseCount('enrollments', 0);
    }

    public function test_closed_schedule_cannot_accept_registration(): void
    {
        $category = $this->createCategory();
        $course = $this->createCourse($category, ['registration_enabled' => true]);
        $schedule = $this->createSchedule($course, [
            'registration_closes_at' => now()->subDay(),
        ]);

        $this->getJson('/api/schedules')
            ->assertOk()
            ->assertJsonPath('data.0.registrationOpen', false);
        $this->postJson('/api/registrations', $this->registrationPayload($course, $schedule))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['course_schedule_id']);
    }

    public function test_training_administration_is_authorized_and_can_manage_verified_course_content(): void
    {
        $payload = [
            'name' => 'Construction management',
            'slug' => 'construction-management',
            'description' => 'Verified course category.',
        ];
        $this->postJson('/api/admin/training/categories', $payload)->assertUnauthorized();

        $editor = User::factory()->create(['is_admin' => false]);
        $this->actingAs($editor)->postJson('/api/admin/training/categories', $payload)->assertForbidden();

        $administrator = $this->createAdmin();
        $category = $this->actingAs($administrator)
            ->postJson('/api/admin/training/categories', $payload)
            ->assertCreated()
            ->json();

        $coursePayload = [
            'title' => 'Verified course',
            'slug' => 'verified-course',
            'course_category_id' => $category['id'],
            'summary' => 'Approved course summary.',
            'description' => 'Approved course description.',
            'learning_objectives' => ['Verified learning objective'],
            'curriculum' => [['title' => 'Verified topic', 'description' => 'Approved topic description.']],
            'requirements' => ['Verified entry requirement'],
            'faqs' => [['question' => 'Verified question?', 'answer' => 'Approved answer.']],
            'instructors' => [],
            'credential_verified' => false,
            'certificate_supported' => false,
            'registration_enabled' => false,
            'featured' => false,
            'status' => 'published',
        ];

        $created = $this->postJson('/api/admin/training/courses', $coursePayload)
            ->assertCreated()
            ->assertJsonPath('status', 'published')
            ->assertJsonPath('credential', null)
            ->assertJsonPath('learningObjectives.0', 'Verified learning objective')
            ->assertJsonPath('faqs.0.question', 'Verified question?')
            ->json();

        $this->putJson('/api/admin/training/courses/'.$created['id'], [
            ...$coursePayload,
            'title' => 'Updated verified course',
            'slug' => 'verified-course',
        ])->assertOk()->assertJsonPath('title', 'Updated verified course');

        $this->getJson('/api/courses/verified-course')->assertOk()
            ->assertJsonPath('credential', null)
            ->assertJsonPath('faqs.0.answer', 'Approved answer.');
    }

    public function test_certificate_requires_attendance_and_supported_course_and_verification_honours_revocation(): void
    {
        $administrator = $this->createAdmin();
        $category = $this->createCategory();
        $course = $this->createCourse($category, [
            'registration_enabled' => true,
            'certificate_supported' => true,
        ]);
        $registration = $this->postJson('/api/registrations', $this->registrationPayload($course))
            ->assertCreated()
            ->json();
        $enrollment = Enrollment::query()->where('reference', $registration['reference'])->firstOrFail();

        $this->actingAs($administrator)
            ->postJson('/api/admin/training/certificates/'.$enrollment->id)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['attendance']);

        $this->putJson('/api/admin/training/registrations/'.$enrollment->id.'/attendance', ['status' => 'attended'])
            ->assertOk()
            ->assertJsonPath('status', 'attended');

        $issued = $this->postJson('/api/admin/training/certificates/'.$enrollment->id)
            ->assertCreated()
            ->assertJsonPath('valid', true)
            ->json();
        $this->postJson('/api/certificates/verify', ['verification_code' => strtolower($issued['verificationCode'])])
            ->assertOk()
            ->assertJsonPath('valid', true)
            ->assertJsonPath('recipientName', 'Training Applicant');

        $this->deleteJson('/api/admin/training/certificates/'.$issued['id'])->assertOk();
        $this->postJson('/api/certificates/verify', ['verification_code' => $issued['verificationCode']])
            ->assertOk()
            ->assertJsonPath('valid', false);
    }

    public function test_course_image_is_not_publicly_retrievable_while_course_is_draft(): void
    {
        $category = $this->createCategory();
        $course = $this->createCourse($category, [
            'status' => ContentStatus::Draft->value,
            'image_path' => 'training/courses/private.jpg',
        ]);

        $this->get('/api/course-images/'.$course->id)->assertNotFound();
    }

    private function createCategory(): CourseCategory
    {
        return CourseCategory::query()->create([
            'name' => 'Verified category',
            'slug' => 'verified-category',
        ]);
    }

    private function createCourse(CourseCategory $category, array $overrides = []): Course
    {
        return Course::query()->create([
            'course_category_id' => $category->id,
            'title' => 'Verified course',
            'slug' => 'verified-course',
            'summary' => 'Approved course summary.',
            'description' => 'Approved course description.',
            'status' => ContentStatus::Published->value,
            'credential_verified' => false,
            'certificate_supported' => false,
            'registration_enabled' => false,
            'featured' => false,
            ...$overrides,
        ]);
    }

    private function createSchedule(Course $course, array $overrides = []): CourseSchedule
    {
        return CourseSchedule::query()->create([
            'course_id' => $course->id,
            'label' => 'Verified upcoming schedule',
            'starts_at' => now()->addDays(10),
            'ends_at' => now()->addDays(12),
            'status' => 'published',
            ...$overrides,
        ]);
    }

    private function registrationPayload(Course $course, ?CourseSchedule $schedule = null): array
    {
        return [
            'course_id' => $course->id,
            'course_schedule_id' => $schedule?->id,
            'full_name' => 'Training Applicant',
            'email' => 'applicant@example.com',
            'phone' => '+251 911 123 456',
            'organization' => 'Applicant Organization',
            'preferred_schedule' => null,
            'additional_information' => null,
            'consent' => true,
        ];
    }

    private function createAdmin(): User
    {
        $administrator = User::factory()->create();
        $administrator->forceFill(['is_admin' => true])->save();

        return $administrator;
    }
}
