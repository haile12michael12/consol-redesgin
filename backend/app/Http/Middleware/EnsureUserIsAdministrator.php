<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdministrator
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->canAccessAdmin()) {
            abort(403, 'Authorised staff access is required.');
        }

        $response = $next($request);

        if ($response->isSuccessful() && in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            $route = $request->route();
            $segments = collect(explode('/', trim($route?->uri() ?? '', '/')))
                ->reject(fn (string $segment): bool => $segment === 'admin'
                    || $segment === 'api'
                    || str_starts_with($segment, '{'));
            $routeParameters = $route?->parameters() ?? [];
            $resourceId = null;

            foreach ($routeParameters as $value) {
                if ($value instanceof Model) {
                    $resourceId = (string) $value->getKey();
                } elseif (is_scalar($value)) {
                    $resourceId = (string) $value;
                }
            }

            ActivityLog::query()->create([
                'user_id' => $request->user()->id,
                'action' => match ($request->method()) {
                    'POST' => 'created',
                    'DELETE' => 'deleted',
                    default => 'updated',
                },
                'resource' => $segments->implode('/'),
                'resource_id' => $resourceId,
            ]);
        }

        return $response;
    }
}
