import { Duffel } from '@duffel/api';

const duffel = new Duffel({
  token: process.env.DUFFEL_API_TOKEN!,
});

export { duffel };

// Pricing strategy
export const SERVICE_FEE = 25; // Flat $25 per booking
export const MARKUP_PERCENTAGE = 0.05; // 5% markup on base fare

export function calculateTotalPrice(duffelPrice: number): number {
  const markup = duffelPrice * MARKUP_PERCENTAGE;
  return duffelPrice + markup + SERVICE_FEE;
}

export interface PassengerDetails {
  id?: string;
  type: 'adult' | 'child' | 'infant_without_seat';
  given_name: string;
  family_name: string;
  born_on: string; // YYYY-MM-DD
  gender: 'm' | 'f';
  email?: string;
  phone_number?: string;
  title?: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
}

// Helper function to search flights
export async function searchFlights(params: FlightSearchParams) {
  try {
    const slices: any[] = [
      {
        origin: params.origin,
        destination: params.destination,
        departure_date: params.departureDate,
      },
    ];

    // Add return flight if round trip
    if (params.returnDate) {
      slices.push({
        origin: params.destination,
        destination: params.origin,
        departure_date: params.returnDate,
      });
    }

    // Build passengers array
    const passengers: any[] = [];
    for (let i = 0; i < params.passengers.adults; i++) {
      passengers.push({ type: 'adult' as const });
    }
    for (let i = 0; i < params.passengers.children; i++) {
      passengers.push({ type: 'child' as const });
    }
    for (let i = 0; i < params.passengers.infants; i++) {
      passengers.push({ type: 'infant_without_seat' as const });
    }

    // Create offer request
    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers,
      cabin_class: params.cabinClass || 'economy',
      return_offers: true,
    } as any);

    // Wait for offers to be ready (polling)
    let offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id,
      sort: 'total_amount',
    });

    return {
      offers: offers.data,
      offerRequestId: offerRequest.data.id,
    };
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
}

// Get a specific offer
export async function getOffer(offerId: string) {
  try {
    const offer = await duffel.offers.get(offerId);
    return offer.data;
  } catch (error) {
    console.error('Error getting offer:', error);
    throw error;
  }
}

// Create an order
export async function createOrder(
  offerId: string,
  passengers: PassengerDetails[],
  metadata?: Record<string, any>
) {
  try {
    const order = await duffel.orders.create({
      selected_offers: [offerId],
      passengers: passengers as any,
      type: 'instant',
      metadata,
    } as any);

    return order.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Get available services for an offer (baggage, seats, etc.)
export async function getAvailableServices(offerId: string) {
  try {
    // Note: This would require the actual offer_request_id, not the offer_id
    // For now, this is a placeholder for future implementation
    return [];
  } catch (error) {
    console.error('Error getting available services:', error);
    throw error;
  }
}
