import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard, StatusBadge } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function OrdersIndex({ orders }) {
    return (
        <AuthenticatedLayout>
            <Head title="My Orders" />
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>
                {orders.length === 0 ? (
                    <div className="text-center py-20 animate-slide-up">
                        <GlassCard className="rounded-2xl p-12 max-w-md mx-auto">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">No orders yet.</p>
                            <Link href={route('events.index')} className="text-primary hover:text-primary/80 transition font-medium text-sm underline">Browse Events</Link>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, i) => (
                            <Link key={order.id} href={route('orders.show', order.id)} className="block animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <GlassCard hover className="rounded-2xl p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-foreground mb-1">{order.event?.title}</h3>
                                            <p className="text-sm text-muted-foreground">{order.quantity} ticket{order.quantity > 1 ? 's' : ''} &middot; {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-foreground font-bold">Rs {order.total_amount}</p>
                                            <StatusBadge status={order.status} className="mt-1" />
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
