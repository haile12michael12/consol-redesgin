<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;

class RolePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('users.manage');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('users.manage');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->hasPermission('users.manage')
            && (! $role->is_system || $user->isSuperAdministrator());
    }

    public function delete(User $user, Role $role): bool
    {
        return $this->update($user, $role);
    }
}
