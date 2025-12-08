'use client';

import { useState } from 'react';
import { Bell, Mail, Loader2, Check } from 'lucide-react';
import { DEPARTURE_CITIES, REGIONS } from '@/types';

export default function AlertsPage() {
  const [formData, setFormData] = useState({
    email: '',
    departureCity: '',
    destinations: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
        setMessage('Alert preferences saved! Check your email to confirm.');
        setFormData({ email: '', departureCity: '', destinations: [] });
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 p-4 rounded-full mb-4">
            <Bell className="text-white" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Set Up Deal Alerts
          </h1>
          <p className="text-lg text-gray-600">
            Get notified instantly when we find amazing deals matching your preferences
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={18} className="text-primary-500" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
              />
              <p className="text-sm text-gray-500 mt-1">We'll send deal alerts to this email</p>
            </div>

            {/* Departure City */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Preferred Departure City
              </label>
              <select
                value={formData.departureCity}
                onChange={(e) => setFormData({ ...formData, departureCity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-lg"
              >
                <option value="">Any city</option>
                {DEPARTURE_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Leave blank to receive deals from all cities
              </p>
            </div>

            {/* Destination Regions */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Interested Regions (select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {REGIONS.filter((r) => r !== 'All Regions').map((region) => (
                  <label
                    key={region}
                    className="flex items-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.destinations.includes(region)}
                      onChange={() => handleDestinationToggle(region)}
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Leave blank to receive deals for all destinations
              </p>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-green-800 font-medium">Success!</p>
                  <p className="text-green-700 text-sm">{message}</p>
                </div>
              </div>
            )}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Setting Up Alerts...</span>
                </>
              ) : (
                <>
                  <Bell size={24} />
                  <span>Activate Alerts</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Instant Alerts</h3>
            <p className="text-sm text-gray-600">Get notified within minutes of deals dropping</p>
          </div>
          <div className="text-center">
            <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Personalized</h3>
            <p className="text-sm text-gray-600">Only deals that match your preferences</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🚫</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">No Spam</h3>
            <p className="text-sm text-gray-600">Quality over quantity - only the best deals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
