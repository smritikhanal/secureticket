<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('role', 'organizer')->first();

        if (!$organizer) {
            $organizer = User::factory()->create([
                'name' => 'Organizer',
                'email' => 'organizer@secureticket.dev',
                'role' => 'organizer',
            ]);
        }

        $events = [
            [
                'title' => 'Summer Music Festival 2026',
                'description' => 'A weekend of live music from top artists across multiple genres. Food stalls, art installations, and camping available.',
                'venue' => 'Central Park Amphitheater, New York',
                'event_date' => now()->addMonths(2)->setHour(16)->setMinute(0),
                'ticket_price' => 1499.00,
                'total_tickets' => 5000,
                'tickets_sold' => 3200,
                'status' => 'published',
            ],
            [
                'title' => 'Tech Innovators Conference',
                'description' => 'Industry leaders share insights on AI, blockchain, cybersecurity, and the future of technology. Networking sessions included.',
                'venue' => 'Convention Center, San Francisco',
                'event_date' => now()->addMonth()->setHour(9)->setMinute(0),
                'ticket_price' => 2499.00,
                'total_tickets' => 1200,
                'tickets_sold' => 890,
                'status' => 'published',
            ],
            [
                'title' => 'Yoga & Wellness Retreat',
                'description' => 'A relaxing weekend of yoga, meditation, spa treatments, and organic cuisine in a serene mountain setting.',
                'venue' => 'Serenity Hills Resort, Colorado',
                'event_date' => now()->addMonths(3)->setHour(8)->setMinute(0),
                'ticket_price' => 3499.00,
                'total_tickets' => 200,
                'tickets_sold' => 45,
                'status' => 'published',
            ],
            [
                'title' => 'Food & Wine Expo',
                'description' => 'Taste dishes from renowned chefs, sample fine wines from around the world, and attend live cooking demonstrations.',
                'venue' => 'Grand Expo Hall, Chicago',
                'event_date' => now()->addWeeks(3)->setHour(11)->setMinute(0),
                'ticket_price' => 899.00,
                'total_tickets' => 800,
                'tickets_sold' => 600,
                'status' => 'published',
            ],
            [
                'title' => 'Indie Film Festival',
                'description' => 'Showcasing the best independent films from emerging filmmakers. Q&A sessions with directors after each screening.',
                'venue' => 'Art House Cinema, Los Angeles',
                'event_date' => now()->addWeeks(6)->setHour(14)->setMinute(0),
                'ticket_price' => 599.00,
                'total_tickets' => 300,
                'tickets_sold' => 120,
                'status' => 'published',
            ],
            [
                'title' => 'Marathon for Charity',
                'description' => 'Run for a cause! Full marathon, half marathon, and 5K fun run options. All proceeds go to children\'s education.',
                'venue' => 'Waterfront Park, Seattle',
                'event_date' => now()->addMonths(4)->setHour(6)->setMinute(0),
                'ticket_price' => 299.00,
                'total_tickets' => 10000,
                'tickets_sold' => 1500,
                'status' => 'published',
            ],
            [
                'title' => 'Comedy Night Gala',
                'description' => 'A night of laughter with top stand-up comedians. Dinner and drinks included with VIP packages.',
                'venue' => 'Starlight Theater, Las Vegas',
                'event_date' => now()->addWeeks(2)->setHour(20)->setMinute(0),
                'ticket_price' => 1299.00,
                'total_tickets' => 500,
                'tickets_sold' => 480,
                'status' => 'published',
            ],
            [
                'title' => 'Photography Workshop',
                'description' => 'Learn from award-winning photographers. Covers portrait, landscape, and street photography techniques.',
                'venue' => 'Creative Studio, Austin',
                'event_date' => now()->addMonth()->setHour(10)->setMinute(0),
                'ticket_price' => 499.00,
                'total_tickets' => 50,
                'tickets_sold' => 50,
                'status' => 'published',
            ],
            [
                'title' => 'Startup Pitch Night',
                'description' => 'Watch 10 startups pitch to a panel of investors. Network with founders, VCs, and industry experts.',
                'venue' => 'Innovation Hub, Boston',
                'event_date' => now()->addWeeks(4)->setHour(18)->setMinute(30),
                'ticket_price' => 399.00,
                'total_tickets' => 150,
                'tickets_sold' => 80,
                'status' => 'published',
            ],
            [
                'title' => 'Draft Event — Workshop Planning',
                'description' => 'Internal planning session for upcoming workshops.',
                'venue' => 'Downtown Office, Miami',
                'event_date' => now()->addMonth()->setHour(9)->setMinute(0),
                'ticket_price' => 0.00,
                'total_tickets' => 20,
                'tickets_sold' => 0,
                'status' => 'draft',
            ],
        ];

        foreach ($events as $event) {
            Event::create(array_merge($event, ['organizer_id' => $organizer->id]));
        }
    }
}
