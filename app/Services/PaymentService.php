<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\CardException;

class PaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPaymentIntent(int $amountInCents, string $currency = 'usd'): array
    {
        $intent = PaymentIntent::create([
            'amount'   => $amountInCents,
            'currency' => $currency,
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return [
            'client_secret'    => $intent->client_secret,
            'payment_intent_id' => $intent->id,
        ];
    }

    public function confirmPayment(string $paymentIntentId): bool
    {
        $intent = PaymentIntent::retrieve($paymentIntentId);
        return $intent->status === 'succeeded';
    }
}