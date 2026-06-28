<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
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

        // Check against last 5 passwords
        $history = $user->password_history ?? [];

        foreach ($history as $oldHash) {
            if (Hash::check($newPassword, $oldHash)) {
                return back()->withErrors([
                    'password' => 'You cannot reuse any of your last 5 passwords.',
                ]);
            }
        }

        // Add current password to history before changing
        array_unshift($history, $user->password);

        // Keep only last 5
        $history = array_slice($history, 0, 5);

        $user->update([
            'password'            => Hash::make($newPassword),
            'password_history'    => $history,
            'password_changed_at' => now(),
        ]);

        return back()->with('status', 'Password updated successfully.');
    }
}
