<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules\Password;
use App\Models\ActivityLog;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name'     => 'required|string|max:255',
        'email'    => 'required|string|email|max:255|unique:users',
        'password' => [
            'required',
            'confirmed',
            Password::min(12)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised(),
        ],
    ]);

    $user = User::create([
        'name'                => $request->name,
        'email'               => $request->email,
        'password'            => Hash::make($request->password),
        'role'                => 'user',
        'password_changed_at' => now(),
        'password_history'    => [Hash::make($request->password)],
    ]);

    ActivityLog::create([
        'user_id'    => $user->id,
        'action'     => 'register',
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'metadata'   => ['email' => $user->email],
    ]);

    event(new Registered($user));
    Auth::login($user);

    return redirect(route('dashboard'));
}
}
