import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_status, subscription_id, subscription_ends_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: user.subscription_status || 'free',
      subscriptionId: user.subscription_id,
      endsAt: user.subscription_ends_at,
    });
  } catch (error: any) {
    console.error('Error getting subscription status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
