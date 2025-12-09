'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FlightCard from '@/components/FlightCard';
import FlightSearch from '@/components/FlightSearch';
import { DuffelOffer } from '@/types';
import { ArrowUpDown, Filter } from 'lucide-react';

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [offers, setOffers] = useState<DuffelOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  useEffect(() => {
    searchFlights();
  }, [searchParams]);

  const searchFlights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: searchParams.get('origin'),
          destination: searchParams.get('destination'),
          departureDate: searchParams.get('departureDate'),
          returnDate: searchParams.get('returnDate'),
          adults: searchParams.get('adults'),
          children: searchParams.get('children'),
          infants: searchParams.get('infants'),
          cabinClass: searchParams.get('cabinClass'),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setOffers(data.offers);
        // Cache offers in localStorage for booking page
        localStorage.setItem('flightOffers', JSON.stringify(data.offers));
      } else {
        setError(data.error || 'Failed to search flights');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while searching flights');
    } finally {
      setLoading(false);
    }
  };

  const sortedOffers = [...offers].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return parseFloat(a.display_price || a.total_amount) - parseFloat(b.display_price || b.total_amount);
      case 'duration':
        return a.slices[0].duration.localeCompare(b.slices[0].duration);
      case 'departure':
        return new Date(a.slices[0].departure_time).getTime() - new Date(b.slices[0].departure_time).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Flights</h1>
          <FlightSearch compact />
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600">Searching for the best flights...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-semibold mb-2">Error</p>
            <p className="text-red-600">{error}</p>
            <button
              onClick={searchFlights}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Results header with sort */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {offers.length} {offers.length === 1 ? 'Flight' : 'Flights'} Found
                </h2>
                <p className="text-gray-600">
                  {searchParams.get('origin')} → {searchParams.get('destination')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="price">Sort by Price</option>
                    <option value="duration">Sort by Duration</option>
                    <option value="departure">Sort by Departure</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Flight cards */}
            {sortedOffers.length > 0 ? (
              <div className="space-y-4">
                {sortedOffers.map((offer) => (
                  <FlightCard
                    key={offer.id}
                    offer={offer}
                    searchParams={{
                      adults: searchParams.get('adults') || '1',
                      children: searchParams.get('children') || '0',
                      infants: searchParams.get('infants') || '0',
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No flights found for your search</p>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
