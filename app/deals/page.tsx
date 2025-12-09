'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import DealGrid from '@/components/DealGrid';
import SearchFilters from '@/components/SearchFilters';
import FeaturedDeals from '@/components/FeaturedDeals';
import TripUpsells from '@/components/TripUpsells';
import { Deal, SearchFilters as SearchFiltersType, ViewMode } from '@/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');

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

    if (filters.departureCity && filters.departureCity !== 'All Cities') {
      filtered = filtered.filter((deal) =>
        deal.origin_city?.includes(filters.departureCity!.split('(')[0].trim())
      );
    }

    if (filters.destinationRegion && filters.destinationRegion !== 'All Regions') {
      filtered = filtered.filter((deal) => deal.destination_region === filters.destinationRegion);
    }

    if (filters.destinationCity) {
      filtered = filtered.filter((deal) => deal.destination_city === filters.destinationCity);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((deal) => deal.price <= filters.maxPrice!);
    }

    if (filters.minDiscount && filters.minDiscount > 0) {
      filtered = filtered.filter((deal) => {
        if (!deal.original_price) return false;
        const discount = ((deal.original_price - deal.price) / deal.original_price) * 100;
        return discount >= filters.minDiscount!;
      });
    }

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Flight Deals
          </h1>
          <p className="text-lg text-gray-600">
            Browse {deals.length} amazing flight deals from around the world
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
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <>
            {/* Featured Top 3 Deals */}
            <FeaturedDeals deals={filteredDeals} />
            
            {/* All Deals with selected view mode */}
            <DealGrid deals={filteredDeals} emptyMessage="No deals match your filters" viewMode={viewMode} />
            
            {/* Trip Upsells Section */}
            <div className="mt-12">
              <TripUpsells 
                destination={filters.destinationCity && filteredDeals.length > 0 ? filteredDeals[0]?.destination : undefined}
                destinationCity={filters.destinationCity || (filteredDeals.length > 0 ? filteredDeals[0]?.destination_city : undefined)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
