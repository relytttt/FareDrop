export interface TripExtra {
  id: string;
  name: string;
  category: 'car_rental' | 'insurance' | 'esim' | 'hotel';
  description: string;
  price: number; // Base price
  priceType: 'per_day' | 'per_trip' | 'one_time';
  icon: string; // Icon name
  features: string[];
  popular?: boolean;
}

export interface SelectedExtra {
  extra: TripExtra;
  quantity?: number; // for per_day items
  calculatedPrice: number;
}

export interface MinimalExtra {
  id: string;
  qty: number;
  price: number;
}

export const TRIP_EXTRAS: TripExtra[] = [
  {
    id: 'insurance_basic',
    name: 'Basic Travel Insurance',
    category: 'insurance',
    description: 'Essential coverage for your trip',
    price: 29,
    priceType: 'per_trip',
    icon: 'Shield',
    features: ['Medical emergencies up to $50,000', 'Trip cancellation', '24/7 support'],
    popular: true,
  },
  {
    id: 'insurance_premium',
    name: 'Premium Travel Insurance',
    category: 'insurance',
    description: 'Comprehensive coverage for peace of mind',
    price: 59,
    priceType: 'per_trip',
    icon: 'ShieldCheck',
    features: ['Medical emergencies up to $250,000', 'Trip cancellation & interruption', 'Lost baggage coverage', 'Flight delay compensation', '24/7 support'],
  },
  {
    id: 'esim_1gb',
    name: 'eSIM Data - 1GB',
    category: 'esim',
    description: 'Stay connected with mobile data',
    price: 9,
    priceType: 'one_time',
    icon: 'Smartphone',
    features: ['1GB data', '7 days validity', 'Instant activation', '100+ countries'],
  },
  {
    id: 'esim_5gb',
    name: 'eSIM Data - 5GB',
    category: 'esim',
    description: 'More data for longer trips',
    price: 25,
    priceType: 'one_time',
    icon: 'Smartphone',
    features: ['5GB data', '30 days validity', 'Instant activation', '100+ countries'],
    popular: true,
  },
  {
    id: 'esim_unlimited',
    name: 'eSIM Data - Unlimited',
    category: 'esim',
    description: 'Unlimited data for heavy users',
    price: 49,
    priceType: 'one_time',
    icon: 'Wifi',
    features: ['Unlimited data', '30 days validity', 'Instant activation', '100+ countries'],
  },
  {
    id: 'car_economy',
    name: 'Economy Car Rental',
    category: 'car_rental',
    description: 'Compact car for city driving',
    price: 35,
    priceType: 'per_day',
    icon: 'Car',
    features: ['Compact/economy class', 'Free cancellation', 'Unlimited mileage', 'Basic insurance included'],
  },
  {
    id: 'car_suv',
    name: 'SUV Rental',
    category: 'car_rental',
    description: 'Spacious SUV for families or groups',
    price: 65,
    priceType: 'per_day',
    icon: 'Car',
    features: ['Mid-size SUV', 'Free cancellation', 'Unlimited mileage', 'Basic insurance included'],
    popular: true,
  },
];

// Helper function to calculate price based on trip duration
export function calculateExtraPrice(extra: TripExtra, tripDuration: number): number {
  if (extra.priceType === 'per_day') {
    return extra.price * tripDuration;
  }
  return extra.price;
}

// Helper function to get extras by category
export function getExtrasByCategory(category: TripExtra['category']): TripExtra[] {
  return TRIP_EXTRAS.filter(extra => extra.category === category);
}
