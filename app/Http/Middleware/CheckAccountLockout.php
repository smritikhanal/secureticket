<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAccountLockout
{
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();

        if ($user && $user->isLocked()) {
            $minutesLeft = now()->diffInMinutes($user->locked_until);

            auth()->logout();
            $request->session()->invalidate();

            return redirect()->route('login')->withErrors([
                'email' => "Account locked. Try again in {$minutesLeft} minute(s)."
            ]);
        }

        return $next($request);
    }
}