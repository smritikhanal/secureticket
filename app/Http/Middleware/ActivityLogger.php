<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;

class ActivityLogger
{
    // Actions we care about logging
    private array $trackedActions = [
        'login', 'logout', 'register',
        'password.change', 'profile.update',
        'events.store', 'events.update', 'events.destroy',
        'orders.store', 'tickets.show',
    ];

    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        $routeName = $request->route()?->getName();

        if ($routeName && in_array($routeName, $this->trackedActions)) {
            ActivityLog::create([
                'user_id'    => $request->user()?->id,
                'action'     => $routeName,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'metadata'   => [
                    'method' => $request->method(),
                    'url'    => $request->fullUrl(),
                    'status' => $response->getStatusCode(),
                ],
            ]);
        }

        return $response;
    }
}