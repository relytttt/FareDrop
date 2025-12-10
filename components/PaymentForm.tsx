'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { AlertCircle, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  offerId: string;
  totalAmount: number;
  currency: string;
  passengerCount: number;
  route: string;
}

export default function PaymentForm({
  offerId,
  totalAmount,
  currency,
  passengerCount,
  route,
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offerId,
          passengerCount,
          route,
          totalAmount,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred processing your payment');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment</h2>

      {/* Order Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{route}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Passengers:</span>
            <span className="font-medium">{passengerCount}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="font-semibold text-gray-900">
              {currency} ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Payment Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        {loading ? 'Processing...' : 'Pay Now with Stripe'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your payment is secure and encrypted. Powered by Stripe.
      </p>
    </div>
  );
}
