<?php

namespace App\Policies;

use App\Models\Inquiry;
use App\Models\User;

class InquiryPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function view(User $user, Inquiry $inquiry): bool
    {
        return $user->isAdministrator();
    }

    public function update(User $user, Inquiry $inquiry): bool
    {
        return $user->isAdministrator();
    }

    public function addNote(User $user, Inquiry $inquiry): bool
    {
        return $user->isAdministrator();
    }

    public function export(User $user): bool
    {
        return $user->isAdministrator();
    }
}