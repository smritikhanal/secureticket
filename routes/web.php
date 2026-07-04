<?php

use App\Http\Controllers\ProfileController;
use App\Models\Event;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\MfaController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\PasswordChangeController;


Route::get('/', function () {
    $events = Event::with('organizer:id,name')
        ->where('status', 'published')
        ->where('event_date', '>=', now())
        ->orderBy('event_date')
        ->take(6)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'events' => $events,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::get('/mfa/verify', [MfaController::class, 'showVerify'])->name('mfa.verify');
Route::post('/mfa/verify', [MfaController::class, 'verify'])->name('mfa.verify.submit');
Route::post('/mfa/resend', [MfaController::class, 'resend'])->name('mfa.resend');

// MFA toggle — requires auth
Route::middleware('auth')->group(function () {
    Route::post('/mfa/enable', [MfaController::class, 'enable'])->name('mfa.enable');
    Route::post('/mfa/disable', [MfaController::class, 'disable'])->name('mfa.disable');
});

require __DIR__.'/auth.php';


// Authenticated routes (must come before public wildcard routes)
Route::middleware(['auth'])->group(function () {

    // Events — organizer + admin
    Route::middleware(['role:organizer,admin'])->group(function () {
        Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('/events', [EventController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
        Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
        Route::post('/events/{event}/publish', [EventController::class, 'publish'])->name('events.publish');
        Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.mine');
    });

    //No middlewares for orders and tickets, as they are accessible to authenticated users
        Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
        // Route::post('/events', [EventController::class, 'store'])->name('events.store');
        // Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        // Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
        // Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
        // Route::post('/events/{event}/publish', [EventController::class, 'publish'])->name('events.publish');
        // Route::get('/my-events', [EventController::class, 'myEvents'])->name('events.mine');

    // Orders
    Route::post('/checkout', [OrderController::class, 'checkout'])->name('orders.checkout');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Tickets
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
});

// Public routes (wildcards — must come after literal routes like /events/create)
Route::get('/events', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

Route::middleware('auth')->group(function () {
    Route::get('/password/change', [PasswordChangeController::class, 'show'])
        ->name('password.change');
    Route::post('/password/change', [PasswordChangeController::class, 'update'])
        ->name('password.change.update');
});

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::patch('/users/{user}/role', [AdminController::class, 'updateRole'])->name('users.role');
        Route::post('/users/{user}/toggle-lock', [AdminController::class, 'toggleLock'])->name('users.lock');
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
        Route::get('/logs', [AdminController::class, 'logs'])->name('logs');
    });