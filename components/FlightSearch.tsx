'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Plane, Users, Calendar, MapPin, Bookmark } from 'lucide-react';
import { FlightSearchFormData } from '@/types';
import { createClientComponentClient } from '@/lib/supabase';

// Australian airports
const AUSTRALIAN_AIRPORTS = [
  { code: 'SYD', city: 'Sydney' },
  { code: 'MEL', city: 'Melbourne' },
  { code: 'BNE', city: 'Brisbane' },
  { code: 'PER', city: 'Perth' },
  { code: 'ADL', city: 'Adelaide' },
  { code: 'OOL', city: 'Gold Coast' },
  { code: 'CNS', city: 'Cairns' },
  { code: 'HBA', city: 'Hobart' },
  { code: 'DRW', city: 'Darwin' },
  { code: 'CBR', city: 'Canberra' },
];

// Popular destinations
const POPULAR_DESTINATIONS = [
  { code: 'DPS', city: 'Bali (Denpasar)' },
  { code: 'SIN', city: 'Singapore' },
  { code: 'BKK', city: 'Bangkok' },
  { code: 'NAN', city: 'Nadi (Fiji)' },
  { code: 'AKL', city: 'Auckland' },
  { code: 'LAX', city: 'Los Angeles' },
  { code: 'LHR', city: 'London' },
  { code: 'DXB', city: 'Dubai' },
  { code: 'HKT', city: 'Phuket' },
  { code: 'HNL', city: 'Honolulu' },
  { code: 'NRT', city: 'Tokyo' },
  { code: 'CDG', city: 'Paris' },
];

interface FlightSearchProps {
  onSearch?: (data: FlightSearchFormData) => void;
  initialData?: Partial<FlightSearchFormData>;
  compact?: boolean;
}

export default function FlightSearch({ onSearch, initialData, compact = false }: FlightSearchProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [formData, setFormData] = useState<FlightSearchFormData>({
    origin: initialData?.origin || 'SYD',
    destination: initialData?.destination || 'DPS',
    departureDate: initialData?.departureDate || null,
    returnDate: initialData?.returnDate || null,
    passengers: initialData?.passengers || {
      adults: 1,
      children: 0,
      infants: 0,
    },
    cabinClass: initialData?.cabinClass || 'economy',
  });

  const [showPassengers, setShowPassengers] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flexibleDates, setFlexibleDates] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const totalPassengers = formData.passengers.adults + formData.passengers.children + formData.passengers.infants;

  const handleSaveSearch = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save searches');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: formData.origin,
          destination: formData.destination,
          departure_date_from: formData.departureDate?.toISOString().split('T')[0],
          return_date_from: formData.returnDate?.toISOString().split('T')[0],
          passengers_adults: formData.passengers.adults,
          passengers_children: formData.passengers.children,
          passengers_infants: formData.passengers.infants,
          cabin_class: formData.cabinClass,
        }),
      });

      if (response.ok) {
        alert('Search saved successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save search');
      }
    } catch (err) {
      console.error('Error saving search:', err);
      alert('Failed to save search');
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.departureDate) {
      alert('Please select a departure date');
      return;
    }

    if (onSearch) {
      onSearch(formData);
    } else {
      // Navigate to search results page
      const params = new URLSearchParams({
        origin: formData.origin,
        destination: formData.destination,
        departureDate: formData.departureDate.toISOString().split('T')[0],
        ...(formData.returnDate && { returnDate: formData.returnDate.toISOString().split('T')[0] }),
        adults: formData.passengers.adults.toString(),
        children: formData.passengers.children.toString(),
        infants: formData.passengers.infants.toString(),
        cabinClass: formData.cabinClass,
        ...(flexibleDates && { flexibleDates: 'true' }),
      });
      router.push(`/flights?${params.toString()}`);
    }
  };

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [type]: Math.max(0, prev.passengers[type] + (increment ? 1 : -1)),
      },
    }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${compact ? 'p-4' : 'p-6'}`}>
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Origin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              From
            </label>
            <select
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {AUSTRALIAN_AIRPORTS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city} ({airport.code})
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              To
            </label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {POPULAR_DESTINATIONS.map((airport) => (
                <option key={airport.code} value={airport.code}>
                  {airport.city}
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-1" />
              Departure
            </label>
            <DatePicker
              selected={formData.departureDate}
              onChange={(date) => setFormData({ ...formData, departureDate: date })}
              minDate={new Date()}
              dateFormat="dd MMM yyyy"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholderText="Select date"
            />
          </div>

          {/* Return Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline-block w-4 h-4 mr-1" />
              Return (optional)
            </label>
            <DatePicker
              selected={formData.returnDate}
              onChange={(date) => setFormData({ ...formData, returnDate: date })}
              minDate={formData.departureDate || new Date()}
              dateFormat="dd MMM yyyy"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholderText="One-way"
              isClearable
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Flexible Dates Toggle */}
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flexibleDates}
                onChange={(e) => setFlexibleDates(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                Flexible dates (±3 days)
              </span>
            </label>
            <div className="ml-2 group relative">
              <div className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center cursor-help">
                ?
              </div>
              <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                Search flights 3 days before and after your selected dates for more options
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline-block w-4 h-4 mr-1" />
              Passengers
            </label>
            <button
              type="button"
              onClick={() => setShowPassengers(!showPassengers)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {totalPassengers} {totalPassengers === 1 ? 'Passenger' : 'Passengers'}
            </button>

            {showPassengers && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                {/* Adults */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-gray-500">12+ years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('adults', false)}
                      disabled={formData.passengers.adults <= 1}
                      className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData.passengers.adults}</span>
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('adults', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">2-11 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('children', false)}
                      disabled={formData.passengers.children <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData.passengers.children}</span>
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('children', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-gray-500">0-2 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('infants', false)}
                      disabled={formData.passengers.infants <= 0}
                      className="w-8 h-8 rounded-full border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData.passengers.infants}</span>
                    <button
                      type="button"
                      onClick={() => updatePassengerCount('infants', true)}
                      className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassengers(false)}
                  className="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Cabin Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Plane className="inline-block w-4 h-4 mr-1" />
              Cabin Class
            </label>
            <select
              value={formData.cabinClass}
              onChange={(e) => setFormData({ ...formData, cabinClass: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="economy">Economy</option>
              <option value="premium_economy">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>

          {/* Search and Save Buttons */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Search Flights
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSaveSearch}
                disabled={saving}
                className="p-3 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
                title="Save this search"
              >
                <Bookmark size={24} className={saving ? 'animate-pulse' : ''} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
