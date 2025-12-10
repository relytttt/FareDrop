import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { sendPriceAlertEmail } from '@/lib/email';

/**
 * Cron job to check price alerts and send notifications
 * Should be triggered hourly by Vercel Cron or similar service
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const results = {
    checked: 0,
    triggered: 0,
    errors: 0,
    alerts: [] as any[],
  };

  try {
    // Fetch all active price alerts
    const { data: activeAlerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*, user:users(*)')
      .eq('is_active', true);

    if (alertsError) throw alertsError;

    if (!activeAlerts || activeAlerts.length === 0) {
      return NextResponse.json({
        message: 'No active alerts to check',
        results,
      });
    }

    results.checked = activeAlerts.length;

    // Check each alert
    for (const alert of activeAlerts) {
      try {
        // Search for current prices using Duffel or other API
        // For now, we'll simulate price checking
        // In production, you'd integrate with Duffel API to search for real prices
        
        // Simulate finding a price (you'd replace this with actual API call)
        const currentPrice = await checkFlightPrice(alert);

        // Update the alert with current price
        await supabase
          .from('price_alerts')
          .update({
            current_lowest_price: currentPrice,
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', alert.id);

        // Log price history
        await supabase
          .from('price_alert_history')
          .insert({
            alert_id: alert.id,
            price: currentPrice,
          });

        // Check if price dropped below target and hasn't been triggered yet
        if (currentPrice <= alert.target_price && !alert.triggered_at) {
          // Send notification email
          const dealLink = `${process.env.NEXT_PUBLIC_SITE_URL}/flights?origin=${alert.origin}&destination=${alert.destination}${alert.departure_date_from ? `&departureDate=${alert.departure_date_from}` : ''}`;

          const emailResult = await sendPriceAlertEmail({
            user: alert.user,
            alert,
            currentPrice,
            dealLink,
          });

          if (emailResult.success) {
            // Mark alert as triggered
            await supabase
              .from('price_alerts')
              .update({
                triggered_at: new Date().toISOString(),
                is_active: false, // Deactivate after triggering
              })
              .eq('id', alert.id);

            results.triggered++;
            results.alerts.push({
              id: alert.id,
              route: `${alert.origin} → ${alert.destination}`,
              currentPrice,
              targetPrice: alert.target_price,
              user: alert.user.email,
            });
          }
        }
      } catch (error) {
        console.error(`Error checking alert ${alert.id}:`, error);
        results.errors++;
      }
    }

    return NextResponse.json({
      message: 'Price alerts checked successfully',
      results,
    });
  } catch (error: any) {
    console.error('Error in check-price-alerts cron:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error', results },
      { status: 500 }
    );
  }
}

/**
 * Check flight price for an alert
 * In production, this would call the Duffel API or other flight search API
 */
async function checkFlightPrice(alert: any): Promise<number> {
  // Simulate price checking
  // In production, you would:
  // 1. Use Duffel API to search for flights
  // 2. Filter by origin, destination, and date range
  // 3. Return the lowest price found
  
  // For now, return a random price for demonstration
  const basePrice = alert.target_price;
  const variation = Math.random() * 200 - 100; // Random variation between -100 and +100
  return Math.max(100, basePrice + variation);
}

// Allow POST as well for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
