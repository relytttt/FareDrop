'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Globe, LayoutGrid, List } from 'lucide-react';
import DealGrid from '@/components/DealGrid';
import SearchFilters from '@/components/SearchFilters';
import EmailCapture from '@/components/EmailCapture';
import AlertModal from '@/components/AlertModal';
import FeaturedDeals from '@/components/FeaturedDeals';
import TripUpsells from '@/components/TripUpsells';
import { Deal, SearchFilters as SearchFiltersType, ViewMode } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [viewMode, setViewMode] = useState<ViewMode>('tile');

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, filters]);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...deals];

    // Filter by departure city
    if (filters.departureCity && filters.departureCity !== 'All Cities') {
      filtered = filtered.filter((deal) =>
        deal.origin_city?.includes(filters.departureCity!.split('(')[0].trim())
      );
    }

    // Filter by destination region
    if (filters.destinationRegion && filters.destinationRegion !== 'All Regions') {
      filtered = filtered.filter((deal) => deal.destination_region === filters.destinationRegion);
    }

    // Filter by destination city
    if (filters.destinationCity) {
      filtered = filtered.filter((deal) => deal.destination_city === filters.destinationCity);
    }

    // Filter by max price
    if (filters.maxPrice) {
      filtered = filtered.filter((deal) => deal.price <= filters.maxPrice!);
    }

    // Filter by min discount
    if (filters.minDiscount && filters.minDiscount > 0) {
      filtered = filtered.filter((deal) => {
        if (!deal.original_price) return false;
        const discount = ((deal.original_price - deal.price) / deal.original_price) * 100;
        return discount >= filters.minDiscount!;
      });
    }

    // Sort
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'discount':
      default:
        filtered.sort((a, b) => {
          const discountA = a.original_price ? ((a.original_price - a.price) / a.original_price) * 100 : 0;
          const discountB = b.original_price ? ((b.original_price - b.price) / b.original_price) * 100 : 0;
          return discountB - discountA;
        });
    }

    setFilteredDeals(filtered);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Next Adventure at{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Unbeatable Prices
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We search thousands of flights daily to bring you the best deals. Save up to 90% on your next trip!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setShowAlertModal(true)}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔔 Get Deal Alerts
              </button>
              <Link
                href="/deals"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold border-2 border-primary-500 hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Browse All Deals
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <Sparkles className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
              <div className="text-gray-600">Active Deals</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <TrendingDown className="w-12 h-12 text-accent-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">Up to 90%</div>
              <div className="text-gray-600">Average Savings</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <Globe className="w-12 h-12 text-primary-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">150+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🔥 Latest Flight Deals
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked deals updated daily
            </p>
          </div>

          <SearchFilters onFilterChange={setFilters} initialFilters={filters} deals={deals} />

          {/* View Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <List size={18} />
              List View
            </button>
            <button 
              onClick={() => setViewMode('tile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'tile' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={18} />
              Tile View
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Loading amazing deals...</p>
            </div>
          ) : (
            <>
              {/* Featured Top 3 Deals */}
              <FeaturedDeals deals={filteredDeals} />
              
              {/* All Deals with selected view mode */}
              <DealGrid deals={filteredDeals.slice(0, 6)} viewMode={viewMode} />
              
              {filteredDeals.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href="/deals"
                    className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    View All {filteredDeals.length} Deals →
                  </Link>
                </div>
              )}

              {/* Trip Upsells Section */}
              <div className="mt-12">
                <TripUpsells 
                  destination={filters.destinationCity ? filteredDeals[0]?.destination : undefined}
                  destinationCity={filters.destinationCity || (filteredDeals.length > 0 ? filteredDeals[0]?.destination_city : undefined)}
                />
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <EmailCapture />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How FareDrop Works
            </h2>
            <p className="text-lg text-gray-600">
              Your journey to incredible savings starts here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                We Search
              </h3>
              <p className="text-gray-600">
                Our algorithms scan thousands of flights across multiple airlines and booking sites 24/7
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You Get Alerts
              </h3>
              <p className="text-gray-600">
                Receive instant notifications when we find deals matching your preferences
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Book & Save
              </h3>
              <p className="text-gray-600">
                Click through to book directly with airlines or travel partners at the best price
              </p>
            </div>
          </div>
        </div>
      </section>

      <AlertModal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)} />
    </div>
  );
}
