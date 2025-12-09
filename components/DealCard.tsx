import { Deal } from '@/types';
import { Plane, Calendar, TrendingDown, Moon } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatShortDate, calculateTripDuration } from '@/lib/utils/dateUtils';

interface DealCardProps {
  deal: Deal;
  variant?: 'default' | 'compact';
}

export default function DealCard({ deal, variant = 'default' }: DealCardProps) {
  const discountPercent = deal.original_price
    ? Math.round(((deal.original_price - deal.price) / deal.original_price) * 100)
    : 0;

  const formattedDepartureDate = formatShortDate(deal.departure_date);
  const formattedReturnDate = formatShortDate(deal.return_date);
  const tripDuration = calculateTripDuration(deal.departure_date, deal.return_date);
  
  const expiresDate = new Date(deal.expires_at);
  const daysUntilExpiry = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Build flights page URL with search params
  const flightsUrl = `/flights?origin=${deal.origin}&destination=${deal.destination}&departureDate=${deal.departure_date}&returnDate=${deal.return_date || ''}&adults=1&children=0&infants=0&cabinClass=economy`;

  // Compact list view variant
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Route Info - Left Side */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{deal.origin}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[80px]">{deal.origin_city}</div>
                </div>
                
                <Plane className="text-primary-500 flex-shrink-0" size={16} />
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">{deal.destination}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[80px]">{deal.destination_city}</div>
                </div>
              </div>

              {/* Details with dates and trip info */}
              <div className="flex items-center gap-3 text-sm text-gray-600 flex-shrink-0">
                <span className="font-medium">{deal.airline}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-primary-500" />
                  {formattedDepartureDate} - {formattedReturnDate}
                </span>
                {tripDuration && (
                  <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded font-medium">
                    <Moon size={14} />
                    {tripDuration} night{tripDuration !== 1 ? 's' : ''}
                  </span>
                )}
                {deal.trip_type && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {deal.trip_type === 'round-trip' ? 'Round-trip' : 'One-way'}
                  </span>
                )}
              </div>
            </div>

            {/* Price and Actions - Right Side */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-accent-600">${Math.round(deal.price)}</span>
                </div>
                <span className="text-sm text-gray-500">per person</span>
              </div>

              <div className="flex gap-2">
                <Link
                  href={flightsUrl}
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 text-sm"
                >
                  View Flights →
                </Link>
                <Link
                  href={`/deals/${deal.id}`}
                  className="px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 text-sm"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default tile view variant

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Deal Score Badge */}
      {deal.deal_score >= 80 && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 text-sm font-semibold flex items-center justify-between">
          <span>🔥 Hot Deal</span>
          <span>Score: {deal.deal_score}/100</span>
        </div>
      )}

      <div className="p-6">
        {/* Route Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{deal.origin}</div>
                <div className="text-xs text-gray-500">{deal.origin_city}</div>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="border-t-2 border-dashed border-gray-300 flex-1"></div>
                <Plane className="mx-2 text-primary-500" size={20} />
                <div className="border-t-2 border-dashed border-gray-300 flex-1"></div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{deal.destination}</div>
                <div className="text-xs text-gray-500">{deal.destination_city}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-accent-600">${Math.round(deal.price)}</span>
            <span className="text-sm text-gray-500">per person</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Plane size={16} className="text-primary-500" />
            <span className="font-medium">{deal.airline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary-500" />
            <span>
              {formattedDepartureDate}
              {deal.return_date && (
                <> - {formattedReturnDate}</>
              )}
              {tripDuration && (
                <span className="ml-2 text-blue-700 font-medium">
                  ({tripDuration} night{tripDuration !== 1 ? 's' : ''})
                </span>
              )}
            </span>
          </div>
          {deal.destination_region && (
            <div className="flex items-center gap-2">
              <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                {deal.destination_region}
              </span>
            </div>
          )}
        </div>

        {/* Expiry Warning */}
        {daysUntilExpiry <= 3 && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex items-center gap-2">
            <TrendingDown size={14} />
            <span>Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={flightsUrl}
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 text-center"
          >
            View Flights →
          </Link>
          <Link
            href={`/deals/${deal.id}`}
            className="px-6 py-3 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 text-center"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
