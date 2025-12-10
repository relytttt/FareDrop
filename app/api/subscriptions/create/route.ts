import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, priceId, userId } = body;

    if (!email || !priceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Check if user exists and get/create Stripe customer
    let customerId: string;
    
    if (userId) {
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (user?.stripe_customer_id) {
        customerId = user.stripe_customer_id;
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email,
          metadata: { user_id: userId },
        });
        customerId = customer.id;

        // Update user with Stripe customer ID
        await supabase
          .from('users')
          .update({ stripe_customer_id: customerId })
          .eq('id', userId);
      }
    } else {
      // Create customer without user ID
      const customer = await stripe.customers.create({
        email,
      });
      customerId = customer.id;
    }

    // Create Checkout Session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/pricing?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata: {
        user_id: userId || '',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
