import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { Plus, Pencil, Trash2, Send, Sparkles } from 'lucide-react';

export default function MyEvents({ events }) {
    const publish = (id) => router.post(route('events.publish', id));
    const destroy = (id) => { if (confirm('Delete this event?')) router.delete(route('events.destroy', id)); };

    return (
        <AuthenticatedLayout>
            <Head title="My Events" />
            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex justify-between items-center mb-8 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Events</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage your events</p>
                    </div>
                    <Button asChild><Link href={route('events.create')} className="gap-2"><Plus className="w-4 h-4" /> Create Event</Link></Button>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-20 animate-slide-up delay-100">
                        <GlassCard className="rounded-2xl p-12 max-w-md mx-auto">
                            <p className="text-muted-foreground mb-4">No events yet.</p>
                            <Button variant="secondary" asChild><Link href={route('events.create')}>Create your first event</Link></Button>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event, i) => (
                            <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <GlassCard hover className="rounded-2xl p-5 flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground">{event.title}</h3>
                                            <StatusBadge status={event.status} />
                                        </div>
                                        <p className="text-sm text-muted-foreground">{new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} &middot; {event.venue} &middot; {event.tickets_sold}/{event.total_tickets} sold</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {event.status === 'draft' && <Button size="sm" onClick={() => publish(event.id)} className="gap-1"><Send className="w-3 h-3" /> Publish</Button>}
                                        <Button size="sm" variant="secondary" asChild><Link href={route('events.edit', event.id)} className="gap-1"><Pencil className="w-3 h-3" /> Edit</Link></Button>
                                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => destroy(event.id)}><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
