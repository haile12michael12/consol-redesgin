<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Enrollment;
use App\Services\RegistrationService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class RegistrationController extends Controller
{
    public function store(Request $request, RegistrationService $registrations): JsonResponse
    {
        $values = $request->validate([
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'course_schedule_id' => ['nullable', 'integer', 'exists:course_schedules,id'],
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'phone' => ['required', 'string', 'max:40'],
            'organization' => ['nullable', 'string', 'max:255'],
            'preferred_schedule' => ['nullable', 'string', 'max:255'],
            'additional_information' => ['nullable', 'string', 'max:3000'],
            'consent' => ['required', 'accepted'],
        ]);

        $enrollment = $registrations->register($values);

        return response()->json($this->confirmationData($enrollment), 201);
    }

    public function confirmation(string $reference, RegistrationService $registrations): JsonResponse
    {
        $enrollment = $registrations->confirmation($reference);
        abort_if(! $enrollment, 404);

        return response()->json($this->confirmationData($enrollment));
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Enrollment::class);
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'status' => ['nullable', Rule::in(['pending', 'confirmed', 'waitlisted', 'rejected', 'cancelled', 'completed'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $enrollments = Enrollment::query()
            ->with(['course.category', 'schedule', 'attendance', 'certificate'])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where(function (Builder $query) use ($term) {
                    $query->where('full_name', 'like', '%'.$term.'%')
                        ->orWhere('email', 'like', '%'.$term.'%')
                        ->orWhere('reference', 'like', '%'.$term.'%');
                });
            })
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->orderByDesc('created_at')
            ->paginate($filters['per_page'] ?? 25)
            ->through(fn (Enrollment $enrollment) => $this->presentEnrollment($enrollment));

        return response()->json($enrollments);
    }

    public function update(Request $request, Enrollment $enrollment): JsonResponse
    {
        $this->authorize('update', $enrollment);
        $values = $request->validate([
            'status' => ['required', Rule::in(['pending', 'confirmed', 'waitlisted', 'rejected', 'cancelled', 'completed'])],
        ]);
        $enrollment->update($values);

        return response()->json($this->presentEnrollment($enrollment->fresh([
            'course.category',
            'schedule',
            'attendance',
            'certificate',
        ])));
    }

    public function recordAttendance(Request $request, Enrollment $enrollment): JsonResponse
    {
        $this->authorize('recordAttendance', $enrollment);
        $values = $request->validate([
            'status' => ['required', Rule::in(['attended', 'absent'])],
        ]);
        $attendance = DB::transaction(fn () => Attendance::query()->updateOrCreate(
            ['enrollment_id' => $enrollment->id],
            [
                'status' => $values['status'],
                'recorded_by' => $request->user()->id,
                'recorded_at' => now(),
            ],
        ));

        return response()->json([
            'enrollmentId' => $enrollment->id,
            'status' => $attendance->status,
            'recordedAt' => $attendance->recorded_at?->toISOString(),
        ]);
    }

    private function confirmationData(Enrollment $enrollment): array
    {
        return [
            'reference' => $enrollment->reference,
            'status' => $enrollment->status,
            'fullName' => $enrollment->full_name,
            'course' => [
                'slug' => $enrollment->course->slug,
                'title' => $enrollment->course->title,
            ],
            'schedule' => $enrollment->schedule ? [
                'label' => $enrollment->schedule->label,
                'startsAt' => $enrollment->schedule->starts_at?->toISOString(),
                'endsAt' => $enrollment->schedule->ends_at?->toISOString(),
                'deliveryMethod' => $enrollment->schedule->delivery_method,
                'location' => $enrollment->schedule->location,
            ] : null,
            'submittedAt' => $enrollment->created_at?->toISOString(),
        ];
    }

    private function presentEnrollment(Enrollment $enrollment): array
    {
        return [
            'id' => $enrollment->id,
            'reference' => $enrollment->reference,
            'fullName' => $enrollment->full_name,
            'email' => $enrollment->email,
            'phone' => $enrollment->phone,
            'organization' => $enrollment->organization,
            'preferredSchedule' => $enrollment->preferred_schedule,
            'additionalInformation' => $enrollment->additional_information,
            'status' => $enrollment->status,
            'consentAt' => $enrollment->consent_at?->toISOString(),
            'submittedAt' => $enrollment->created_at?->toISOString(),
            'course' => [
                'id' => $enrollment->course->id,
                'slug' => $enrollment->course->slug,
                'title' => $enrollment->course->title,
                'certificateSupported' => $enrollment->course->certificate_supported,
            ],
            'schedule' => $enrollment->schedule ? [
                'id' => $enrollment->schedule->id,
                'label' => $enrollment->schedule->label,
                'startsAt' => $enrollment->schedule->starts_at?->toISOString(),
            ] : null,
            'attendance' => $enrollment->attendance ? [
                'status' => $enrollment->attendance->status,
                'recordedAt' => $enrollment->attendance->recorded_at?->toISOString(),
            ] : null,
            'certificateIssued' => $enrollment->certificate !== null && $enrollment->certificate->revoked_at === null,
        ];
    }
}
