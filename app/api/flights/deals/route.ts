import { NextRequest, NextResponse } from 'next/server';
import { duffel, calculateTotalPrice } from '@/lib/duffel';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

const POPULAR_ROUTES = [
  { origin: 'SYD', destination: 'DPS', originCity: 'Sydney', destinationCity: 'Bali' },
  { origin: 'SYD', destination: 'BKK', originCity: 'Sydney', destinationCity: 'Bangkok' },
  { origin: 'MEL', destination: 'SIN', originCity: 'Melbourne', destinationCity: 'Singapore' },
  { origin: 'BNE', destination: 'NAN', originCity: 'Brisbane', destinationCity: 'Fiji' },
  { origin: 'SYD', destination: 'AKL', originCity: 'Sydney', destinationCity: 'Auckland' },
  { origin: 'MEL', destination: 'NRT', originCity: 'Melbourne', destinationCity: 'Tokyo' },
  { origin: 'SYD', destination: 'LAX', originCity: 'Sydney', destinationCity: 'Los Angeles' },
  { origin: 'PER', destination: 'DPS', originCity: 'Perth', destinationCity: 'Bali' },
  { origin: 'SYD', destination: 'HNL', originCity: 'Sydney', destinationCity: 'Honolulu' },
  { origin: 'MEL', destination: 'HKT', originCity: 'Melbourne', destinationCity: 'Phuket' },
  { origin: 'SYD', destination: 'LHR', originCity: 'Sydney', destinationCity: 'London' },
  { origin: 'BNE', destination: 'DPS', originCity: 'Brisbane', destinationCity: 'Bali' },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get departure date (default: 1 month from now)
    let departureDate = searchParams.get('departure');
    if (!departureDate) {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      departureDate = date.toISOString().split('T')[0];
    }
    
    // Get return date (default: 1 week after departure)
    let returnDate = searchParams.get('return');
    if (!returnDate) {
      const date = new Date(departureDate);
      date.setDate(date.getDate() + 7);
      returnDate = date.toISOString().split('T')[0];
    }

    const deals = [];

    // Fetch cheapest price for each route (in parallel)
    const routePromises = POPULAR_ROUTES.map(async (route) => {
      try {
        // Create offer request with Duffel API
        // Note: Using 'as any' due to complex Duffel SDK type requirements
        const offerRequest = await duffel.offerRequests.create({
          slices: [
            { origin: route.origin, destination: route.destination, departure_date: departureDate },
            { origin: route.destination, destination: route.origin, departure_date: returnDate },
          ],
          passengers: [{ type: 'adult' }],
          cabin_class: 'economy',
          return_offers: true,
        } as any);

        const offers = await duffel.offers.list({
          offer_request_id: offerRequest.data.id,
          sort: 'total_amount',
          limit: 1, // Just get cheapest
        });

        if (offers.data && offers.data.length > 0) {
          const cheapestOffer = offers.data[0];
          const basePrice = parseFloat(cheapestOffer.total_amount);
          
          return {
            id: cheapestOffer.id,
            origin: route.origin,
            destination: route.destination,
            origin_city: route.originCity,
            destination_city: route.destinationCity,
            price: calculateTotalPrice(basePrice), // Includes markup
            base_price: basePrice,
            currency: cheapestOffer.total_currency,
            departure_date: departureDate,
            return_date: returnDate,
            airline: cheapestOffer.owner?.name || 'Various',
            airline_logo: cheapestOffer.owner?.logo_symbol_url,
            stops: cheapestOffer.slices?.[0]?.segments?.length - 1 || 0,
            duration: cheapestOffer.slices?.[0]?.duration,
            offer_id: cheapestOffer.id,
            // For booking link
            search_params: {
              origin: route.origin,
              destination: route.destination,
              departureDate: departureDate,
              returnDate: returnDate,
              adults: 1,
            },
            // Legacy fields for compatibility with DealCard component
            original_price: null,
            deal_score: 75,
            affiliate_link: '', // Will be replaced with flights page link
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
            trip_type: 'round-trip' as const,
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${route.origin}-${route.destination}:`, error);
        return null;
      }
    });

    const results = await Promise.all(routePromises);
    const validDeals = results.filter((deal): deal is NonNullable<typeof deal> => deal !== null);

    // Sort by price
    validDeals.sort((a, b) => a.price - b.price);

    return NextResponse.json({ 
      deals: validDeals,
      fetched_at: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300', // Cache for 10 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching live deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}
