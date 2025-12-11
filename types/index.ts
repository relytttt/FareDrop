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

export type ViewMode = 'list' | 'tile';

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
  depart_date?: string;
  departure_at?: string;
  return_date?: string;
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

// Duffel API Types
export interface DuffelOffer {
  id: string;
  total_amount: string;
  total_currency: string;
  base_amount?: string;
  tax_amount?: string;
  owner: {
    name: string;
    logo_symbol_url?: string;
  };
  slices: DuffelSlice[];
  passengers: DuffelPassenger[];
  available_services?: any[];
  created_at: string;
  expires_at: string;
}

export interface DuffelSlice {
  id: string;
  origin: {
    iata_code: string;
    city_name?: string;
    name?: string;
  };
  destination: {
    iata_code: string;
    city_name?: string;
    name?: string;
  };
  departure_time?: string;
  arrival_time?: string;
  duration: string;
  segments: DuffelSegment[];
}

export interface DuffelSegment {
  id: string;
  origin: {
    iata_code: string;
    name?: string;
  };
  destination: {
    iata_code: string;
    name?: string;
  };
  departing_at: string;
  arriving_at: string;
  duration: string;
  operating_carrier: {
    name: string;
    iata_code: string;
    logo_symbol_url?: string;
  };
  marketing_carrier: {
    name: string;
    iata_code: string;
  };
  aircraft?: {
    name?: string;
  };
}

export interface DuffelPassenger {
  id?: string;
  type: 'adult' | 'child' | 'infant_without_seat';
  given_name?: string;
  family_name?: string;
  born_on?: string;
  gender?: 'm' | 'f';
  email?: string;
  phone_number?: string;
}

export interface DuffelOrder {
  id: string;
  booking_reference: string;
  total_amount: string;
  total_currency: string;
  created_at: string;
  passengers: DuffelPassenger[];
  slices: DuffelSlice[];
}

export interface FlightSearchFormData {
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
}

// Phase 2B: User Accounts and Features Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'premium';
  role?: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name?: string;
  origin: string;
  destination: string;
  departure_date_from?: string;
  departure_date_to?: string;
  return_date_from?: string;
  return_date_to?: string;
  passengers_adults: number;
  passengers_children: number;
  passengers_infants: number;
  cabin_class: string;
  created_at: string;
}

export interface FavoriteDeal {
  id: string;
  user_id: string;
  deal_id: string;
  deal?: Deal; // Populated via join
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  target_price: number;
  current_lowest_price?: number;
  departure_date_from?: string;
  departure_date_to?: string;
  is_active: boolean;
  last_checked_at?: string;
  triggered_at?: string;
  created_at: string;
}

export interface PriceAlertHistory {
  id: string;
  alert_id: string;
  price: number;
  checked_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  duffel_order_id?: string;
  booking_reference?: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers_count: number;
  total_amount: number;
  currency: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  booking_data?: any;
  created_at: string;
  updated_at: string;
}
