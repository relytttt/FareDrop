import { Deal } from '@/types';
import { Plane, Calendar, TrendingDown } from 'lucide-react';
import Link from 'next/link';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const discountPercent = deal.original_price
    ? Math.round(((deal.original_price - deal.price) / deal.original_price) * 100)
    : 0;

  const departureDate = new Date(deal.departure_date);
  const expiresDate = new Date(deal.expires_at);
  const daysUntilExpiry = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

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
            <span className="text-4xl font-bold text-accent-600">${deal.price}</span>
            {deal.original_price && (
              <>
                <span className="text-xl text-gray-400 line-through">${deal.original_price}</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {discountPercent}% OFF
                </span>
              </>
            )}
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
              {departureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {deal.return_date && (
                <> - {new Date(deal.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
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
          <a
            href={deal.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 text-center"
          >
            Book Now
          </a>
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
