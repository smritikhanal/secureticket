import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function OrderShow({ order }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Order #${order.id}`} />
            <div className="max-w-2xl mx-auto px-6 py-10">
                <Link href={route('orders.index')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6"><ArrowLeft className="w-4 h-4" /> My Orders</Link>
                <div className="flex items-center gap-3 mb-8 animate-slide-up">
                    <h1 className="text-3xl font-bold text-foreground">Order #{order.id}</h1>
                    <StatusBadge status={order.status} />
                </div>
                <div className="space-y-6 animate-slide-up delay-100">
                    <GlassCard className="rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <Row label="Event" value={order.event?.title} />
                            <Row label="Venue" value={order.event?.venue} />
                            <Row label="Date" value={new Date(order.event?.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                            <Row label="Quantity" value={`${order.quantity} ticket${order.quantity > 1 ? 's' : ''}`} />
                            <div className="border-t border-white/10 pt-3"><Row label="Total Paid" value={`Rs ${order.total_amount}`} bold /></div>
                        </div>
                    </GlassCard>
                    <GlassCard className="rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Your Tickets ({order.tickets?.length})</h2>
                        <div className="space-y-3">
                            {order.tickets?.map((ticket, i) => (
                                <Link key={ticket.id} href={route('tickets.show', ticket.id)}
                                    className="flex justify-between items-center bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 hover:border-primary/30 transition-all duration-200">
                                    <div>
                                        <p className="text-sm text-foreground font-medium">Ticket #{i + 1}</p>
                                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{ticket.qr_code}</p>
                                    </div>
                                    <StatusBadge status={ticket.status} />
                                </Link>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function Row({ label, value, bold }) {
    return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className={bold ? 'text-foreground font-bold' : 'text-foreground'}>{value}</span></div>;
}
