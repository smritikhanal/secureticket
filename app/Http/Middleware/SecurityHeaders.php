<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        $isDev = app()->environment('local');

        $scriptSrc = $isDev
            ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://127.0.0.1:5173 http://localhost:5173 https://js.stripe.com"
            : "script-src 'self' 'unsafe-inline' https://js.stripe.com";

        $styleSrc = $isDev
            ? "style-src 'self' 'unsafe-inline' https://fonts.bunny.net https://fonts.googleapis.com"
            : "style-src 'self' 'unsafe-inline'";

        $connectSrc = $isDev
            ? "connect-src 'self' ws://127.0.0.1:5173 ws://localhost:5173 http://127.0.0.1:5173 http://localhost:5173 https://api.stripe.com"
            : "connect-src 'self' https://api.stripe.com";

        $frameSrc = "frame-src https://js.stripe.com https://hooks.stripe.com";

        $fontSrc = "font-src 'self' https://fonts.bunny.net https://fonts.gstatic.com";

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', [
                "default-src 'self'",
                $scriptSrc,
                $styleSrc,
                "img-src 'self' data: blob: https://images.unsplash.com",
                $fontSrc,
                $connectSrc,
                $frameSrc,
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
            ])
        );

        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        return $response;
    }
}