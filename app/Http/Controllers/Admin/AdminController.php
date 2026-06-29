<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Event;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Dashboard overview
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users'    => User::count(),
                'total_events'   => Event::count(),
                'total_orders'   => Order::count(),
                'total_revenue'  => Order::where('status', 'completed')->sum('total_amount'),
            ],
            'recent_logs' => ActivityLog::with('user:id,name,email')
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    // Users list
    public function users(Request $request)
    {
        $users = User::query()
            ->when($request->search, fn($q) =>
                $q->where('name', 'ilike', "%{$request->search}%")
                  ->orWhere('email', 'ilike', "%{$request->search}%")
            )
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Users', [
            'users'  => $users,
            'search' => $request->search,
        ]);
    }

    // Update user role
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:user,organizer,admin',
        ]);

        // Prevent self-demotion
        if ($user->id === auth()->id()) {
            return back()->withErrors(['role' => 'You cannot change your own role.']);
        }

        $user->update(['role' => $request->role]);

        return back()->with('status', "Role updated to {$request->role}.");
    }

    // Lock/unlock user
    public function toggleLock(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot lock your own account.']);
        }

        if ($user->isLocked()) {
            $user->update(['locked_until' => null, 'failed_login_attempts' => 0]);
            return back()->with('status', 'User unlocked.');
        }

        $user->update(['locked_until' => now()->addYears(10)]);
        return back()->with('status', 'User locked.');
    }

    // Activity logs
    public function logs(Request $request)
    {
        $logs = ActivityLog::with('user:id,name,email')
            ->when($request->action, fn($q) =>
                $q->where('action', $request->action)
            )
            ->when($request->user_id, fn($q) =>
                $q->where('user_id', $request->user_id)
            )
            ->latest()
            ->paginate(50)
            ->withQueryString();

        $actions = ActivityLog::distinct()
            ->pluck('action')
            ->sort()
            ->values();

        return Inertia::render('Admin/Logs', [
            'logs'    => $logs,
            'actions' => $actions,
            'filters' => $request->only('action', 'user_id'),
        ]);
    }

    // Delete user
    public function destroyUser(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }

        $user->delete();
        return back()->with('status', 'User deleted.');
    }
}