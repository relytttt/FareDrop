import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, departureCity, destinations } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Check if subscriber already exists
    const { data: existingSubscriber } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existingSubscriber) {
      // Update existing subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .update({
          departure_city: departureCity || null,
          destinations: destinations || null,
          verification_token: verificationToken,
        })
        .eq('email', email)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      // Send welcome email
      await sendWelcomeEmail({ email, verificationToken });

      return NextResponse.json({
        message: 'Subscription updated successfully',
        subscriber: data?.[0],
      });
    } else {
      // Create new subscriber
      const { data, error } = await supabase
        .from('subscribers')
        .insert([
          {
            email,
            departure_city: departureCity || null,
            destinations: destinations || null,
            verified: false,
            verification_token: verificationToken,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      // Send welcome email
      await sendWelcomeEmail({ email, verificationToken });

      return NextResponse.json(
        {
          message: 'Subscription created successfully',
          subscriber: data?.[0],
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ subscriber: data });
  } catch (error) {
    console.error('Error in subscribe GET API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
