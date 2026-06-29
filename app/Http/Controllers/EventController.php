<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    // Public listing
    public function index()
    {
        $events = Event::with('organizer:id,name')
            ->where('status', 'published')
            ->orderBy('event_date')
            ->get();

        return Inertia::render('Events/Index', ['events' => $events]);
    }

    // Single event
    public function show(Event $event)
    {
        $event->load('organizer:id,name');
        return Inertia::render('Events/Show', ['event' => $event]);
    }

    // Create form — organizer/admin only
    public function create()
    {
        return Inertia::render('Events/Create');
    }

    // Store new event
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'venue'          => 'required|string|max:255',
            'event_date'     => 'required|date|after:now',
            'ticket_price'   => 'required|numeric|min:0',
            'total_tickets'  => 'required|integer|min:1|max:10000',
        ]);

        $event = Event::create([
            ...$validated,
            'organizer_id' => $request->user()->id,
            'status'       => 'draft',
        ]);

        return redirect()->route('events.show', $event)
            ->with('status', 'Event created successfully.');
    }

    // Edit form
    public function edit(Event $event)
    {
        if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }
        return Inertia::render('Events/Edit', ['event' => $event]);
    }

    // Update event
    public function update(Request $request, Event $event)
    {
        if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'required|string',
            'venue'         => 'required|string|max:255',
            'event_date'    => 'required|date|after:now',
            'ticket_price'  => 'required|numeric|min:0',
            'total_tickets' => 'required|integer|min:1',
            'status'        => 'required|in:draft,published,cancelled',
        ]);

        $event->update($validated);

        return redirect()->route('events.show', $event)
            ->with('status', 'Event updated.');
    }

    // Delete event
    public function destroy(Event $event)
    {
        if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }
        $event->delete();
        return redirect()->route('events.index')
            ->with('status', 'Event deleted.');
    }

    // Organizer's own events
    public function myEvents(Request $request)
    {
        $events = Event::where('organizer_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Events/MyEvents', ['events' => $events]);
    }

    // Publish event
    public function publish(Event $event)
    {
        if ($event->organizer_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }
        $event->update(['status' => 'published']);
        return back()->with('status', 'Event published.');
    }
}