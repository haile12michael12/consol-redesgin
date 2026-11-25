<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasPermission
{
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $allowed = $request->user()?->canAccessAdmin()
            && collect($permissions)->contains(fn (string $permission): bool => $request->user()->hasPermission($permission));

        if (! $allowed) {
            abort(403, 'The assigned role does not permit this action.');
        }

        return $next($request);
    }
}
