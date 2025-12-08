import { Deal, KiwiApiResponse } from '@/types';

const KIWI_API_KEY = process.env.KIWI_API_KEY;
const KIWI_API_BASE_URL = 'https://api.tequila.kiwi.com';

export interface KiwiSearchParams {
  fly_from: string;
  fly_to?: string;
  date_from: string;
  date_to: string;
  return_from?: string;
  return_to?: string;
  nights_in_dst_from?: number;
  nights_in_dst_to?: number;
  price_to?: number;
  limit?: number;
  sort?: string;
}

/**
 * Searches for flights using the Kiwi.com Tequila API
 * Documentation: https://tequila.kiwi.com/docs/search_api/search/
 */
export async function searchFlights(params: KiwiSearchParams): Promise<KiwiApiResponse> {
  if (!KIWI_API_KEY) {
    console.warn('KIWI_API_KEY not set. Using mock data.');
    return { data: [] };
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(
      `${KIWI_API_BASE_URL}/v2/search?${queryParams.toString()}`,
      {
        headers: {
          'apikey': KIWI_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Kiwi API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching from Kiwi API:', error);
    throw error;
  }
}

/**
 * Converts Kiwi API response to Deal format
 */
export function convertKiwiToDeal(kiwiData: any): Partial<Deal> {
  const route = kiwiData.route || [];
  const firstLeg = route[0] || {};
  const lastLeg = route[route.length - 1] || {};

  return {
    origin: kiwiData.flyFrom || '',
    destination: kiwiData.flyTo || '',
    origin_city: kiwiData.cityFrom || '',
    destination_city: kiwiData.cityTo || '',
    price: kiwiData.price || 0,
    airline: kiwiData.airlines?.[0] || 'Unknown',
    departure_date: firstLeg.local_departure || new Date().toISOString(),
    return_date: lastLeg.local_arrival || null,
    affiliate_link: kiwiData.deep_link || '',
    trip_type: route.length > 1 ? 'round-trip' : 'one-way',
  };
}

/**
 * Gets popular destinations from a given origin
 */
export async function getPopularDestinations(origin: string): Promise<KiwiApiResponse> {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const threeMonthsOut = new Date(today);
  threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3);

  return searchFlights({
    fly_from: origin,
    date_from: nextMonth.toISOString().split('T')[0],
    date_to: threeMonthsOut.toISOString().split('T')[0],
    limit: 50,
    sort: 'popularity',
  });
}
