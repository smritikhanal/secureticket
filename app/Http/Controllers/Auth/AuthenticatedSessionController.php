<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use App\Services\OtpService;


class AuthenticatedSessionController extends Controller
{
    public function __construct(private OtpService $otpService) {}

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
{
    $request->validate([
        'email'    => 'required|string|email',
        'password' => 'required|string',
    ]);

    // Rate limiting — 5 attempts per minute per IP+email
    $key = 'login.' . $request->ip() . '.' . $request->email;

    if (RateLimiter::tooManyAttempts($key, 5)) {
        $seconds = RateLimiter::availableIn($key);
        throw ValidationException::withMessages([
            'email' => "Too many login attempts. Try again in {$seconds} seconds.",
        ]);
    }

    // Check if account is locked
    $user = User::where('email', $request->email)->first();

    if ($user && $user->isLocked()) {
        $minutes = now()->diffInMinutes($user->locked_until);
        throw ValidationException::withMessages([
            'email' => "Account locked. Try again in {$minutes} minute(s).",
        ]);
    }

    // Attempt login
    if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {

        RateLimiter::hit($key, 60);

        // Increment failed attempts
        if ($user) {
            $user->increment('failed_login_attempts');

            // Lock after 5 failed attempts for 30 minutes
            if ($user->failed_login_attempts >= 5) {
                $user->update(['locked_until' => now()->addMinutes(30)]);
            }
        }

        ActivityLog::create([
            'user_id'    => $user?->id,
            'action'     => 'login_failed',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata'   => ['email' => $request->email],
        ]);

        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }

    // Reset on successful login
    $user = Auth::user();
    $user->update(['failed_login_attempts' => 0, 'locked_until' => null]);
    RateLimiter::clear($key);

    ActivityLog::create([
        'user_id'    => $user->id,
        'action'     => 'login',
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'metadata'   => ['email' => $user->email],
    ]);

    $request->session()->regenerate();

    // Redirect to MFA if enabled
    if ($user->mfa_enabled) {
    auth()->logout(); // don't fully authenticate yet
    session(['mfa_user_id' => $user->id]);
    $this->otpService->generate($user);
    return redirect()->route('mfa.verify');
}


    return redirect()->intended(route('dashboard'));
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
