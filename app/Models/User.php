<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'mfa_secret', 'mfa_enabled', 'password_changed_at',
        'password_history', 'failed_login_attempts', 'locked_until', 'avatar'
    ];

    protected $hidden = [
        'password', 'remember_token', 'mfa_secret', 'password_history'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_changed_at' => 'datetime',
        'locked_until' => 'datetime',
        'mfa_enabled' => 'boolean',
        'password_history' => 'array',
    ];

    // Relationships
    public function events()
    {
        return $this->hasMany(Event::class, 'organizer_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Role helpers
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isOrganizer(): bool
    {
        return $this->role === 'organizer';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    // Account lockout helpers
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    public function isPasswordExpired(): bool
    {
        if (!$this->password_changed_at) return true;
        return $this->password_changed_at->diffInDays(now()) > 90;
    }
}