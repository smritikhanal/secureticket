import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft } from 'lucide-react';

export default function TicketShow({ ticket }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Ticket #${ticket.id}`} />
            <div className="max-w-sm mx-auto px-6 py-10">
                <Link href={route('tickets.index')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition mb-6"><ArrowLeft className="w-4 h-4" /> My Tickets</Link>
                <div className="animate-scale-in">
                    <GlassCard className="rounded-2xl overflow-hidden">
                        <div className="bg-primary/90 px-6 py-5">
                            <div className="flex items-center gap-2 mb-1">
<p className="text-white/80 text-xs font-semibold uppercase tracking-widest">SecureTicket</p>
                            </div>
                            <h2 className="text-white text-xl font-bold mt-1">{ticket.event?.title}</h2>
                        </div>
                        <div className="border-t-2 border-dashed border-white/30 mx-6" />
                        <div className="px-6 py-5 space-y-4">
                            <TicketRow label="Venue" value={ticket.event?.venue} />
                            <TicketRow label="Date" value={new Date(ticket.event?.event_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
                            <TicketRow label="Status" value={ticket.status} />
                            <TicketRow label="Order" value={`#${ticket.order_id}`} />
                        </div>
                        <div className="border-t-2 border-dashed border-white/30 mx-6" />
                        <div className="px-6 py-6 flex flex-col items-center">
                            <div className="bg-white p-4 rounded-2xl shadow-lg mb-4">
                                <QRCodeSVG value={ticket.qr_code} size={140} bgColor="#ffffff" fgColor="#000000" level="H" />
                            </div>
                            <p className="text-xs text-muted-foreground font-mono text-center break-all">{ticket.qr_code}</p>
                            <p className="text-xs text-muted-foreground mt-2">Ticket #{ticket.id}</p>
                        </div>
                    </GlassCard>
                </div>
                <Link href={route('orders.show', ticket.order_id)} className="block mt-6 text-center text-sm text-muted-foreground hover:text-foreground transition font-medium">
                    View Order &rarr;
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

function TicketRow({ label, value }) {
    return (<div><p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p><p className="text-foreground text-sm font-medium mt-0.5">{value}</p></div>);
}
