import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CreateEvent() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', description: '', venue: '', event_date: '', ticket_price: '', total_tickets: '',
    });
    const submit = (e) => { e.preventDefault(); post(route('events.store')); };

    return (
        <AuthenticatedLayout>
            <Head title="Create Event" />
            <div className="max-w-2xl mx-auto px-6 py-10">
                <Link href={route('events.mine')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6"><ArrowLeft className="w-4 h-4" /> My Events</Link>
                <h1 className="text-3xl font-bold text-foreground mb-8">Create Event</h1>
                <GlassCard className="rounded-2xl p-8">
                    <form onSubmit={submit} className="space-y-5">
                        <Field label="Title" error={errors.title}>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" placeholder="My Awesome Event" required />
                        </Field>
                        <Field label="Description" error={errors.description}>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground resize-none h-28" placeholder="Tell people about your event..." required />
                        </Field>
                        <Field label="Venue" error={errors.venue}>
                            <input type="text" value={data.venue} onChange={e => setData('venue', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground placeholder:text-muted-foreground" placeholder="Venue name and location" required />
                        </Field>
                        <Field label="Event Date & Time" error={errors.event_date}>
                            <input type="datetime-local" value={data.event_date} onChange={e => setData('event_date', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" required />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Ticket Price (Rs)" error={errors.ticket_price}>
                                <input type="number" min="0" step="0.01" value={data.ticket_price} onChange={e => setData('ticket_price', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" placeholder="0.00" required />
                            </Field>
                            <Field label="Total Tickets" error={errors.total_tickets}>
                                <input type="number" min="1" value={data.total_tickets} onChange={e => setData('total_tickets', e.target.value)} className="glass-input w-full rounded-xl px-4 py-2.5 text-foreground" placeholder="100" required />
                            </Field>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="flex-1">{processing ? 'Creating...' : 'Create Event'}</Button>
                            <Button variant="secondary" asChild><Link href={route('events.mine')}>Cancel</Link></Button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </AuthenticatedLayout>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
            {children}
            {error && <p className="text-destructive text-xs mt-1">{error}</p>}
        </div>
    );
}
