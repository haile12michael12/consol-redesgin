<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;

class CertificatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function issue(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function revoke(User $user, Certificate $certificate): bool
    {
        return $user->isAdministrator();
    }
}
