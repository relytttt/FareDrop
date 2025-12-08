import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const region = searchParams.get('region');
    const limit = searchParams.get('limit') || '50';

    let query = supabase
      .from('deals')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('deal_score', { ascending: false });

    if (origin) {
      query = query.eq('origin', origin);
    }

    if (region) {
      query = query.eq('destination_region', region);
    }

    query = query.limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch deals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deals: data || [] });
  } catch (error) {
    console.error('Error in deals API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      origin_city,
      destination_city,
      destination_region,
      price,
      original_price,
      airline,
      departure_date,
      return_date,
      deal_score,
      affiliate_link,
      expires_at,
      trip_type,
    } = body;

    // Validate required fields
    if (!origin || !destination || !price || !airline || !departure_date || !affiliate_link || !expires_at) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('deals')
      .insert([
        {
          origin,
          destination,
          origin_city,
          destination_city,
          destination_region,
          price,
          original_price,
          airline,
          departure_date,
          return_date,
          deal_score: deal_score || 70,
          affiliate_link,
          expires_at,
          trip_type: trip_type || 'round-trip',
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create deal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deal: data?.[0] }, { status: 201 });
  } catch (error) {
    console.error('Error in deals POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
