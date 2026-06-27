<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'organizer_id', 'title', 'description', 'venue',
        'event_date', 'ticket_price', 'total_tickets',
        'tickets_sold', 'status'
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'ticket_price' => 'decimal:2',
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function availableTickets(): int
    {
        return $this->total_tickets - $this->tickets_sold;
    }

    public function isSoldOut(): bool
    {
        return $this->availableTickets() <= 0;
    }
}