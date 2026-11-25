<?php

namespace App\Policies;

use App\Models\Enrollment;
use App\Models\User;

class EnrollmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('registrations.manage');
    }

    public function update(User $user, Enrollment $enrollment): bool
    {
        return $user->hasPermission('registrations.manage');
    }

    public function recordAttendance(User $user, Enrollment $enrollment): bool
    {
        return $user->hasPermission('registrations.manage');
    }
}
