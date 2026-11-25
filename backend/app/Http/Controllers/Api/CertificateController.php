<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Services\CertificateService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CertificateController extends Controller
{
    public function verify(Request $request, CertificateService $certificates): JsonResponse
    {
        $values = $request->validate([
            'verification_code' => ['required', 'string', 'max:40'],
        ]);
        $certificate = $certificates->verify($values['verification_code']);

        if (! $certificate) {
            return response()->json(['valid' => false]);
        }

        return response()->json([
            'valid' => true,
            'recipientName' => $certificate->enrollment->full_name,
            'courseTitle' => $certificate->enrollment->course->title,
            'issuedAt' => $certificate->issued_at?->toISOString(),
            'verificationCode' => $certificate->verification_code,
        ]);
    }

    public function adminIndex(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Certificate::class);
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $certificates = Certificate::query()
            ->with(['enrollment.course'])
            ->when($filters['q'] ?? null, function (Builder $query, string $term) {
                $query->where('verification_code', 'like', '%'.$term.'%')
                    ->orWhereHas('enrollment', fn (Builder $enrollments) => $enrollments->where(
                        'full_name',
                        'like',
                        '%'.$term.'%',
                    ));
            })
            ->orderByDesc('issued_at')
            ->paginate($filters['per_page'] ?? 25)
            ->through(fn (Certificate $certificate) => $this->presentCertificate($certificate));

        return response()->json($certificates);
    }

    public function issue(
        Request $request,
        Enrollment $enrollment,
        CertificateService $certificates,
    ): JsonResponse {
        $this->authorize('issue', Certificate::class);
        $certificate = $certificates->issue($enrollment, $request->user()->id);

        return response()->json($this->presentCertificate($certificate->load('enrollment.course')), 201);
    }

    public function revoke(Certificate $certificate): JsonResponse
    {
        $this->authorize('revoke', $certificate);
        if (! $certificate->revoked_at) {
            DB::transaction(fn () => $certificate->update(['revoked_at' => now()]));
        }

        return response()->json(['message' => 'Certificate revoked.']);
    }

    private function presentCertificate(Certificate $certificate): array
    {
        return [
            'id' => $certificate->id,
            'verificationCode' => $certificate->verification_code,
            'recipientName' => $certificate->enrollment->full_name,
            'course' => [
                'slug' => $certificate->enrollment->course->slug,
                'title' => $certificate->enrollment->course->title,
            ],
            'issuedAt' => $certificate->issued_at?->toISOString(),
            'revokedAt' => $certificate->revoked_at?->toISOString(),
            'valid' => $certificate->revoked_at === null,
        ];
    }
}
