'use client';

import { CheckCircle, X } from 'lucide-react';
import PremiumUpgrade from '@/components/PremiumUpgrade';

export default function PricingPage() {
  const features = [
    { name: 'Access to all flight deals', free: true, premium: true },
    { name: 'Email alerts for new deals', free: true, premium: true },
    { name: 'Early access to deals (6 hours)', free: false, premium: true },
    { name: 'Price drop alerts', free: false, premium: true },
    { name: 'No advertisements', free: false, premium: true },
    { name: 'Priority customer support', free: false, premium: true },
    { name: 'Exclusive error fare alerts', free: false, premium: true },
    { name: 'Advanced filtering options', free: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start saving on flights today. Upgrade anytime for premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600 ml-2">forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Access to all flight deals</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email alerts for new deals</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Basic filtering options</span>
              </li>
            </ul>
            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 px-8 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="lg:scale-105 lg:-mt-4">
            <PremiumUpgrade />
          </div>

          {/* Comparison Table for Desktop */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
            <div className="space-y-3">
              {features.slice(2).map((feature, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{feature.name}</span>
                  <div className="flex gap-4">
                    {feature.premium ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Feature Comparison Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Features
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Free
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary-600">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{feature.name}</td>
                    <td className="px-6 py-4 text-center">
                      {feature.free ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {feature.premium ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your premium subscription at any time. You'll continue to have
                access to premium features until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards through our secure payment processor, Stripe.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                How early will I see deals with premium?
              </h3>
              <p className="text-gray-600">
                Premium members get access to all deals 6 hours before they're released to free
                users, giving you a head start on booking the best fares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
