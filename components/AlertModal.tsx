'use client';

import { useState } from 'react';
import { X, Bell, Loader2 } from 'lucide-react';
import { DEPARTURE_CITIES, REGIONS } from '@/types';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
}

export default function AlertModal({ isOpen, onClose, dealId }: AlertModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    departureCity: '',
    destinations: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Alert set! We\'ll notify you of similar deals.');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationToggle = (region: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(region)
        ? prev.destinations.filter((d) => d !== region)
        : [...prev.destinations, region],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Bell className="text-primary-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Set Deal Alert</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-6">
            Get notified when we find deals matching your preferences.
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Departure City */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Departure City
            </label>
            <select
              value={formData.departureCity}
              onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="">Any city</option>
              {DEPARTURE_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Regions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interested Regions (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REGIONS.filter((r) => r !== 'All Regions').map((region) => (
                <label
                  key={region}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.destinations.includes(region)}
                    onChange={() => handleDestinationToggle(region)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              {message}
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Setting Alert...</span>
              </>
            ) : (
              <>
                <Bell size={20} />
                <span>Set Alert</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
