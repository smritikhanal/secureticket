<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MfaController extends Controller
{
    public function __construct(private OtpService $otpService) {}

    // Show OTP verification page
    public function showVerify()
    {
        if (!session('mfa_user_id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/MfaVerify');
    }

    // Verify submitted OTP
    public function verify(Request $request)
    {
        $request->validate(['code' => 'required|string|size:6']);

        $userId = session('mfa_user_id');

        if (!$userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::findOrFail($userId);

        if (!$this->otpService->verify($user, $request->code)) {
            return back()->withErrors(['code' => 'Invalid or expired code.']);
        }

        // Clear MFA session, fully log in
        session()->forget('mfa_user_id');
        auth()->login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    // Resend OTP
    public function resend(Request $request)
    {
        $userId = session('mfa_user_id');

        if (!$userId) {
            return redirect()->route('login');
        }

        $user = \App\Models\User::findOrFail($userId);
        $this->otpService->generate($user);

        return back()->with('status', 'A new code has been sent to your email.');
    }

    // Enable MFA from profile
    public function enable(Request $request)
    {
        $user = $request->user();
        $user->update(['mfa_enabled' => true]);

        return back()->with('status', 'MFA enabled successfully.');
    }

    // Disable MFA from profile
    public function disable(Request $request)
    {
        $user = $request->user();
        $user->update(['mfa_enabled' => false]);

        return back()->with('status', 'MFA disabled.');
    }
}