<?php

namespace App\Services;

use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class OtpService
{
    public function generate(User $user): string
    {
        // Invalidate any previous unused OTPs
        OtpCode::where('user_id', $user->id)
            ->where('used', false)
            ->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpCode::create([
            'user_id'    => $user->id,
            'code'       => $code,
            'expires_at' => now()->addMinutes(5),
            'used'       => false,
        ]);

        Mail::to($user->email)->send(new OtpMail($code));

        return $code;
    }

    public function verify(User $user, string $code): bool
    {
        $otp = OtpCode::where('user_id', $user->id)
            ->where('code', $code)
            ->where('used', false)
            ->latest()
            ->first();

        if (!$otp || !$otp->isValid()) {
            return false;
        }

        $otp->update(['used' => true]);
        return true;
    }
}