'use client';

import { useState } from 'react';
import { Search, MapPin, Globe, SortAsc } from 'lucide-react';
import { SearchFilters as SearchFiltersType, DEPARTURE_CITIES, REGIONS, Deal } from '@/types';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFiltersType) => void;
  initialFilters?: SearchFiltersType;
  deals?: Deal[];
}

export default function SearchFilters({ onFilterChange, initialFilters = {}, deals = [] }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFiltersType>(initialFilters);

  // Extract unique destination cities from deals
  const destinationCities = Array.from(
    new Set(
      deals
        .map((deal) => deal.destination_city)
        .filter((city): city is string => !!city)
    )
  ).sort();

  const handleFilterChange = (key: keyof SearchFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: 'price' | 'date' | 'discount') => {
    handleFilterChange('sortBy', sortBy);
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFiltersType = {};
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-primary-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Filter Deals</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Departure City Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="text-primary-500" />
            Departure City
          </label>
          <select
            value={filters.departureCity || ''}
            onChange={(e) => handleFilterChange('departureCity', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {DEPARTURE_CITIES.map((city) => (
              <option key={city} value={city === 'All Cities' ? '' : city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Region Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Globe size={16} className="text-primary-500" />
            Destination Region
          </label>
          <select
            value={filters.destinationRegion || ''}
            onChange={(e) => handleFilterChange('destinationRegion', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            {REGIONS.map((region) => (
              <option key={region} value={region === 'All Regions' ? '' : region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Destination City Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MapPin size={16} className="text-accent-500" />
            Destination City
          </label>
          <select
            value={filters.destinationCity || ''}
            onChange={(e) => handleFilterChange('destinationCity', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">All Destinations</option>
            {destinationCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sort By - Now in separate row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Sort By */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <SortAsc size={16} className="text-primary-500" />
            Sort By
          </label>
          <select
            value={filters.sortBy || 'discount'}
            onChange={(e) => handleSortChange(e.target.value as 'price' | 'date' | 'discount')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="discount">Best Discount</option>
            <option value="price">Lowest Price</option>
            <option value="date">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Max Price ($)
          </label>
          <input
            type="number"
            placeholder="Any price"
            value={filters.maxPrice || ''}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Min Discount (%)
          </label>
          <input
            type="number"
            placeholder="Any discount"
            value={filters.minDiscount || ''}
            onChange={(e) => handleFilterChange('minDiscount', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      {Object.keys(filters).length > 0 && (
        <div className="mt-4">
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
