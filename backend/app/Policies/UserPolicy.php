<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.manage');
    }

    public function update(User $user, User $staff): bool
    {
        return $user->hasPermission('users.manage')
            && ($user->isSuperAdministrator() || ! $staff->isAdministrator());
    }

    public function delete(User $user, User $staff): bool
    {
        return $this->update($user, $staff);
    }
}
