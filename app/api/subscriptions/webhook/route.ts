import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import Stripe from 'stripe';

interface SubscriptionWithPeriod extends Stripe.Subscription {
  current_period_end: number;
}

interface InvoiceWithSubscription extends Stripe.Invoice {
  subscription: string | Stripe.Subscription | null;
  payment_intent: string | Stripe.PaymentIntent | null;
  amount_paid: number;
}

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
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as SubscriptionWithPeriod;
        
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const status = subscription.status === 'active' ? 'premium' : subscription.status;
        const currentPeriodEnd = subscription.current_period_end || Math.floor(Date.now() / 1000);

        // Get user by customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({
              subscription_status: status,
              subscription_id: subscriptionId,
              subscription_ends_at: new Date(currentPeriodEnd * 1000).toISOString(),
            })
            .eq('id', user.id);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({
              subscription_status: 'free',
              subscription_id: null,
              subscription_ends_at: null,
            })
            .eq('id', user.id);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as InvoiceWithSubscription;
        
        if (invoice.subscription) {
          const customerId = invoice.customer as string;

          // Get user by customer ID
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (user) {
            // Create payment record for subscription payment
            const paymentIntentId = typeof invoice.payment_intent === 'string' 
              ? invoice.payment_intent 
              : invoice.payment_intent?.id || null;

            await supabase.from('payments').insert([
              {
                user_id: user.id,
                stripe_payment_intent_id: paymentIntentId,
                amount: (invoice.amount_paid || 0) / 100,
                currency: (invoice.currency || 'aud').toUpperCase(),
                status: 'succeeded',
                type: 'subscription',
              },
            ]);
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        console.error('Subscription payment failed:', invoice.id);
        
        // Optionally notify the user or update subscription status
        break;
      }

      default:
        console.log(`Unhandled subscription event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing subscription webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
