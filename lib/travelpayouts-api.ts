import { Deal, TravelpayoutsApiResponse } from '@/types';

const TRAVELPAYOUTS_API_KEY = process.env.TRAVELPAYOUTS_API_KEY;
const TRAVELPAYOUTS_API_BASE_URL = 'https://api.travelpayouts.com/v2';

export interface TravelpayoutsSearchParams {
  origin: string;
  destination?: string;
  beginning_of_period: string;
  period_type?: string;
  one_way?: boolean;
  currency?: string;
  limit?: number;
}

/**
 * Searches for cheap flights using the Travelpayouts API
 * Documentation: https://support.travelpayouts.com/hc/en-us/articles/203956163-Flights-Data-API
 */
export async function searchCheapFlights(
  params: TravelpayoutsSearchParams
): Promise<TravelpayoutsApiResponse> {
  if (!TRAVELPAYOUTS_API_KEY) {
    console.warn('TRAVELPAYOUTS_API_KEY not set. Using mock data.');
    return { success: false, data: [] };
  }

  const queryParams = new URLSearchParams({
    token: TRAVELPAYOUTS_API_KEY,
    currency: params.currency || 'USD',
    origin: params.origin,
    beginning_of_period: params.beginning_of_period,
  });

  if (params.destination) {
    queryParams.append('destination', params.destination);
  }
  if (params.one_way !== undefined) {
    queryParams.append('one_way', params.one_way.toString());
  }

  try {
    const response = await fetch(
      `${TRAVELPAYOUTS_API_BASE_URL}/prices/latest?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Travelpayouts API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: data.success || false,
      data: data.data || [],
    };
  } catch (error) {
    console.error('Error fetching from Travelpayouts API:', error);
    throw error;
  }
}

/**
 * Gets the cheapest tickets for a specific route
 */
export async function getCheapestTickets(
  origin: string,
  destination: string,
  departureDate: string
): Promise<TravelpayoutsApiResponse> {
  return searchCheapFlights({
    origin,
    destination,
    beginning_of_period: departureDate,
    period_type: 'month',
  });
}

/**
 * Converts Travelpayouts API response to Deal format
 */
export function convertTravelpayoutsToDeal(data: any): Partial<Deal> {
  return {
    origin: data.origin || '',
    destination: data.destination || '',
    price: data.value || 0,
    departure_date: data.found_at || new Date().toISOString(),
    affiliate_link: `https://www.aviasales.com/search?origin=${data.origin}&destination=${data.destination}`,
  };
}

/**
 * Gets special offers from Travelpayouts
 */
export async function getSpecialOffers(origin: string): Promise<any> {
  if (!TRAVELPAYOUTS_API_KEY) {
    return { data: [] };
  }

  try {
    const response = await fetch(
      `${TRAVELPAYOUTS_API_BASE_URL}/prices/special-offers?token=${TRAVELPAYOUTS_API_KEY}&origin=${origin}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Travelpayouts API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching special offers from Travelpayouts:', error);
    throw error;
  }
}
