import { Deal, TravelpayoutsApiResponse } from '@/types';

const TRAVELPAYOUTS_API_KEY = process.env.TRAVELPAYOUTS_API_KEY;
const TRAVELPAYOUTS_API_BASE_URL = 'https://api.travelpayouts.com/v2';

const AIRPORT_TO_CITY: Record<string, string> = {
  // Australian Origins
  'SYD': 'Sydney',
  'MEL': 'Melbourne', 
  'BNE': 'Brisbane',
  'PER': 'Perth',
  'ADL': 'Adelaide',
  'OOL': 'Gold Coast',
  'CNS': 'Cairns',
  'HBA': 'Hobart',
  'DRW': 'Darwin',
  'CBR': 'Canberra',
  // Asia
  'DPS': 'Bali',
  'CGK': 'Jakarta',
  'SIN': 'Singapore',
  'BKK': 'Bangkok',
  'HKT': 'Phuket',
  'NRT': 'Tokyo',
  'HND': 'Tokyo',
  'KIX': 'Osaka',
  'HKG': 'Hong Kong',
  'ICN': 'Seoul',
  'TPE': 'Taipei',
  'MNL': 'Manila',
  'SGN': 'Ho Chi Minh City',
  'HAN': 'Hanoi',
  'KUL': 'Kuala Lumpur',
  'PVG': 'Shanghai',
  'PEK': 'Beijing',
  // Pacific Islands
  'NAN': 'Fiji',
  'APW': 'Samoa',
  'VLI': 'Vanuatu',
  'PPT': 'Tahiti',
  'RAR': 'Rarotonga',
  // New Zealand
  'AKL': 'Auckland',
  'ZQN': 'Queenstown',
  'WLG': 'Wellington',
  'CHC': 'Christchurch',
  // Europe
  'LHR': 'London',
  'CDG': 'Paris',
  'FCO': 'Rome',
  'BCN': 'Barcelona',
  'AMS': 'Amsterdam',
  'FRA': 'Frankfurt',
  // North America
  'LAX': 'Los Angeles',
  'SFO': 'San Francisco',
  'JFK': 'New York',
  'HNL': 'Honolulu',
  'YVR': 'Vancouver',
  // Middle East
  'DXB': 'Dubai',
  'DOH': 'Doha',
  'AUH': 'Abu Dhabi',
  // Africa
  'JNB': 'Johannesburg',
  'CPT': 'Cape Town',
  'MRU': 'Mauritius',
};

const AIRPORT_TO_REGION: Record<string, string> = {
  // Asia
  'DPS': 'Asia', 'CGK': 'Asia', 'SIN': 'Asia', 'BKK': 'Asia', 'HKT': 'Asia',
  'NRT': 'Asia', 'HND': 'Asia', 'KIX': 'Asia', 'HKG': 'Asia', 'ICN': 'Asia',
  'TPE': 'Asia', 'MNL': 'Asia', 'SGN': 'Asia', 'HAN': 'Asia', 'KUL': 'Asia',
  'PVG': 'Asia', 'PEK': 'Asia',
  // Pacific Islands
  'NAN': 'Pacific Islands', 'APW': 'Pacific Islands', 'VLI': 'Pacific Islands',
  'PPT': 'Pacific Islands', 'RAR': 'Pacific Islands',
  // New Zealand
  'AKL': 'New Zealand', 'ZQN': 'New Zealand', 'WLG': 'New Zealand', 'CHC': 'New Zealand',
  // Europe
  'LHR': 'Europe', 'CDG': 'Europe', 'FCO': 'Europe', 'BCN': 'Europe',
  'AMS': 'Europe', 'FRA': 'Europe',
  // North America
  'LAX': 'North America', 'SFO': 'North America', 'JFK': 'North America',
  'HNL': 'North America', 'YVR': 'North America',
  // Middle East
  'DXB': 'Middle East', 'DOH': 'Middle East', 'AUH': 'Middle East',
  // Africa
  'JNB': 'Africa', 'CPT': 'Africa', 'MRU': 'Africa',
};

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
    currency: params.currency || 'AUD',
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
  // Use the actual departure date from the API response
  let departureDate = new Date();
  if (data.depart_date) {
    departureDate = new Date(data.depart_date);
  } else if (data.departure_at) {
    departureDate = new Date(data.departure_at);
  } else if (data.found_at) {
    // Fallback to found_at if no departure date is available
    const parsedDate = new Date(data.found_at);
    if (!isNaN(parsedDate.getTime())) {
      departureDate = parsedDate;
    }
  }
  
  // Calculate return date (default 7 days later for round trip)
  const returnDate = new Date(departureDate);
  returnDate.setDate(returnDate.getDate() + 7);
  
  // Format dates as DDMM for Aviasales
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}${month}`;
  };
  
  const departCode = formatDate(departureDate);
  const returnCode = formatDate(returnDate);
  
  // Generate proper Aviasales affiliate link
  // Format: /search/{origin}{departDate}{destination}{returnDate}{passengers}
  const affiliateLink = `https://www.aviasales.com/search/${data.origin}${departCode}${data.destination}${returnCode}1?marker=689762`;
  
  // Look up city names and region
  const originCity = AIRPORT_TO_CITY[data.origin] || data.origin;
  const destinationCity = AIRPORT_TO_CITY[data.destination] || data.destination;
  const destinationRegion = AIRPORT_TO_REGION[data.destination] || 'Other';
  
  return {
    origin: data.origin || '',
    destination: data.destination || '',
    origin_city: originCity,
    destination_city: destinationCity,
    destination_region: destinationRegion,
    price: data.value || 0,
    departure_date: departureDate.toISOString(),
    affiliate_link: affiliateLink,
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
