import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, StatusBadge } from '@/Components/ui/glass-card';
import { Ticket } from 'lucide-react';

export default function TicketsIndex({ tickets }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Tickets" />
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-foreground mb-8">My Tickets</h1>
                {tickets.length === 0 ? (
                    <div className="text-center py-20 animate-slide-up">
                        <GlassCard className="rounded-2xl p-12 max-w-md mx-auto">
                            <Ticket className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No tickets yet.</p>
                            <Link href={route('events.index')} className="text-primary hover:text-primary/80 transition font-medium text-sm underline">Browse Events</Link>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {tickets.map((ticket, i) => (
                            <Link key={ticket.id} href={route('tickets.show', ticket.id)} className="block animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                <GlassCard hover className="rounded-2xl p-5 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <StatusBadge status={ticket.status} />
                                        <span className="text-xs text-muted-foreground">#{ticket.id}</span>
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{ticket.event?.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-3">{ticket.event?.venue}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(ticket.event?.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
