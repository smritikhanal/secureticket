<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPasswordExpiry
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        // Skip if already on the change password page
        if ($request->routeIs('password.change') || $request->routeIs('logout')) {
            return $next($request);
        }

        if ($user && $user->isPasswordExpired()) {
            return redirect()->route('password.change')->withErrors([
                'password' => 'Your password has expired. Please set a new one.'
            ]);
        }

        return $next($request);
    }
}