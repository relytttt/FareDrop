import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, calculateTotalPrice, FlightSearchParams } from '@/lib/duffel';

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
