<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
        'role'             => \App\Http\Middleware\RoleMiddleware::class,
        'lockout.check'    => \App\Http\Middleware\CheckAccountLockout::class,
        'password.expiry'  => \App\Http\Middleware\CheckPasswordExpiry::class,
        'activity.log'     => \App\Http\Middleware\ActivityLogger::class,
    ]);

         $middleware->appendToGroup('web', [
        \App\Http\Middleware\CheckAccountLockout::class,
        \App\Http\Middleware\CheckPasswordExpiry::class,
        \App\Http\Middleware\ActivityLogger::class,
        \App\Http\Middleware\SecurityHeaders::class, 
    ]);
         

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );
    })->create();
