<?php

namespace App\Services;

use App\Models\Course;
use App\Models\CourseSchedule;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RegistrationService
{
    public function register(array $values): Enrollment
    {
        return DB::transaction(function () use ($values): Enrollment {
            $course = Course::query()
                ->whereKey($values['course_id'])
                ->where('status', 'published')
                ->where('registration_enabled', true)
                ->first();

            if (! $course) {
                throw ValidationException::withMessages([
                    'course_id' => 'This course is not currently accepting registrations.',
                ]);
            }

            $schedule = null;
            if (! empty($values['course_schedule_id'])) {
                $schedule = CourseSchedule::query()
                    ->whereKey($values['course_schedule_id'])
                    ->where('course_id', $course->id)
                    ->lockForUpdate()
                    ->first();

                if (! $schedule || ! $this->scheduleIsOpen($schedule)) {
                    throw ValidationException::withMessages([
                        'course_schedule_id' => 'This schedule is no longer available for registration.',
                    ]);
                }

                if ($schedule->max_participants !== null) {
                    $activeRegistrations = $schedule->enrollments()
                        ->whereNotIn('status', ['cancelled', 'rejected'])
                        ->count();

                    if ($activeRegistrations >= $schedule->max_participants) {
                        throw ValidationException::withMessages([
                            'course_schedule_id' => 'This schedule has reached its registration limit.',
                        ]);
                    }
                }
            }

            $enrollment = Enrollment::query()->create([
                'reference' => (string) Str::uuid(),
                'course_id' => $course->id,
                'course_schedule_id' => $schedule?->id,
                'full_name' => $values['full_name'],
                'email' => $values['email'],
                'phone' => $values['phone'],
                'organization' => $values['organization'] ?? null,
                'preferred_schedule' => $values['preferred_schedule'] ?? null,
                'additional_information' => $values['additional_information'] ?? null,
                'status' => 'pending',
                'consent_at' => now(),
            ]);

            return $enrollment->load(['course.category', 'schedule']);
        });
    }

    public function confirmation(string $reference): ?Enrollment
    {
        return Enrollment::query()
            ->where('reference', $reference)
            ->with(['course.category', 'schedule'])
            ->first();
    }

    private function scheduleIsOpen(CourseSchedule $schedule): bool
    {
        $now = now();

        return $schedule->status === 'published'
            && $schedule->starts_at->isFuture()
            && (! $schedule->registration_opens_at || $schedule->registration_opens_at->lte($now))
            && (! $schedule->registration_closes_at || $schedule->registration_closes_at->gte($now));
    }
}
