<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'The supplied credentials are invalid.'], 422);
        }

        if (! $request->user()->canAccessAdmin()) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'Authorised staff access is required.'], 403);
        }

        $request->session()->regenerate();

        return response()->json(['user' => $request->user()->load('roles.permissions')]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Signed out.']);
    }

    public function me(Request $request): JsonResponse
    {
        if (! $request->user()->canAccessAdmin()) {
            return response()->json(['message' => 'Authorised staff access is required.'], 403);
        }

        return response()->json(['user' => $request->user()->load('roles.permissions')]);
    }
}
