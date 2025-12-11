import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, calculateTotalPrice, FlightSearchParams } from '@/lib/duffel';

// Helper function to deduplicate offers by unique combination of fields
function deduplicateOffers(offers: any[]) {
  const seen = new Set();
  return offers.filter((offer) => {
    // Create unique key based on critical fields
    const key = `${offer.owner.iata_code}-${offer.slices.map((s: any) => 
      `${s.origin.iata_code}-${s.destination.iata_code}-${s.segments[0]?.departing_at}`
    ).join('|')}-${offer.total_amount}`;
    
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const searchParams: FlightSearchParams = {
      origin: body.origin,
      destination: body.destination,
      departureDate: body.departureDate,
      returnDate: body.returnDate,
      passengers: {
        adults: parseInt(body.adults) || 1,
        children: parseInt(body.children) || 0,
        infants: parseInt(body.infants) || 0,
      },
      cabinClass: body.cabinClass || 'economy',
    };

    // Validate required fields
    if (!searchParams.origin || !searchParams.destination || !searchParams.departureDate) {
      return NextResponse.json(
        { error: 'Missing required fields: origin, destination, or departureDate' },
        { status: 400 }
      );
    }

    // Handle flexible date search (±3 days)
    if (body.flexibleDates) {
      const baseDate = new Date(body.departureDate);
      const dateRangeResults: any[] = [];
      
      // Search 3 days before and after
      for (let i = -3; i <= 3; i++) {
        const searchDate = new Date(baseDate);
        searchDate.setDate(searchDate.getDate() + i);
        
        // Calculate return date if provided
        let returnDate = searchParams.returnDate;
        if (returnDate) {
          const baseReturnDate = new Date(body.returnDate);
          const adjustedReturnDate = new Date(baseReturnDate);
          adjustedReturnDate.setDate(adjustedReturnDate.getDate() + i);
          returnDate = adjustedReturnDate.toISOString().split('T')[0];
        }
        
        try {
          // Search this date
          const result = await searchFlights({
            ...searchParams,
            departureDate: searchDate.toISOString().split('T')[0],
            returnDate,
          });
          
          dateRangeResults.push(...result.offers);
        } catch (error) {
          console.error(`Error searching date ${searchDate.toISOString().split('T')[0]}:`, error);
          // Continue with other dates even if one fails
        }
      }
      
      // Deduplicate and sort by price
      const uniqueOffers = deduplicateOffers(dateRangeResults);
      const sortedOffers = uniqueOffers.sort((a, b) => 
        parseFloat(a.total_amount) - parseFloat(b.total_amount)
      );
      
      // Add our markup to each offer
      const offersWithMarkup = sortedOffers.slice(0, 20).map((offer: any) => {
        const duffelPrice = parseFloat(offer.total_amount);
        const ourPrice = calculateTotalPrice(duffelPrice);
        
        return {
          ...offer,
          original_duffel_price: offer.total_amount,
          display_price: ourPrice.toFixed(2),
          display_currency: offer.total_currency,
        };
      });
      
      return NextResponse.json({
        success: true,
        offers: offersWithMarkup,
        count: offersWithMarkup.length,
        flexibleDates: true,
      });
    }

    // Standard exact date search
    const result = await searchFlights(searchParams);

    // Add our markup to each offer
    const offersWithMarkup = result.offers.map((offer: any) => {
      const duffelPrice = parseFloat(offer.total_amount);
      const ourPrice = calculateTotalPrice(duffelPrice);
      
      return {
        ...offer,
        original_duffel_price: offer.total_amount,
        display_price: ourPrice.toFixed(2),
        display_currency: offer.total_currency,
      };
    });

    return NextResponse.json({
      success: true,
      offers: offersWithMarkup,
      offerRequestId: result.offerRequestId,
      count: offersWithMarkup.length,
    });
  } catch (error: any) {
    console.error('Error in search flights API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search flights', 
        message: error.message,
        details: error.errors || error,
      },
      { status: 500 }
    );
  }
}
