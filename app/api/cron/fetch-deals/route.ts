import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';
import { searchFlights, convertKiwiToDeal } from '@/lib/kiwi-api';
import { searchCheapFlights, convertTravelpayoutsToDeal } from '@/lib/travelpayouts-api';
import { sendBatchDealAlerts } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    // Verify Vercel cron secret
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret) {
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const supabase = getServiceSupabase();
    const newDeals: any[] = [];

    // List of Australian origins to search from
    const origins = ['SYD', 'MEL', 'BNE', 'PER', 'ADL', 'OOL', 'CNS'];
    
    // Popular international destinations (for future use in targeted route searches)
    const popularDestinations = ['DPS', 'NRT', 'HND', 'SIN', 'BKK', 'HKT', 'AKL', 'ZQN', 'FJI', 'NAN', 'LHR', 'LAX', 'HNL', 'SGN', 'HAN', 'KUL', 'MNL', 'ICN', 'TPE', 'HKG'];

    // Get dates for search
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const threeMonthsOut = new Date(today);
    threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

    // Fetch deals from APIs (if configured)
    for (const origin of origins) {
      // Search all Australian origins
      try {
        // Try Kiwi API
        if (process.env.KIWI_API_KEY) {
          const kiwiResults = await searchFlights({
            fly_from: origin,
            date_from: nextMonth.toISOString().split('T')[0],
            date_to: threeMonthsOut.toISOString().split('T')[0],
            limit: 10,
            price_to: 1500,
          });

          // Convert and filter good deals
          if (kiwiResults.data && kiwiResults.data.length > 0) {
            for (const flight of kiwiResults.data.slice(0, 15)) {
              const deal = convertKiwiToDeal(flight);
              if (deal.price && deal.price < 1500) {
                newDeals.push({
                  ...deal,
                  deal_score: Math.floor(Math.random() * 30) + 70, // 70-100
                  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  original_price: deal.price ? deal.price * 1.5 : null,
                });
              }
            }
          }
        }

        // Try Travelpayouts API
        if (process.env.TRAVELPAYOUTS_API_KEY) {
          const tpResults = await searchCheapFlights({
            origin,
            beginning_of_period: nextMonth.toISOString().split('T')[0],
          });

          if (tpResults.success && tpResults.data && tpResults.data.length > 0) {
            for (const flight of tpResults.data.slice(0, 15)) {
              const deal = convertTravelpayoutsToDeal(flight);
              if (deal.price && deal.price < 1500) {
                newDeals.push({
                  ...deal,
                  airline: 'Various',
                  deal_score: Math.floor(Math.random() * 30) + 70,
                  expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  original_price: deal.price ? deal.price * 1.5 : null,
                  return_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
                });
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching deals for ${origin}:`, error);
      }
    }

    // Insert new deals into database
    let insertedDeals = [];
    if (newDeals.length > 0) {
      const { data, error } = await supabase
        .from('deals')
        .insert(newDeals.slice(0, 100)) // Limit to 100 deals per run
        .select();

      if (error) {
        console.error('Error inserting deals:', error);
      } else {
        insertedDeals = data || [];
      }
    }

    // Send email alerts for new deals
    const alertsSent = await sendAlertsForNewDeals(insertedDeals);

    return NextResponse.json({
      success: true,
      dealsFound: newDeals.length,
      dealsInserted: insertedDeals.length,
      alertsSent,
    });
  } catch (error) {
    console.error('Error in fetch-deals cron:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendAlertsForNewDeals(deals: any[]) {
  if (!deals || deals.length === 0) return 0;

  const supabase = getServiceSupabase();

  // Get all verified subscribers
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .eq('verified', true);

  if (!subscribers || subscribers.length === 0) return 0;

  const alertsToSend = [];

  // Match deals with subscriber preferences
  for (const deal of deals) {
    for (const subscriber of subscribers) {
      let shouldAlert = false;

      // Check departure city preference
      if (subscriber.departure_city) {
        const prefCity = subscriber.departure_city.split('(')[0].trim();
        if (deal.origin_city?.includes(prefCity) || deal.origin === prefCity) {
          shouldAlert = true;
        }
      } else {
        shouldAlert = true; // No preference, send all
      }

      // Check destination preferences
      if (shouldAlert && subscriber.destinations && subscriber.destinations.length > 0) {
        shouldAlert = subscriber.destinations.includes(deal.destination_region);
      }

      if (shouldAlert) {
        alertsToSend.push({ subscriber, deal });
      }
    }
  }

  // Send batch alerts
  const result = await sendBatchDealAlerts(alertsToSend.slice(0, 100)); // Limit to 100 emails per run

  // Record alerts in database
  if (result.successful > 0) {
    const alertRecords = alertsToSend.slice(0, result.successful).map((alert) => ({
      subscriber_id: alert.subscriber.id,
      deal_id: alert.deal.id,
    }));

    await supabase.from('alerts').insert(alertRecords);
  }

  return result.successful;
}
