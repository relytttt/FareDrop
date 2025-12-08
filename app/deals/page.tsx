'use client';

import { useState, useEffect } from 'react';
import DealGrid from '@/components/DealGrid';
import SearchFilters from '@/components/SearchFilters';
import { Deal, SearchFilters as SearchFiltersType } from '@/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFiltersType>({});

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

        <SearchFilters onFilterChange={setFilters} initialFilters={filters} />

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <DealGrid deals={filteredDeals} emptyMessage="No deals match your filters" />
        )}
      </div>
    </div>
  );
}
