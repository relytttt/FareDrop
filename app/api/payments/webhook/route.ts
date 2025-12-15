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
        const { offer_id, passengers_json, trip_extras_json, user_id, departure_date, return_date } = session.metadata || {};
        
        if (!offer_id) {
          console.error('No offer_id in session metadata');
          return NextResponse.json({ error: 'Missing offer_id' }, { status: 400 });
        }

        // Get payment intent details
        const paymentIntentId = session.payment_intent as string;
        
        try {
          // Parse passengers from metadata
          const passengers = passengers_json ? JSON.parse(passengers_json) : [];
          const tripExtras = trip_extras_json ? JSON.parse(trip_extras_json) : [];
          
          if (passengers.length === 0) {
            throw new Error('No passenger data found in session metadata');
          }

          // CREATE ACTUAL DUFFEL ORDER
          console.log('Creating Duffel order for offer:', offer_id);
          const duffelOrder = await createOrder(offer_id, passengers);
          
          console.log('Duffel order created:', duffelOrder.id);

          // Save booking with REAL Duffel data
          const bookingData = {
            user_id: user_id || null,
            duffel_order_id: duffelOrder.id,
            booking_reference: duffelOrder.booking_reference,
            stripe_payment_id: paymentIntentId,
            total_amount: parseFloat(duffelOrder.total_amount),
            currency: duffelOrder.total_currency,
            status: 'confirmed',
            origin: duffelOrder.slices[0]?.origin.iata_code || 'Unknown',
            destination: duffelOrder.slices[0]?.destination.iata_code || 'Unknown',
            departure_date: duffelOrder.slices[0]?.segments[0]?.departing_at?.split('T')[0] || departure_date,
            return_date: duffelOrder.slices[1]?.segments[0]?.departing_at?.split('T')[0] || return_date || null,
            passenger_count: passengers.length,
            trip_extras: tripExtras.length > 0 ? tripExtras : null,
          };

          const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([bookingData])
            .select()
            .single();

          if (bookingError) {
            console.error('Error creating booking:', bookingError);
            throw bookingError;
          }

          console.log('Booking created successfully:', booking.id);

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

          // SEND CONFIRMATION EMAIL
          if (session.customer_email || passengers[0]?.email) {
            const { sendBookingConfirmationEmail } = await import('@/lib/email');
            
            await sendBookingConfirmationEmail({
              to: session.customer_email || passengers[0]?.email,
              bookingReference: duffelOrder.booking_reference,
              flightDetails: duffelOrder.slices,
              totalAmount: `${duffelOrder.total_currency} ${parseFloat(duffelOrder.total_amount).toFixed(2)}`,
              passengerNames: passengers.map((p: any) => `${p.given_name} ${p.family_name}`).join(', '),
            });
            
            console.log('Confirmation email sent');
          }

        } catch (error: unknown) {
          console.error('Error creating Duffel order:', error);
          
          // Create a failed booking record for tracking
          try {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Failed to create Duffel order:', errorMessage);
            const bookingData = {
              user_id: user_id || null,
              duffel_order_id: `failed_${offer_id}_${Date.now()}`,
              booking_reference: `ERROR_${Date.now().toString().slice(-8)}`,
              stripe_payment_id: paymentIntentId,
              total_amount: (session.amount_total || 0) / 100,
              currency: (session.currency || 'aud').toUpperCase(),
              status: 'failed',
              origin: 'Unknown',
              destination: 'Unknown',
              departure_date: departure_date || new Date().toISOString().split('T')[0],
              return_date: return_date || null,
              passenger_count: passengers_json ? JSON.parse(passengers_json).length : 1,
            };

            await supabase.from('bookings').insert([bookingData]);
          } catch (fallbackError) {
            console.error('Error creating fallback booking record:', fallbackError);
          }
          
          // Note: In production, you might want to automatically refund the payment
          // await stripe.refunds.create({ payment_intent: paymentIntentId });
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
