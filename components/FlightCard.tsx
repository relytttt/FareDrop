'use client';

import { DuffelOffer, DuffelSlice } from '@/types';
import { format, isValid, parseISO } from 'date-fns';
import { Clock, Plane } from 'lucide-react';
import Link from 'next/link';

interface FlightCardProps {
  offer: DuffelOffer & {
    display_price?: string;
    display_currency?: string;
  };
  searchParams?: {
    adults?: string;
    children?: string;
    infants?: string;
  };
}

// Safe date formatter - returns fallback if date is invalid
const safeFormatDate = (dateString: string | null | undefined, formatStr: string, fallback: string = '--:--'): string => {
  if (!dateString) return fallback;
  
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return fallback;
    return format(date, formatStr);
  } catch {
    return fallback;
  }
};

// Helper to get departure time from slice or first segment
const getDepartureTime = (slice: DuffelSlice): string | null => {
  // Try slice level first, then fall back to first segment
  if (slice.departure_time) return slice.departure_time;
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[0].departing_at;
  }
  return null;
};

// Helper to get arrival time from slice or last segment
const getArrivalTime = (slice: DuffelSlice): string | null => {
  // Try slice level first, then fall back to last segment
  if (slice.arrival_time) return slice.arrival_time;
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[slice.segments.length - 1].arriving_at;
  }
  return null;
};

export default function FlightCard({ offer, searchParams }: FlightCardProps) {
  const formatDuration = (duration: string) => {
    // Duration is in format PT2H30M
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (match) {
      return `${match[1]}h ${match[2]}m`;
    }
    return duration;
  };

  const getStopsText = (segments: any[]) => {
    if (segments.length === 1) return 'Direct';
    return `${segments.length - 1} stop${segments.length - 1 > 1 ? 's' : ''}`;
  };

  const displayPrice = offer.display_price || offer.total_amount;
  const currency = offer.display_currency || offer.total_currency;

  // Build booking URL with passenger counts
  const bookingUrl = searchParams
    ? `/book/${offer.id}?adults=${searchParams.adults || 1}&children=${searchParams.children || 0}&infants=${searchParams.infants || 0}`
    : `/book/${offer.id}`;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-200">
      {/* Airline */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        {offer.owner.logo_symbol_url && (
          <img
            src={offer.owner.logo_symbol_url}
            alt={offer.owner.name}
            className="w-10 h-10 object-contain"
          />
        )}
        <div>
          <div className="font-semibold text-gray-900">{offer.owner.name}</div>
          <div className="text-sm text-gray-500">
            {offer.slices.length === 1 ? 'One-way' : 'Round-trip'}
          </div>
        </div>
      </div>

      {/* Flight details for each slice */}
      {offer.slices?.map((slice, index) => (
        <div key={slice.id} className={`${index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            {/* Route */}
            <div className="flex items-center gap-4 flex-1">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {safeFormatDate(getDepartureTime(slice), 'HH:mm')}
                </div>
                <div className="text-sm text-gray-600">{slice.origin.iata_code}</div>
              </div>

              <div className="flex-1 px-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(slice.duration)}
                </div>
                <div className="relative">
                  <div className="border-t-2 border-gray-300 relative">
                    <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 bg-white" />
                  </div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-1">
                  {getStopsText(slice.segments)}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {safeFormatDate(getArrivalTime(slice), 'HH:mm')}
                </div>
                <div className="text-sm text-gray-600">{slice.destination.iata_code}</div>
              </div>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-xs text-gray-500 mt-2">
            {slice.origin.city_name || slice.origin.name} → {slice.destination.city_name || slice.destination.name}
          </div>
        </div>
      ))}

      {/* Price and Select Button */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div>
          <div className="text-sm text-gray-500">Total Price</div>
          <div className="text-3xl font-bold text-primary-600">
            {currency} ${displayPrice}
          </div>
          <div className="text-xs text-gray-500">includes all fees</div>
        </div>
        <Link
          href={bookingUrl}
          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Select Flight
        </Link>
      </div>
    </div>
  );
}
