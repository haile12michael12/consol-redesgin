<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\User;

class EnrollmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function update(User $user, Enrollment $enrollment): bool
    {
        return $user->isAdministrator();
    }

    public function recordAttendance(User $user, Enrollment $enrollment): bool
    {
        return $user->isAdministrator();
    }
}
