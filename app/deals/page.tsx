'use client';

import { useState, useEffect } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import DealGrid from '@/components/DealGrid';
import SearchFilters from '@/components/SearchFilters';
import FeaturedDeals from '@/components/FeaturedDeals';
import TripUpsells from '@/components/TripUpsells';
import { Deal, SearchFilters as SearchFiltersType, ViewMode } from '@/types';
import { isDateInRange } from '@/lib/utils/dateUtils';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Date filter state
  const [departureDate, setDepartureDate] = useState<string>('any');
  const [returnDate, setReturnDate] = useState<string>('any');
  const [customDepartureDate, setCustomDepartureDate] = useState<string>('');
  const [customReturnDate, setCustomReturnDate] = useState<string>('');

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, filters, departureDate, returnDate, customDepartureDate, customReturnDate]);

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

    // Date filter for departure
    if (departureDate !== 'any' && departureDate !== 'flexible') {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (departureDate === 'this-month') {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        filtered = filtered.filter(deal => 
          isDateInRange(deal.departure_date, now, endOfMonth)
        );
      } else if (departureDate === 'next-month') {
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        filtered = filtered.filter(deal => 
          isDateInRange(deal.departure_date, startOfNextMonth, endOfNextMonth)
        );
      } else if (departureDate === 'custom' && customDepartureDate) {
        const customDate = new Date(customDepartureDate);
        const flexibleStart = new Date(customDate);
        flexibleStart.setDate(customDate.getDate() - 3);
        const flexibleEnd = new Date(customDate);
        flexibleEnd.setDate(customDate.getDate() + 3);
        filtered = filtered.filter(deal => 
          isDateInRange(deal.departure_date, flexibleStart, flexibleEnd)
        );
      }
    }

    // Date filter for return (based on trip duration)
    if (returnDate !== 'any') {
      if (returnDate === '1-week') {
        filtered = filtered.filter(deal => {
          if (!deal.return_date || !deal.departure_date) return false;
          const departure = new Date(deal.departure_date);
          const returnD = new Date(deal.return_date);
          const duration = Math.ceil((returnD.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));
          return duration >= 5 && duration <= 9; // ~1 week (5-9 days)
        });
      } else if (returnDate === '2-weeks') {
        filtered = filtered.filter(deal => {
          if (!deal.return_date || !deal.departure_date) return false;
          const departure = new Date(deal.departure_date);
          const returnD = new Date(deal.return_date);
          const duration = Math.ceil((returnD.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24));
          return duration >= 12 && duration <= 16; // ~2 weeks (12-16 days)
        });
      } else if (returnDate === 'custom' && customReturnDate) {
        const customReturn = new Date(customReturnDate);
        const flexibleStart = new Date(customReturn);
        flexibleStart.setDate(customReturn.getDate() - 2);
        const flexibleEnd = new Date(customReturn);
        flexibleEnd.setDate(customReturn.getDate() + 2);
        filtered = filtered.filter(deal => 
          isDateInRange(deal.return_date, flexibleStart, flexibleEnd)
        );
      }
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

        {/* Date Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Travel Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Departure</label>
              <select 
                value={departureDate}
                onChange={(e) => {
                  setDepartureDate(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomDepartureDate('');
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="any">Any Date</option>
                <option value="flexible">Flexible (+/- 3 days)</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
                <option value="custom">Choose Date...</option>
              </select>
              {departureDate === 'custom' && (
                <input 
                  type="date" 
                  value={customDepartureDate}
                  onChange={(e) => setCustomDepartureDate(e.target.value)}
                  className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              )}
            </div>

            {/* Return Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
              <select 
                value={returnDate}
                onChange={(e) => {
                  setReturnDate(e.target.value);
                  if (e.target.value !== 'custom') {
                    setCustomReturnDate('');
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="any">Any Date</option>
                <option value="1-week">~1 Week Trip</option>
                <option value="2-weeks">~2 Weeks Trip</option>
                <option value="custom">Choose Date...</option>
              </select>
              {returnDate === 'custom' && (
                <input 
                  type="date" 
                  value={customReturnDate}
                  onChange={(e) => setCustomReturnDate(e.target.value)}
                  className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={customDepartureDate || new Date().toISOString().split('T')[0]}
                />
              )}
            </div>
          </div>
          {(departureDate !== 'any' || returnDate !== 'any') && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Active date filters: {filteredDeals.length} of {deals.length} deals
              </p>
              <button 
                onClick={() => {
                  setDepartureDate('any');
                  setReturnDate('any');
                  setCustomDepartureDate('');
                  setCustomReturnDate('');
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Date Filters
              </button>
            </div>
          )}
        </div>

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
