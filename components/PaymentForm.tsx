'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CreditCard } from 'lucide-react';
import { PassengerDetails } from '@/lib/duffel';
import { SelectedExtra } from '@/lib/tripExtras';

interface PaymentFormProps {
  offerId: string;
  totalAmount: number;
  currency: string;
  passengerCount: number;
  route: string;
  passengers: PassengerDetails[];
  tripExtras?: SelectedExtra[];
}

export default function PaymentForm({
  offerId,
  totalAmount,
  currency,
  passengerCount,
  route,
  passengers,
  tripExtras = [],
}: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundPolicyAcknowledged, setRefundPolicyAcknowledged] = useState(false);

  const handlePayment = async () => {
    if (!refundPolicyAcknowledged) {
      setError('Please acknowledge the refund policy before proceeding.');
      return;
    }

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
          passengers,
          tripExtras,
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

      {/* Refund Policy Warning */}
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900 mb-2">
              ⚠️ Important: No "Change of Mind" Refunds
            </p>
            <p className="text-sm text-yellow-800 mb-3">
              Refunds are only available in circumstances outside of anyone's control (e.g., airline cancellation, 
              natural disasters). Please review your booking carefully before proceeding.
            </p>
            <a
              href="/refunds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-900 hover:text-yellow-700 underline font-medium"
            >
              Read our full Refund Policy →
            </a>
          </div>
        </div>
      </div>

      {/* Acknowledgment Checkbox */}
      <div className="mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={refundPolicyAcknowledged}
            onChange={(e) => setRefundPolicyAcknowledged(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            I have reviewed my booking details and understand that refunds are not available for change of mind. 
            I acknowledge the <a href="/refunds" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Refund Policy</a>.
          </span>
        </label>
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
        disabled={loading || !refundPolicyAcknowledged}
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
