import { notFound } from 'next/navigation';
import { Plane, Calendar, MapPin, TrendingDown, ExternalLink } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';
import TripUpsells from '@/components/TripUpsells';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Fetch deal from database
async function getDeal(id: string) {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export default async function DealDetailsPage({ params }: { params: { id: string } }) {
  const deal = await getDeal(params.id);

  if (!deal) {
    notFound();
  }

  const departureDate = new Date(deal.departure_date);
  const returnDate = deal.return_date ? new Date(deal.return_date) : null;
  const expiresDate = new Date(deal.expires_at);
  const daysUntilExpiry = Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const tripDuration = returnDate
    ? Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          ← Back to all deals
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          {deal.deal_score >= 80 && (
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">🔥 Hot Deal Alert!</span>
                <span className="text-lg">Score: {deal.deal_score}/100</span>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Route */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-2">
                <div className="text-center flex-1">
                  <div className="text-4xl font-bold text-gray-800">{deal.origin}</div>
                  <div className="text-lg text-gray-600 mt-1">{deal.origin_city}</div>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <div className="border-t-2 border-dashed border-gray-300 flex-1"></div>
                  <Plane className="mx-4 text-primary-500" size={32} />
                  <div className="border-t-2 border-dashed border-gray-300 flex-1"></div>
                </div>

                <div className="text-center flex-1">
                  <div className="text-4xl font-bold text-gray-800">{deal.destination}</div>
                  <div className="text-lg text-gray-600 mt-1">{deal.destination_city}</div>
                </div>
              </div>
              {deal.destination_region && (
                <div className="text-center">
                  <span className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                    {deal.destination_region}
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-8 text-center">
              <PriceDisplay price={deal.price} originalPrice={deal.original_price} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4 text-primary-600">
                  <Plane size={24} />
                  <h3 className="font-semibold text-gray-900">Flight Details</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-medium">Airline:</span> {deal.airline}
                  </div>
                  <div>
                    <span className="font-medium">Trip Type:</span>{' '}
                    {deal.trip_type === 'round-trip' ? 'Round Trip' : 'One Way'}
                  </div>
                  {tripDuration && (
                    <div>
                      <span className="font-medium">Duration:</span> {tripDuration} days
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4 text-primary-600">
                  <Calendar size={24} />
                  <h3 className="font-semibold text-gray-900">Travel Dates</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <span className="font-medium">Departure:</span>{' '}
                    {departureDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {returnDate && (
                    <div>
                      <span className="font-medium">Return:</span>{' '}
                      {returnDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expiry Warning */}
            {daysUntilExpiry <= 3 && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center gap-3">
                  <TrendingDown className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-semibold text-yellow-800">Deal Expires Soon!</p>
                    <p className="text-sm text-yellow-700">
                      This deal expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. Book now to secure this price!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <a
              href={deal.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              Book This Deal
              <ExternalLink size={20} />
            </a>

            <p className="text-center text-sm text-gray-500 mt-4">
              You'll be redirected to our partner's site to complete your booking
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Travel Tips</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• Book soon - prices can change at any time</li>
            <li>• Check visa requirements for your destination</li>
            <li>• Consider travel insurance for added protection</li>
            <li>• Arrive at the airport 2-3 hours before international flights</li>
            <li>• Sign up for deal alerts to never miss savings like these</li>
          </ul>
        </div>

        {/* Trip Upsells Section */}
        <div className="mt-8">
          <TripUpsells 
            destination={deal.destination}
            destinationCity={deal.destination_city}
            departureDate={deal.departure_date}
            returnDate={deal.return_date || undefined}
          />
        </div>
      </div>
    </div>
  );
}
