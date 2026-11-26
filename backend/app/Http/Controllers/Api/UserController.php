<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);
        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:200'],
            'status' => ['nullable', Rule::in(['active', 'inactive'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);
        $users = User::query()
            ->with('roles.permissions')
            ->when($filters['q'] ?? null, fn (Builder $query, string $term) => $query
                ->where(fn (Builder $query) => $query
                    ->where('name', 'like', '%'.$term.'%')
                    ->orWhere('email', 'like', '%'.$term.'%')))
            ->when(($filters['status'] ?? null) === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when(($filters['status'] ?? null) === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->orderBy('name')
            ->paginate($filters['per_page'] ?? 25)
            ->through(fn (User $user) => $this->present($user));

        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);
        $values = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12', 'max:255'],
            'role_ids' => ['required', 'array', 'min:1'],
            'role_ids.*' => ['required', 'integer', 'exists:roles,id'],
        ]);
        $this->ensurePrivilegedRolesAreAssignedBySuperAdmin($request, $values['role_ids']);
        $user = User::query()->create([
            'name' => $values['name'],
            'email' => $values['email'],
            'password' => $values['password'],
            'is_active' => true,
        ]);
        $user->roles()->sync($values['role_ids']);

        return response()->json($this->present($user->load('roles.permissions')), 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);
        $values = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email:rfc', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', 'required', 'string', 'min:12', 'max:255'],
            'role_ids' => ['sometimes', 'required', 'array', 'min:1'],
            'role_ids.*' => ['required', 'integer', 'exists:roles,id'],
            'is_active' => ['sometimes', 'required', 'boolean'],
        ]);
        if (isset($values['role_ids'])) {
            $this->ensurePrivilegedRolesAreAssignedBySuperAdmin($request, $values['role_ids']);
        }

        if ($user->is($request->user()) && ($values['is_active'] ?? true) === false) {
            return response()->json([
                'message' => 'You cannot deactivate your own account.',
                'errors' => ['is_active' => ['You cannot deactivate your own account.']],
            ], 422);
        }

        if ($user->isAdministrator() && $this->isLastActiveAdministrator($user)) {
            $removingAdministratorRole = isset($values['role_ids'])
                && ! $user->is_admin
                && ! Role::query()
                    ->whereIn('id', $values['role_ids'])
                    ->whereIn('name', ['administrator', 'super_admin'])
                    ->exists();
            abort_if(
                ($values['is_active'] ?? true) === false || $removingAdministratorRole,
                409,
                'The last active administrator cannot be deactivated or demoted.',
            );
        }

        $roleIds = $values['role_ids'] ?? null;
        unset($values['role_ids']);
        $user->update($values);
        if ($roleIds !== null) {
            $user->roles()->sync($roleIds);
        }

        return response()->json($this->present($user->fresh('roles.permissions')));
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorize('delete', $user);
        abort_if($user->is($request->user()), 409, 'You cannot delete your own account.');

        if ($user->isAdministrator() && $this->isLastActiveAdministrator($user)) {
            abort(409, 'The last active administrator cannot be deleted.');
        }

        $user->delete();

        return response()->json(['message' => 'User deleted.']);
    }

    private function present(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'isActive' => $user->is_active,
            'isAdministrator' => $user->is_admin || $user->roles->contains('name', 'administrator'),
            'roles' => $user->roles->map(fn (Role $role) => [
                'id' => $role->id,
                'name' => $role->name,
                'label' => $role->label,
            ])->values(),
            'createdAt' => $user->created_at?->toISOString(),
        ];
    }

    private function ensurePrivilegedRolesAreAssignedBySuperAdmin(Request $request, array $roleIds): void
    {
        if ($request->user()->isSuperAdministrator()) {
            return;
        }

        abort_if(
            Role::query()->whereIn('id', $roleIds)->whereIn('name', ['administrator', 'super_admin'])->exists(),
            403,
            'Only a super administrator can assign an administrator role.',
        );
    }

    private function isLastActiveAdministrator(User $user): bool
    {
        return User::query()
            ->whereKeyNot($user->id)
            ->where('is_active', true)
            ->where(function (Builder $query): void {
                $query->where('is_admin', true)
                    ->orWhereHas('roles', fn (Builder $roles) => $roles->whereIn('name', ['administrator', 'super_admin']));
            })
            ->count() === 0;
    }
}
