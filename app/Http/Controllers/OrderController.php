<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Order;
use App\Models\Ticket;
use App\Models\ActivityLog;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private PaymentService $paymentService) {}

    // Show checkout page with Stripe payment intent
    public function checkout(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $event = Event::findOrFail($request->event_id);

        if ($event->status !== 'published') {
            return back()->withErrors(['event' => 'This event is not available.']);
        }

        if ($event->availableTickets() < $request->quantity) {
            return back()->withErrors(['quantity' => 'Not enough tickets available.']);
        }

        $totalAmount = $event->ticket_price * $request->quantity;

        // Free events — skip Stripe
        if ($totalAmount == 0) {
            return $this->createOrder($request, $event, $request->quantity, 0, null);
        }

        // Create Stripe payment intent
        $intent = $this->paymentService->createPaymentIntent(
            (int) ($totalAmount * 100) // convert to cents
        );

        return Inertia::render('Orders/Checkout', [
            'event'         => $event,
            'quantity'      => (int) $request->quantity,
            'total_amount'  => $totalAmount,
            'client_secret' => $intent['client_secret'],
            'stripe_key'    => config('services.stripe.key'),
        ]);
    }

    // Confirm order after payment
    public function store(Request $request)
    {
        $request->validate([
            'event_id'           => 'required|exists:events,id',
            'quantity'           => 'required|integer|min:1|max:10',
            'payment_intent_id'  => 'required|string',
        ]);

        $event = Event::findOrFail($request->event_id);

        // Verify payment with Stripe
        $paid = $this->paymentService->confirmPayment($request->payment_intent_id);

        if (!$paid) {
            return back()->withErrors(['payment' => 'Payment could not be confirmed. Please try again.']);
        }

        return $this->createOrder(
            $request,
            $event,
            $request->quantity,
            $event->ticket_price * $request->quantity,
            $request->payment_intent_id
        );
    }

    private function createOrder(Request $request, Event $event, int $quantity, float $total, ?string $stripeId)
    {
        $updated = DB::table('events')
            ->where('id', $event->id)
            ->whereRaw('tickets_sold + ? <= total_tickets', [$quantity])
            ->update(['tickets_sold' => DB::raw('tickets_sold + ' . $quantity)]);

        if (!$updated) {
            return back()->withErrors(['quantity' => 'No tickets available.']);
        }

        $order = Order::create([
            'user_id'           => $request->user()->id,
            'event_id'          => $event->id,
            'quantity'          => $quantity,
            'total_amount'      => $total,
            'stripe_payment_id' => $stripeId,
            'status'            => 'completed',
        ]);

        for ($i = 0; $i < $quantity; $i++) {
            Ticket::create([
                'event_id' => $event->id,
                'user_id'  => $request->user()->id,
                'order_id' => $order->id,
                'qr_code'  => Str::uuid(),
                'status'   => 'valid',
            ]);
        }

        ActivityLog::create([
            'user_id'    => $request->user()->id,
            'action'     => 'orders.store',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'metadata'   => [
                'event_id' => $event->id,
                'quantity' => $quantity,
                'total'    => $total,
            ],
        ]);

        return redirect()->route('orders.show', $order)
            ->with('status', 'Tickets purchased successfully.');
    }

    public function show(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }
        $order->load(['event', 'tickets']);
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['event'])
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }
}