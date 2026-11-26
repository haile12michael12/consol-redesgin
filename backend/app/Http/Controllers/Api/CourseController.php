<?php

namespace App\Http\Controllers\Api;

use App\Enums\ContentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseSchedule;
use App\Models\Instructor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'category' => ['nullable', 'string', 'max:255'],
            'featured' => ['nullable', 'boolean'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:24'],
        ]);

        $courses = Course::query()
            ->where('status', ContentStatus::Published->value)
            ->with([
                'translations' => fn ($query) => $query->where('locale', 'am'),
                'category',
                'instructors' => fn ($query) => $query->where('status', ContentStatus::Published->value),
                'schedules' => fn ($query) => $query
                    ->where('status', 'published')
                    ->where('starts_at', '>', now()),
            ])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('summary', 'like', '%'.$term.'%')
                        ->orWhere('description', 'like', '%'.$term.'%');
                });
            })
            ->when($filters['category'] ?? null, fn (Builder $query, string $slug) => $query->whereHas(
                'category',
                fn (Builder $categories) => $categories->where('slug', $slug),
            ))
            ->when(isset($filters['featured']), fn (Builder $query) => $query->where('featured', $filters['featured']))
            ->orderByDesc('featured')
            ->orderBy('title')
            ->paginate($filters['per_page'] ?? 9)
            ->through(fn (Course $course) => $this->presentCourse($course, false, $this->locale($request)));

        return response()->json($courses);
    }

    public function categories(): JsonResponse
    {
        return response()->json(
            CourseCategory::query()
                ->whereHas('courses', fn (Builder $courses) => $courses->where('status', ContentStatus::Published->value))
                ->withCount(['courses as course_count' => fn (Builder $courses) => $courses->where(
                    'status',
                    ContentStatus::Published->value,
                )])
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (CourseCategory $category) => $this->presentCategory($category)),
        );
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $course = Course::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::Published->value)
            ->with([
                'translations' => fn ($query) => $query->where('locale', 'am'),
                'category',
                'instructors' => fn ($query) => $query->where('status', ContentStatus::Published->value),
                'schedules' => fn ($query) => $query
                    ->where('status', 'published')
                    ->where('starts_at', '>', now()),
            ])
            ->firstOrFail();
        $locale = $this->locale($request);

        $related = Course::query()
            ->where('course_category_id', $course->course_category_id)
            ->where('id', '<>', $course->id)
            ->where('status', ContentStatus::Published->value)
            ->with(['category', 'instructors' => fn ($query) => $query->where(
                'status',
                ContentStatus::Published->value,
            ), 'translations' => fn ($query) => $query->where('locale', 'am')])
            ->orderByDesc('featured')
            ->orderBy('title')
            ->limit(3)
            ->get()
            ->map(fn (Course $item) => $this->presentCourse($item, false, $locale));

        return response()->json([
            ...$this->presentCourse($course, false, $locale),
            'relatedCourses' => $related,
        ]);
    }

    public function instructors(): JsonResponse
    {
        return response()->json(
            Instructor::query()
                ->where('status', ContentStatus::Published->value)
                ->with(['courses' => fn ($query) => $query
                    ->where('status', ContentStatus::Published->value)
                    ->orderBy('title')])
                ->orderBy('name')
                ->get()
                ->map(fn (Instructor $instructor) => $this->presentInstructor($instructor)),
        );
    }

    public function instructor(string $slug): JsonResponse
    {
        $instructor = Instructor::query()
            ->where('slug', $slug)
            ->where('status', ContentStatus::Published->value)
            ->with(['courses' => fn ($query) => $query
                ->where('status', ContentStatus::Published->value)
                ->orderBy('title')])
            ->firstOrFail();

        return response()->json($this->presentInstructor($instructor));
    }

    public function schedules(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'course' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $schedules = CourseSchedule::query()
            ->where('status', 'published')
            ->where('starts_at', '>', now())
            ->whereHas('course', fn (Builder $courses) => $courses->where('status', ContentStatus::Published->value))
            ->with(['course.category'])
            ->when($filters['course'] ?? null, fn (Builder $query, string $slug) => $query->whereHas(
                'course',
                fn (Builder $courses) => $courses->where('slug', $slug),
            ))
            ->orderBy('starts_at')
            ->paginate($filters['per_page'] ?? 20)
            ->through(fn (CourseSchedule $schedule) => $this->presentSchedule($schedule, true));

        return response()->json($schedules);
    }

    public function image(Request $request, Course $course)
    {
        abort_unless(
            $course->status === ContentStatus::Published->value || $request->user()?->isAdministrator(),
            404,
        );
        abort_unless($course->image_path && Storage::disk('local')->exists($course->image_path), 404);

        return Storage::disk('local')->response(
            $course->image_path,
            null,
            [
                'Cache-Control' => 'private, max-age=3600',
                'X-Content-Type-Options' => 'nosniff',
                'Content-Security-Policy' => "default-src 'none'; sandbox",
            ],
        );
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Course::class);
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $courses = Course::query()
            ->with(['category', 'instructors', 'schedules'])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('title', 'like', '%'.$term.'%')
                        ->orWhere('slug', 'like', '%'.$term.'%');
                });
            })
            ->orderByDesc('updated_at')
            ->paginate($filters['per_page'] ?? 20)
            ->through(fn (Course $course) => $this->presentCourse($course, true));

        return response()->json($courses);
    }

    public function store(StoreCourseRequest $request): JsonResponse
    {
        $this->authorize('create', Course::class);
        $course = $this->saveCourse($request);

        return response()->json($this->presentCourse($course, true), 201);
    }

    public function update(StoreCourseRequest $request, Course $course): JsonResponse
    {
        $this->authorize('update', $course);
        $course = $this->saveCourse($request, $course);

        return response()->json($this->presentCourse($course, true));
    }

    public function destroy(Course $course): JsonResponse
    {
        $this->authorize('delete', $course);
        if ($course->enrollments()->exists()) {
            return response()->json([
                'message' => 'A course with registrations cannot be deleted. Unpublish it instead.',
            ], 409);
        }

        $path = $course->image_path;
        $course->delete();
        $this->deleteStoredFile($path);

        return response()->json(['message' => 'Course deleted.']);
    }

    public function adminCategories(): JsonResponse
    {
        $this->authorize('manage', Course::class);

        return response()->json(
            CourseCategory::query()->withCount('courses')->orderBy('sort_order')->orderBy('name')->get()
                ->map(fn (CourseCategory $category) => $this->presentCategory($category, true)),
        );
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $category = CourseCategory::query()->create($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:course_categories,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category), 201);
    }

    public function updateCategory(Request $request, CourseCategory $category): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $category->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('course_categories', 'slug')->ignore($category->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]));

        return response()->json($this->presentCategory($category->refresh(), true));
    }

    public function destroyCategory(CourseCategory $category): JsonResponse
    {
        $this->authorize('manage', Course::class);
        if ($category->courses()->exists()) {
            return response()->json(['message' => 'Remove this category from its courses before deleting it.'], 409);
        }

        $category->delete();

        return response()->json(['message' => 'Course category deleted.']);
    }

    public function adminInstructors(): JsonResponse
    {
        $this->authorize('manage', Course::class);

        return response()->json(
            Instructor::query()->with('courses')->orderBy('name')->get()
                ->map(fn (Instructor $instructor) => $this->presentInstructor($instructor, true)),
        );
    }

    public function storeInstructor(Request $request): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $instructor = Instructor::query()->create($this->validateInstructor($request));

        return response()->json($this->presentInstructor($instructor, true), 201);
    }

    public function updateInstructor(Request $request, Instructor $instructor): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $instructor->update($this->validateInstructor($request, $instructor));

        return response()->json($this->presentInstructor($instructor->fresh('courses'), true));
    }

    public function destroyInstructor(Instructor $instructor): JsonResponse
    {
        $this->authorize('manage', Course::class);
        if ($instructor->courses()->exists()) {
            return response()->json(['message' => 'Remove this instructor from courses before deleting the profile.'], 409);
        }

        $instructor->delete();

        return response()->json(['message' => 'Instructor profile deleted.']);
    }

    public function adminSchedules(Course $course): JsonResponse
    {
        $this->authorize('manage', Course::class);

        return response()->json($course->schedules()->orderBy('starts_at')->get()
            ->map(fn (CourseSchedule $schedule) => $this->presentSchedule($schedule, false, true)));
    }

    public function storeSchedule(Request $request, Course $course): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $schedule = $course->schedules()->create($this->validateSchedule($request));

        return response()->json($this->presentSchedule($schedule, false, true), 201);
    }

    public function updateSchedule(Request $request, CourseSchedule $schedule): JsonResponse
    {
        $this->authorize('manage', Course::class);
        $schedule->update($this->validateSchedule($request));

        return response()->json($this->presentSchedule($schedule->fresh('course.category'), false, true));
    }

    public function destroySchedule(CourseSchedule $schedule): JsonResponse
    {
        $this->authorize('manage', Course::class);
        if ($schedule->enrollments()->exists()) {
            return response()->json(['message' => 'A schedule with registrations cannot be deleted.'], 409);
        }

        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted.']);
    }

    private function saveCourse(StoreCourseRequest $request, ?Course $course = null): Course
    {
        $values = $request->validated();
        $instructorIds = $values['instructors'] ?? [];
        $upload = $request->file('image');
        $removeImage = (bool) ($values['remove_image'] ?? false);
        $attributes = Arr::except($values, ['instructors', 'image', 'remove_image']);
        $attributes['credential_verified'] = (bool) ($attributes['credential_verified'] ?? false);

        if (! $attributes['credential_verified']) {
            $attributes['credential_name'] = null;
            $attributes['credential_issuer'] = null;
        }
        if ($attributes['status'] !== ContentStatus::Published->value) {
            $attributes['registration_enabled'] = false;
        }

        $storedPath = null;
        $oldPath = $course?->image_path;

        try {
            $saved = DB::transaction(function () use (
                $course,
                $attributes,
                $instructorIds,
                $upload,
                $removeImage,
                &$storedPath,
            ): Course {
                $course ??= new Course();
                if ($upload) {
                    $storedPath = $upload->store('training/courses', ['disk' => 'local']);
                    if (! $storedPath) {
                        throw new RuntimeException('The course image could not be stored.');
                    }
                    $attributes['image_path'] = $storedPath;
                } elseif ($removeImage) {
                    $attributes['image_path'] = null;
                    $attributes['image_alt'] = null;
                }

                $course->fill($attributes);
                $course->save();
                $course->instructors()->sync($instructorIds);

                return $course->fresh(['category', 'instructors', 'schedules']);
            });
        } catch (Throwable $error) {
            $this->deleteStoredFile($storedPath);
            throw $error;
        }

        if ($upload || $removeImage) {
            $this->deleteStoredFile($oldPath);
        }

        return $saved;
    }

    private function validateInstructor(Request $request, ?Instructor $instructor = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('instructors', 'slug')->ignore($instructor?->id),
            ],
            'position' => ['nullable', 'string', 'max:255'],
            'biography' => ['nullable', 'string', 'max:10000'],
            'professional_background' => ['nullable', 'string', 'max:10000'],
            'expertise' => ['nullable', 'array', 'max:30'],
            'expertise.*' => ['required', 'string', 'max:255'],
            'status' => ['required', Rule::in(['draft', 'published'])],
        ]);
    }

    private function validateSchedule(Request $request): array
    {
        return $request->validate([
            'label' => ['required', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['required', 'date', 'after:starts_at'],
            'registration_opens_at' => ['nullable', 'date'],
            'registration_closes_at' => ['nullable', 'date', 'before_or_equal:starts_at'],
            'delivery_method' => ['nullable', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'max_participants' => ['nullable', 'integer', 'min:1', 'max:10000'],
            'status' => ['required', Rule::in(['draft', 'published', 'closed'])],
        ]);
    }

    private function presentCourse(Course $course, bool $admin = false, string $locale = 'en'): array
    {
        $course->loadMissing(['category', 'instructors', 'schedules']);
        $credential = $course->credential_verified && $course->credential_name && $course->credential_issuer
            ? [
                'name' => $course->credential_name,
                'issuer' => $course->credential_issuer,
            ]
            : null;

        return [
            'id' => $course->id,
            'slug' => $course->slug,
            'title' => $course->localizedValue('title', $locale),
            'summary' => $course->localizedValue('summary', $locale),
            'description' => $course->localizedValue('description', $locale),
            'category' => $course->category ? $this->presentCategory($course->category) : null,
            'image' => $course->image_path ? route('api.course-images.show', $course) : null,
            'imageAlt' => $course->image_alt,
            'learningObjectives' => $course->localizedValue('learning_objectives', $locale) ?? [],
            'curriculum' => $course->localizedValue('curriculum', $locale) ?? [],
            'duration' => $course->duration,
            'deliveryMethod' => $course->delivery_method,
            'requirements' => $course->localizedValue('requirements', $locale) ?? [],
            'faqs' => $course->localizedValue('faqs', $locale) ?? [],
            'credential' => $credential,
            'credentialVerified' => $admin ? $course->credential_verified : null,
            'certificateSupported' => $course->certificate_supported,
            'registrationEnabled' => $course->status === ContentStatus::Published->value && $course->registration_enabled,
            'featured' => $course->featured,
            'status' => $course->status,
            'seoTitle' => $course->localizedValue('seo_title', $locale),
            'seoDescription' => $course->localizedValue('seo_description', $locale),
            'instructors' => $course->instructors
                ->when(! $admin, fn ($instructors) => $instructors->where('status', ContentStatus::Published->value))
                ->map(fn (Instructor $instructor) => $this->presentInstructor($instructor)),
            'schedules' => $course->schedules
                ->when(! $admin, fn ($schedules) => $schedules
                    ->where('status', 'published')
                    ->filter(fn (CourseSchedule $schedule) => $schedule->starts_at?->isFuture()))
                ->map(fn (CourseSchedule $schedule) => $this->presentSchedule($schedule, false)),
            'createdAt' => $course->created_at?->toISOString(),
            'updatedAt' => $course->updated_at?->toISOString(),
        ];
    }

    private function locale(Request $request): string
    {
        return $request->getPreferredLanguage(['en', 'am']) === 'am' ? 'am' : 'en';
    }

    private function presentCategory(CourseCategory $category, bool $admin = false): array
    {
        return [
            'id' => $category->id,
            'slug' => $category->slug,
            'name' => $category->name,
            'description' => $category->description,
            'courseCount' => $category->course_count ?? ($admin ? $category->courses_count ?? null : null),
            'sortOrder' => $category->sort_order,
        ];
    }

    private function presentInstructor(Instructor $instructor, bool $admin = false): array
    {
        return [
            'id' => $instructor->id,
            'slug' => $instructor->slug,
            'name' => $instructor->name,
            'position' => $instructor->position,
            'biography' => $instructor->biography,
            'professionalBackground' => $instructor->professional_background,
            'expertise' => $instructor->expertise ?? [],
            'status' => $admin ? $instructor->status : null,
            'courses' => $instructor->relationLoaded('courses')
                ? $instructor->courses->map(fn (Course $course) => [
                    'slug' => $course->slug,
                    'title' => $course->title,
                ])
                : [],
        ];
    }

    private function presentSchedule(CourseSchedule $schedule, bool $includeCourse, bool $admin = false): array
    {
        $schedule->loadMissing('course.category');
        $registered = $schedule->enrollments()
            ->whereNotIn('status', ['cancelled', 'rejected'])
            ->count();
        $registrationOpen = $schedule->status === 'published'
            && $schedule->starts_at?->isFuture()
            && (! $schedule->registration_opens_at || $schedule->registration_opens_at->lte(now()))
            && (! $schedule->registration_closes_at || $schedule->registration_closes_at->gte(now()))
            && ($schedule->max_participants === null || $registered < $schedule->max_participants);

        $presented = [
            'id' => $schedule->id,
            'label' => $schedule->label,
            'startsAt' => $schedule->starts_at?->toISOString(),
            'endsAt' => $schedule->ends_at?->toISOString(),
            'registrationOpensAt' => $schedule->registration_opens_at?->toISOString(),
            'registrationClosesAt' => $schedule->registration_closes_at?->toISOString(),
            'deliveryMethod' => $schedule->delivery_method,
            'location' => $schedule->location,
            'registrationOpen' => (bool) $registrationOpen,
            'status' => $schedule->status,
        ];

        if ($admin) {
            $presented['maxParticipants'] = $schedule->max_participants;
        }

        if ($includeCourse) {
            $presented['course'] = [
                'id' => $schedule->course->id,
                'slug' => $schedule->course->slug,
                'title' => $schedule->course->title,
                'category' => $schedule->course->category?->name,
            ];
        }

        return $presented;
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path && Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
        }
    }
}
