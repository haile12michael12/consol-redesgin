<?php

namespace App\Policies;

use App\Models\Certificate;
use App\Models\User;

class CertificatePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('certificates.manage');
    }

    public function issue(User $user): bool
    {
        return $user->hasPermission('certificates.manage');
    }

    public function revoke(User $user, Certificate $certificate): bool
    {
        return $user->hasPermission('certificates.manage');
    }
}
