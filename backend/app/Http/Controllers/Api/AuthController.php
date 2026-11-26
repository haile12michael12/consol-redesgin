<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::guard('web')->attempt($credentials)) {
            return response()->json(['message' => 'The supplied credentials are invalid.'], 422);
        }

        $user = Auth::guard('web')->user();

        if (! $user->canAccessAdmin()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'Authorised staff access is required.'], 403);
        }

        $request->session()->regenerate();

        return response()->json(['user' => $user->load('roles.permissions')]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::forgetGuards();

        return response()->json(['message' => 'Signed out.']);
    }

    public function me(Request $request): JsonResponse
    {
        if (! $request->user()->canAccessAdmin()) {
            return response()->json(['message' => 'Authorised staff access is required.'], 403);
        }

        return response()->json(['user' => $request->user()->load('roles.permissions')]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $values = $request->validate([
            'current_password' => ['required', 'current_password:web'],
            'password' => ['required', 'string', 'min:12', 'max:255', 'confirmed', 'different:current_password'],
        ]);
        $user = $request->user();
        $user->forceFill([
            'password' => $values['password'],
            'remember_token' => Str::random(60),
        ])->save();

        $this->deleteOtherSessions($request);

        return response()->json(['message' => 'Password changed and other sessions signed out.']);
    }

    public function sessions(Request $request): JsonResponse
    {
        abort_unless(config('session.driver') === 'database', 501, 'Database-backed session management is not configured.');

        $sessions = DB::table(config('session.table'))
            ->where('user_id', $request->user()->id)
            ->orderByDesc('last_activity')
            ->get(['id', 'ip_address', 'user_agent', 'last_activity'])
            ->map(fn (object $session): array => [
                'id' => $session->id,
                'ipAddress' => $session->ip_address,
                'userAgent' => $session->user_agent,
                'lastActivity' => now()->setTimestamp((int) $session->last_activity)->toISOString(),
                'current' => hash_equals($request->session()->getId(), $session->id),
            ]);

        return response()->json($sessions);
    }

    public function revokeSession(Request $request, string $sessionId): JsonResponse
    {
        abort_unless(config('session.driver') === 'database', 501, 'Database-backed session management is not configured.');
        abort_if(hash_equals($request->session()->getId(), $sessionId), 409, 'Use sign out to end the current session.');

        $deleted = DB::table(config('session.table'))
            ->where('user_id', $request->user()->id)
            ->where('id', $sessionId)
            ->delete();

        abort_if($deleted === 0, 404, 'Session not found.');

        return response()->json(['message' => 'Session signed out.']);
    }

    public function revokeOtherSessions(Request $request): JsonResponse
    {
        $this->deleteOtherSessions($request);

        return response()->json(['message' => 'Other sessions signed out.']);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $values = $request->validate(['email' => ['required', 'email:rfc', 'max:255']]);
        Password::sendResetLink($values);

        return response()->json([
            'message' => 'If an account exists for that address, password reset instructions will be emailed.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $values = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc', 'max:255'],
            'password' => ['required', 'string', 'min:12', 'max:255', 'confirmed'],
        ]);

        $status = Password::reset($values, function ($user, string $password): void {
            $user->forceFill([
                'password' => $password,
                'remember_token' => Str::random(60),
            ])->save();
            DB::table(config('session.table'))->where('user_id', $user->id)->delete();
        });

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 422);
        }

        return response()->json(['message' => 'Password reset. You can now sign in.']);
    }

    private function deleteOtherSessions(Request $request): void
    {
        abort_unless(config('session.driver') === 'database', 501, 'Database-backed session management is not configured.');

        DB::table(config('session.table'))
            ->where('user_id', $request->user()->id)
            ->where('id', '<>', $request->session()->getId())
            ->delete();
    }
}
