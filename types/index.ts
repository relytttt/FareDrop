// Australian market configuration - FareDrop v1.0
export interface Deal {
  id: string;
  origin: string;
  destination: string;
  price: number;
  original_price: number | null;
  airline: string;
  departure_date: string;
  return_date: string | null;
  deal_score: number;
  affiliate_link: string;
  created_at: string;
  expires_at: string;
  origin_city?: string;
  destination_city?: string;
  destination_region?: string;
  trip_type?: 'one-way' | 'round-trip';
}

export interface Subscriber {
  id: string;
  email: string;
  departure_city: string | null;
  destinations: string[] | null;
  created_at: string;
  verified: boolean;
}

export interface Alert {
  id: string;
  subscriber_id: string;
  deal_id: string;
  sent_at: string;
}

export interface SearchFilters {
  departureCity?: string;
  destinationRegion?: string;
  destinationCity?: string;
  sortBy?: 'price' | 'date' | 'discount';
  minDiscount?: number;
  maxPrice?: number;
}

export interface EmailCaptureData {
  email: string;
  departureCity?: string;
  destinations?: string[];
}

export interface KiwiApiResponse {
  data: KiwiFlightData[];
}

export interface KiwiFlightData {
  id: string;
  cityFrom: string;
  cityTo: string;
  price: number;
  airlines: string[];
  route: Array<{
    local_departure: string;
    local_arrival: string;
  }>;
  deep_link: string;
}

export interface TravelpayoutsApiResponse {
  success: boolean;
  data: TravelpayoutsFlightData[];
}

export interface TravelpayoutsFlightData {
  origin: string;
  destination: string;
  value: number;
  found_at: string;
  distance: number;
  actual: boolean;
}

export const REGIONS = [
  'All Regions',
  'Asia',
  'Pacific Islands',
  'New Zealand',
  'Europe',
  'North America',
  'Middle East',
  'Africa',
  'South America',
] as const;

export const DEPARTURE_CITIES = [
  'All Cities',
  'Sydney (SYD)',
  'Melbourne (MEL)',
  'Brisbane (BNE)',
  'Perth (PER)',
  'Adelaide (ADL)',
  'Gold Coast (OOL)',
  'Cairns (CNS)',
  'Hobart (HBA)',
  'Darwin (DRW)',
  'Canberra (CBR)',
] as const;

export type Region = (typeof REGIONS)[number];
export type DepartureCity = (typeof DEPARTURE_CITIES)[number];
