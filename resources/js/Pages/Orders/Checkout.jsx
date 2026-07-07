import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GlassCard } from '@/Components/ui/glass-card';
import { Button } from '@/Components/ui/button';

export default function Checkout({ event, quantity, total_amount, client_secret, stripe_key }) {
    const stripePromise = loadStripe(stripe_key);
    const appearance = { theme: 'stripe', variables: { colorPrimary: '#7c3aed', colorBackground: '#ffffff', colorText: '#1e1b4b', colorDanger: '#ef4444', borderRadius: '12px' } };

    return (
        <AuthenticatedLayout>
            <Head title="Checkout" />
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GlassCard className="rounded-2xl p-6 h-fit">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">Order Summary</h2>
                        <div className="space-y-3">
                            <Row label="Event" value={event.title} />
                            <Row label="Venue" value={event.venue} />
                            <Row label="Date" value={new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
                            <Row label="Quantity" value={`${quantity} ticket${quantity > 1 ? 's' : ''}`} />
                            <Row label="Price each" value={`Rs ${event.ticket_price}`} />
                            <div className="border-t border-white/10 pt-3"><Row label="Total" value={`Rs ${total_amount.toFixed(2)}`} bold /></div>
                        </div>
                    </GlassCard>
                    <GlassCard className="rounded-2xl p-6">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">Payment Details</h2>
                        <Elements stripe={stripePromise} options={{ clientSecret: client_secret, appearance }}>
                            <CheckoutForm eventId={event.id} quantity={quantity} />
                        </Elements>
                    </GlassCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function CheckoutForm({ eventId, quantity }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true); setError(null);
        const { error: submitError } = await elements.submit();
        if (submitError) { setError(submitError.message); setLoading(false); return; }
        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
        if (confirmError) { setError(confirmError.message); setLoading(false); return; }
        router.post(route('orders.store'), { event_id: eventId, quantity: quantity, payment_intent_id: paymentIntent.id });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <PaymentElement />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" disabled={!stripe || loading} className="w-full">
                {loading ? 'Processing...' : 'Pay Now'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">Payments secured by Stripe. Your card details never touch our servers.</p>
        </form>
    );
}

function Row({ label, value, bold }) {
    return (<div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className={bold ? 'text-foreground font-bold' : 'text-foreground'}>{value}</span></div>);
}
