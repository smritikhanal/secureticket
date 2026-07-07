import { Head, Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { GlassCard, Badge, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, Sparkles } from 'lucide-react';

export default function EventShow({ event }) {
    const { auth } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ event_id: event.id, quantity: 1 });
    const available = event.total_tickets - event.tickets_sold;
    const soldOut = available <= 0;
    const submit = (e) => { e.preventDefault(); post(route('orders.checkout')); };
    const canEdit = auth?.user && (auth.user.role === 'admin' || (auth.user.role === 'organizer' && auth.user.id === event.organizer_id));
    const imgId = (event.id % 10) + 1;

    return (
        <GuestLayout title={event.title}>
            <div className="max-w-4xl mx-auto px-6 py-10">
                <Link href={route('events.index')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6"><ArrowLeft className="w-4 h-4" /> Back to Events</Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6 animate-slide-up">
                        <div className="h-56 rounded-2xl overflow-hidden bg-muted shadow-lg">
                            <img src={`https://images.unsplash.com/photo-${imgId === 1 ? '1492684223066-81342ee5ff30' : imgId === 2 ? '1501281668745-f7f57925c3b4' : imgId === 3 ? '1470229722913-458c0b6b7b4c' : imgId === 4 ? '1505236858219-8359eb29e329' : imgId === 5 ? '1459749411175-04bf5292ceea' : imgId === 6 ? '1429962714458-bb90b8bd09fc' : imgId === 7 ? '1505373879540-10c566aedd4b' : imgId === 8 ? '1459749411175-04bf5292ceea' : imgId === 9 ? '1493225457125-f2c8a4f6c6b2' : '1472653815458-d4b4a0a2f2b9'}?w=800&h=400&fit=crop`} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <StatusBadge status={event.status} />
                                {soldOut && <StatusBadge status="sold_out">Sold Out</StatusBadge>}
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-1">{event.title}</h1>
                            <p className="text-muted-foreground">by {event.organizer?.name}</p>
                        </div>
                        <GlassCard className="rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</h2>
                            <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{event.description}</div>
                            <div dangerouslySetInnerHTML={{ __html: event.description_html }} className="text-foreground/80 leading-relaxed mt-4" />
                        </GlassCard>
                        <GlassCard className="rounded-2xl p-6 grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3"><Calendar className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Date & Time</p><p className="font-medium text-foreground">{new Date(event.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div></div>
                            <div className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Venue</p><p className="font-medium text-foreground">{event.venue}</p></div></div>
                            <div className="flex items-start gap-3"><Users className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Available</p><p className="font-medium text-foreground">{available} / {event.total_tickets}</p></div></div>
                            <div className="flex items-start gap-3"><DollarSign className="w-5 h-5 text-primary mt-0.5" /><div><p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Price</p><p className="font-medium text-foreground text-xl">{event.ticket_price == 0 ? 'Free' : `Rs ${event.ticket_price}`}</p></div></div>
                        </GlassCard>
                    </div>

                    <div className="space-y-4 animate-slide-up delay-200">
                        {auth?.user ? (
                            <GlassCard className="rounded-2xl p-6">
                                <h2 className="font-bold text-foreground mb-4">Get Tickets</h2>
                                {soldOut ? (
                                    <p className="text-muted-foreground text-sm">This event is sold out.</p>
                                ) : (
                                    <form onSubmit={submit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-muted-foreground mb-1.5">Quantity</label>
                                            <select value={data.quantity} onChange={e => setData('quantity', parseInt(e.target.value))}
                                                className="glass-input w-full rounded-xl px-3 py-2 text-foreground">
                                                {[...Array(Math.min(10, available))].map((_, i) => (
                                                    <option key={i+1} value={i+1}>{i+1}</option>
                                                ))}
                                            </select>
                                            {errors.quantity && <p className="text-destructive text-xs mt-1">{errors.quantity}</p>}
                                        </div>
                                        <div className="border-t border-white/10 pt-3">
                                            <div className="flex justify-between text-sm text-muted-foreground mb-1"><span>Subtotal</span><span>Rs {(event.ticket_price * data.quantity).toFixed(2)}</span></div>
                                            <div className="flex justify-between font-bold text-foreground"><span>Total</span><span>Rs {(event.ticket_price * data.quantity).toFixed(2)}</span></div>
                                        </div>
                                        <Button type="submit" disabled={processing} className="w-full">{processing ? 'Processing...' : 'Buy Tickets'}</Button>
                                    </form>
                                )}
                            </GlassCard>
                        ) : (
                            <GlassCard className="rounded-2xl p-6 text-center">
                                <p className="text-muted-foreground text-sm mb-4">Sign in to purchase tickets</p>
                                <Button className="w-full" asChild><Link href={route('login')}>Sign In</Link></Button>
                            </GlassCard>
                        )}
                        {canEdit && (
                            <Button variant="secondary" className="w-full" asChild><Link href={route('events.edit', event.id)}>Edit Event</Link></Button>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
