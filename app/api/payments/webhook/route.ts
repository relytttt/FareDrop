import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import { createOrder } from '@/lib/duffel';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!stripe) {
    console.error('Stripe is not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getServiceSupabase();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract metadata
        const { offer_id, passenger_count, route } = session.metadata || {};
        
        if (!offer_id) {
          console.error('No offer_id in session metadata');
          return NextResponse.json({ error: 'Missing offer_id' }, { status: 400 });
        }

        // Get payment intent details
        const paymentIntentId = session.payment_intent as string;
        
        try {
          // In a real implementation, you would:
          // 1. Retrieve the full offer and passenger details from a temporary store or database
          // 2. Create the Duffel order
          // 3. Save the booking to the database
          // 4. Send confirmation email
          
          // For now, we'll create a placeholder booking record
          const bookingData = {
            stripe_payment_id: paymentIntentId,
            total_amount: (session.amount_total || 0) / 100,
            currency: (session.currency || 'aud').toUpperCase(),
            status: 'confirmed',
            origin: route?.split(' → ')[0] || 'Unknown',
            destination: route?.split(' → ')[1] || 'Unknown',
            departure_date: new Date().toISOString().split('T')[0], // Placeholder
            passenger_count: parseInt(passenger_count || '1'),
            booking_reference: `FD${Date.now().toString().slice(-8)}`, // Generate temporary reference
            duffel_order_id: `pending_${offer_id}`, // Placeholder until real order created
          };

          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

          if (bookingError) {
            console.error('Error creating booking:', bookingError);
          }

          // Create payment record
          const paymentData = {
            booking_id: booking?.id,
            stripe_payment_intent_id: paymentIntentId,
            amount: (session.amount_total || 0) / 100,
            currency: (session.currency || 'aud').toUpperCase(),
            status: 'succeeded',
            type: 'booking',
          };

          const { error: paymentError } = await supabase
            .from('payments')
            .insert([paymentData]);

          if (paymentError) {
            console.error('Error creating payment record:', paymentError);
          }

          // TODO: Send confirmation email using Resend
          // TODO: Create actual Duffel order

        } catch (error) {
          console.error('Error processing successful payment:', error);
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
        
        // Create failed payment record
        const paymentData = {
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'failed',
          type: 'booking',
        };

        await supabase.from('payments').insert([paymentData]);
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
