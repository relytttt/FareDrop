import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServiceSupabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { subscriptionId, userId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscription ID' },
        { status: 400 }
      );
    }

    // Cancel the subscription at period end
    const response = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update user in database
    if (userId) {
      const supabase = getServiceSupabase();
      const subscription = response as any;
      const endsAt = subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : new Date().toISOString();
      
      await supabase
        .from('users')
        .update({
          subscription_status: 'cancelled',
          subscription_ends_at: endsAt,
        })
        .eq('id', userId);
    }

    return NextResponse.json({
      success: true,
      endsAt: (response as any).current_period_end || null,
    });
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
