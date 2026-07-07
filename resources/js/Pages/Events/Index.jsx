import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { GlassCard, Badge, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { Calendar, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EventsIndex({ events }) {
    return (
        <GuestLayout title="Events">
            <div className="bg-mesh-light px-6 py-20 text-center border-b border-white/10">
                <Badge className="bg-white/60 backdrop-blur-sm border border-white/30 text-foreground">
                    Events
                </Badge>
                <h1 className="text-5xl font-bold text-foreground mt-4 mb-3 tracking-tight">Upcoming Events</h1>
                <p className="text-muted-foreground text-lg">Discover events. Buy tickets securely.</p>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {events.length === 0 ? (
                    <div className="text-center py-20 animate-slide-up">
                        <GlassCard className="rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-muted-foreground text-lg">No events yet. Check back soon.</p>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event, i) => (
                            <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}

function EventCard({ event }) {
    const available = event.total_tickets - event.tickets_sold;
    const soldOut = available <= 0;
    const imgId = (event.id % 10) + 1;

    return (
        <Link href={route('events.show', event.id)} className="group block">
            <GlassCard hover className="overflow-hidden p-0">
                <div className="h-44 overflow-hidden">
                    <img
                        src={`https://images.unsplash.com/photo-${imgId === 1 ? '1492684223066-81342ee5ff30' : imgId === 2 ? '1501281668745-f7f57925c3b4' : imgId === 3 ? '1470229722913-458c0b6b7b4c' : imgId === 4 ? '1505236858219-8359eb29e329' : imgId === 5 ? '1459749411175-04bf5292ceea' : imgId === 6 ? '1429962714458-bb90b8bd09fc' : imgId === 7 ? '1505373879540-10c566aedd4b' : imgId === 8 ? '1459749411175-04bf5292ceea' : imgId === 9 ? '1493225457125-f2c8a4f6c6b2' : '1472653815458-d4b4a0a2f2b9'}?w=600&h=300&fit=crop`}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                </div>
                <div className="p-5 pb-0">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                            soldOut ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>{soldOut ? 'Sold Out' : `${available} left`}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{event.organizer?.name}</span>
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border-t border-white/20 px-5 py-3 flex items-center justify-between rounded-b-2xl">
                    <span className="text-xs text-muted-foreground">Price</span>
                    <span className="text-lg font-bold text-foreground">{event.ticket_price == 0 ? 'Free' : `Rs ${event.ticket_price}`}</span>
                </div>
            </GlassCard>
        </Link>
    );
}
