'use client';

import { useState } from 'react';
import { MapPin, DollarSign, Calendar } from 'lucide-react';

interface PriceAlertFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Popular routes from Australian airports
const AUSTRALIAN_AIRPORTS = [
  { code: 'SYD', city: 'Sydney' },
  { code: 'MEL', city: 'Melbourne' },
  { code: 'BNE', city: 'Brisbane' },
  { code: 'PER', city: 'Perth' },
  { code: 'ADL', city: 'Adelaide' },
];

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
  { code: 'NRT', city: 'Tokyo' },
];

export default function PriceAlertForm({ onSuccess, onCancel }: PriceAlertFormProps) {
  const [origin, setOrigin] = useState('SYD');
  const [destination, setDestination] = useState('DPS');
  const [targetPrice, setTargetPrice] = useState('');
  const [departureDateFrom, setDepartureDateFrom] = useState('');
  const [departureDateTo, setDepartureDateTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          target_price: parseFloat(targetPrice),
          departure_date_from: departureDateFrom || null,
          departure_date_to: departureDateTo || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to create price alert');
      }
    } catch (err: any) {
      console.error('Error creating price alert:', err);
      setError('Failed to create price alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Price Alert</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            From
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            {AUSTRALIAN_AIRPORTS.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline-block w-4 h-4 mr-1" />
            To
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            {POPULAR_DESTINATIONS.map((airport) => (
              <option key={airport.code} value={airport.code}>
                {airport.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <DollarSign className="inline-block w-4 h-4 mr-1" />
          Target Price (USD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="500"
            min="1"
            step="0.01"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          You'll be notified when the price drops below this amount
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Departure From (Optional)
          </label>
          <input
            type="date"
            value={departureDateFrom}
            onChange={(e) => setDepartureDateFrom(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            Departure To (Optional)
          </label>
          <input
            type="date"
            value={departureDateTo}
            onChange={(e) => setDepartureDateTo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min={departureDateFrom || undefined}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
