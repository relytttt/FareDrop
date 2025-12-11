import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      offerId, 
      passengerCount, 
      route, 
      totalAmount, 
      currency = 'AUD', 
      passengers,
      userId,
      origin,
      destination,
      departureDate,
      returnDate,
      metadata = {} 
    } = body;

    if (!offerId || !passengerCount || !route || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate passenger data
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return NextResponse.json(
        { error: 'Passenger data is required' },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: `Flight Booking: ${route}`,
              description: `${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/flights`,
      customer_email: passengers[0]?.email || undefined,
      metadata: {
        offer_id: offerId,
        passenger_count: passengerCount.toString(),
        route,
        passengers_json: JSON.stringify(passengers),
        user_id: userId || '',
        origin: origin || route.split(' → ')[0] || '',
        destination: destination || route.split(' → ')[1] || '',
        departure_date: departureDate || '',
        return_date: returnDate || '',
        ...metadata,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
