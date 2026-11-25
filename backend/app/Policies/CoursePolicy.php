<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;

class CoursePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function create(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function update(User $user, Course $course): bool
    {
        return $user->isAdministrator();
    }

    public function delete(User $user, Course $course): bool
    {
        return $user->isAdministrator();
    }

    public function manage(User $user): bool
    {
        return $user->isAdministrator();
    }
}
