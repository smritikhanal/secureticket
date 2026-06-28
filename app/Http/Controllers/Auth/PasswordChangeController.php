<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PasswordChangeController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/PasswordExpired');
    }

    public function update(Request $request)
    {
        $request->validate([
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

        $user = $request->user();
        $newPassword = $request->password;

        // Same history check
        $history = $user->password_history ?? [];

        foreach ($history as $oldHash) {
            if (Hash::check($newPassword, $oldHash)) {
                return back()->withErrors([
                    'password' => 'You cannot reuse any of your last 5 passwords.',
                ]);
            }
        }

        array_unshift($history, $user->password);
        $history = array_slice($history, 0, 5);

        $user->update([
            'password'            => Hash::make($newPassword),
            'password_history'    => $history,
            'password_changed_at' => now(),
        ]);

        return redirect()->route('dashboard')
            ->with('status', 'Password updated. Welcome back.');
    }
}