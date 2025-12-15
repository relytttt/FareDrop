'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, Globe } from 'lucide-react';
import DealGrid from '@/components/DealGrid';
import EmailCapture from '@/components/EmailCapture';
import AlertModal from '@/components/AlertModal';
import FlightSearch from '@/components/FlightSearch';
import { Deal } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/flights/deals');
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

  return (
    <div>
      {/* Hero Section with Flight Search */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Next Adventure at{' '}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Unbeatable Prices
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Search and book flights directly, or browse our curated deals. Save up to 90% on your next trip!
            </p>
          </div>

          {/* Flight Search Form */}
          <div className="max-w-6xl mx-auto mb-8">
            <FlightSearch />
          </div>

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
              🔥 Featured Flight Deals
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked deals updated daily - or search above to book any flight
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Loading amazing deals...</p>
            </div>
          ) : (
            <>
              {/* Top 6 Deals in Tile View */}
              <DealGrid deals={deals.slice(0, 6)} viewMode="tile" />
              
              {deals.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    href="/deals"
                    className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    View All Deals →
                  </Link>
                </div>
              )}
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
