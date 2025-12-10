'use client';

import { useState } from 'react';
import { CheckCircle, Clock, Bell, Star, TrendingUp, Zap } from 'lucide-react';

interface PremiumUpgradeProps {
  priceId?: string;
  userEmail?: string;
  userId?: string;
}

// Pricing constants - update these when prices change
const PRICING = {
  MONTHLY_PRICE: 9.99,
  ANNUAL_PRICE: 99.99,
  ANNUAL_SAVINGS_PERCENT: 17,
} as const;

export default function PremiumUpgrade({ priceId, userEmail, userId }: PremiumUpgradeProps) {
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const benefits = [
    {
      icon: Clock,
      title: 'Early Access to Deals',
      description: '6 hours before free users',
    },
    {
      icon: Bell,
      title: 'Price Drop Alerts',
      description: 'Get notified instantly when prices drop',
    },
    {
      icon: Zap,
      title: 'No Ads',
      description: 'Ad-free browsing experience',
    },
    {
      icon: Star,
      title: 'Priority Support',
      description: '24/7 priority customer support',
    },
    {
      icon: TrendingUp,
      title: 'Exclusive Error Fares',
      description: 'Access to mistake fares and flash deals',
    },
  ];

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      const activePriceId = priceId || process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID;
      
      if (!activePriceId) {
        alert('Premium price not configured. Please contact support.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail || '',
          priceId: activePriceId,
          userId: userId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      alert(error.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl shadow-lg p-8 border-2 border-primary-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
          <Star className="w-4 h-4" />
          Premium
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
        <p className="text-gray-600">Get the best deals before anyone else</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              billingPeriod === 'annual'
                ? 'bg-primary-500 text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-accent-500 text-white px-2 py-0.5 rounded">
              Save {PRICING.ANNUAL_SAVINGS_PERCENT}%
            </span>
          </button>
        </div>
      </div>

      {/* Price Display */}
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-gray-900">
          ${billingPeriod === 'monthly' ? PRICING.MONTHLY_PRICE.toFixed(2) : PRICING.ANNUAL_PRICE.toFixed(2)}
        </div>
        <div className="text-gray-600 mt-2">
          per {billingPeriod === 'monthly' ? 'month' : 'year'}
        </div>
        {billingPeriod === 'annual' && (
          <div className="text-sm text-accent-600 font-medium mt-1">
            Just ${(PRICING.ANNUAL_PRICE / 12).toFixed(2)}/month
          </div>
        )}
      </div>

      {/* Benefits List */}
      <div className="space-y-4 mb-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <benefit.icon className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Upgrade to Premium'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Cancel anytime. No questions asked.
      </p>
    </div>
  );
}
