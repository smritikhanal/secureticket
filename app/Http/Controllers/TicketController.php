<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function show(Request $request, Ticket $ticket)
    {
        if ($ticket->user_id !== auth()->id()) {
            abort(403);
        }
        $ticket->load(['event', 'order']);
        return Inertia::render('Tickets/Show', ['ticket' => $ticket]);
    }

    public function index(Request $request)
    {
        $tickets = Ticket::where('user_id', $request->user()->id)
            ->with(['event'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Tickets/Index', ['tickets' => $tickets]);
    }
}