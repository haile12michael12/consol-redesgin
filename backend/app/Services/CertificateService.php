<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CertificateService
{
    public function issue(Enrollment $enrollment, int $issuerId): Certificate
    {
        return DB::transaction(function () use ($enrollment, $issuerId): Certificate {
            $enrollment = Enrollment::query()
                ->whereKey($enrollment->id)
                ->with(['course', 'attendance', 'certificate'])
                ->lockForUpdate()
                ->firstOrFail();

            if (! $enrollment->course->certificate_supported) {
                throw ValidationException::withMessages([
                    'certificate' => 'Certificate issuing is not enabled for this course.',
                ]);
            }

            if ($enrollment->attendance?->status !== 'attended') {
                throw ValidationException::withMessages([
                    'attendance' => 'Record the learner as attended before issuing a certificate.',
                ]);
            }

            if ($enrollment->certificate) {
                if ($enrollment->certificate->revoked_at) {
                    throw ValidationException::withMessages([
                        'certificate' => 'A revoked certificate cannot be reissued for this registration.',
                    ]);
                }

                return $enrollment->certificate;
            }

            return Certificate::query()->create([
                'enrollment_id' => $enrollment->id,
                'verification_code' => Str::upper(Str::random(20)),
                'issued_by' => $issuerId,
                'issued_at' => now(),
            ]);
        });
    }

    public function verify(string $verificationCode): ?Certificate
    {
        return Certificate::query()
            ->where('verification_code', Str::upper(trim($verificationCode)))
            ->whereNull('revoked_at')
            ->with(['enrollment.course'])
            ->first();
    }
}
