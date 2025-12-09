'use client';

import { useState } from 'react';
import { Hotel, Car, Shield, Smartphone, MapPin } from 'lucide-react';

export default function TripExtrasPage() {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  const handleHotelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = `https://search.hotellook.com/?marker=689762${destination ? `&destination=${destination}` : ''}${checkIn ? `&checkIn=${checkIn}` : ''}${checkOut ? `&checkOut=${checkOut}` : ''}`;
    window.open(url, '_blank');
  };

  const handleCarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = destination
      ? `https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2FSearchResults.do%3FpickupLocation%3D${destination}`
      : 'https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2F';
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Complete Your Travel Experience
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for the perfect trip - hotels, car rentals, insurance, and staying connected
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Travel Services</h2>
          
          <form onSubmit={handleHotelSearch} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="City or airport code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
                >
                  Search Hotels
                </button>
              </div>
            </div>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={handleCarSearch}
              className="w-full md:w-auto bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-all duration-200"
            >
              Search Car Rentals
            </button>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hotels */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
              <Hotel className="text-white mb-3" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Hotels & Accommodation</h2>
              <p className="text-white/90">Find the perfect place to stay</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span className="text-gray-700">Compare prices from hundreds of sites</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span className="text-gray-700">From budget hostels to luxury resorts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span className="text-gray-700">Free cancellation on most properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-500 mt-1">✓</span>
                  <span className="text-gray-700">Real reviews from verified guests</span>
                </li>
              </ul>
              <a
                href="https://search.hotellook.com/?marker=689762"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-200"
              >
                Search Hotels
              </a>
            </div>
          </div>

          {/* Car Rentals */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 p-6">
              <Car className="text-white mb-3" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Car Rentals</h2>
              <p className="text-white/90">Explore at your own pace</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-1">✓</span>
                  <span className="text-gray-700">Compare deals from top rental companies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-1">✓</span>
                  <span className="text-gray-700">Economy to luxury vehicles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-1">✓</span>
                  <span className="text-gray-700">No hidden fees or charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-500 mt-1">✓</span>
                  <span className="text-gray-700">24/7 customer support</span>
                </li>
              </ul>
              <a
                href="https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2F"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-600 transition-all duration-200"
              >
                Search Car Rentals
              </a>
            </div>
          </div>

          {/* Travel Insurance */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <Shield className="text-white mb-3" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Travel Insurance</h2>
              <p className="text-white/90">Protect your trip and yourself</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Coverage from $42/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Medical emergencies and evacuation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Trip cancellation and interruption</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-gray-700">Perfect for digital nomads</span>
                </li>
              </ul>
              <a
                href="https://safetywing.com/nomad-insurance?referenceID=faredrop"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200"
              >
                Get Covered
              </a>
            </div>
          </div>

          {/* eSIM Data */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <Smartphone className="text-white mb-3" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">eSIM Data Plans</h2>
              <p className="text-white/90">Stay connected worldwide</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span className="text-gray-700">Instant activation, no physical SIM needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span className="text-gray-700">Coverage in 200+ countries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span className="text-gray-700">Affordable data packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span className="text-gray-700">Keep your home number active</span>
                </li>
              </ul>
              <a
                href="https://www.airalo.com/?ref=faredrop"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all duration-200"
              >
                Get eSIM
              </a>
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Why Book Through FareDrop Partners?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-sm text-gray-600">
                We only partner with trusted providers offering competitive rates
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Trusted Partners</h3>
              <p className="text-sm text-gray-600">
                All our partners are vetted and reliable travel service providers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Simple, fast booking process with instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
