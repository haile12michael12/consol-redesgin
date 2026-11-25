<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Role::query()
            ->with('permissions')
            ->withCount('users')
            ->orderBy('label')
            ->get()
            ->map(fn (Role $role) => $this->present($role)));
    }

    public function permissions(): JsonResponse
    {
        return response()->json(Permission::query()->orderBy('name')->get(['id', 'name', 'label']));
    }

    public function store(Request $request): JsonResponse
    {
        $values = $request->validate([
            'name' => ['required', 'string', 'max:80', 'regex:/^[a-z][a-z0-9_]*$/', 'unique:roles,name'],
            'label' => ['required', 'string', 'max:120'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['required', 'integer', 'exists:permissions,id'],
        ]);
        $role = Role::query()->create([
            'name' => $values['name'],
            'label' => $values['label'],
            'is_system' => false,
        ]);
        $role->permissions()->sync($values['permission_ids']);

        return response()->json($this->present($role->load('permissions')), 201);
    }

    public function update(Request $request, Role $role): JsonResponse
    {
        abort_if($role->is_system, 403, 'System roles cannot be changed.');
        $values = $request->validate([
            'label' => ['required', 'string', 'max:120'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['required', 'integer', 'exists:permissions,id'],
        ]);
        $role->update(['label' => $values['label']]);
        $role->permissions()->sync($values['permission_ids']);

        return response()->json($this->present($role->fresh('permissions')->loadCount('users')));
    }

    public function destroy(Role $role): JsonResponse
    {
        abort_if($role->is_system, 403, 'System roles cannot be deleted.');
        if ($role->users()->exists()) {
            return response()->json(['message' => 'Remove users from this role before deleting it.'], 409);
        }
        $role->delete();

        return response()->json(['message' => 'Role deleted.']);
    }

    private function present(Role $role): array
    {
        return [
            'id' => $role->id,
            'name' => $role->name,
            'label' => $role->label,
            'isSystem' => $role->is_system,
            'userCount' => $role->users_count ?? 0,
            'permissions' => $role->permissions->map(fn (Permission $permission) => [
                'id' => $permission->id,
                'name' => $permission->name,
                'label' => $permission->label,
            ])->values(),
        ];
    }
}
