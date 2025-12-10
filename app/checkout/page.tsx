'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PriceBreakdown from '@/components/PriceBreakdown';
import { SERVICE_FEE, MARKUP_PERCENTAGE, calculateTotalPrice } from '@/lib/duffel';
import { format } from 'date-fns';
import { CreditCard, Lock } from 'lucide-react';

// Helper to get departure time from slice or first segment
const getDepartureTime = (slice: any): string | null => {
  if (slice.departure_time) return slice.departure_time;
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[0].departing_at;
  }
  return null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Load booking data from localStorage
    const data = localStorage.getItem('pendingBooking');
    if (data) {
      setBookingData(JSON.parse(data));
    } else {
      // No booking data, redirect to search
      router.push('/search');
    }
    setLoading(false);
  }, []);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // In a real implementation, this would:
      // 1. Create a Stripe payment intent
      // 2. Process payment
      // 3. Create Duffel order
      // 4. Store order in database
      
      // For MVP, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock booking confirmation
      const confirmation = {
        bookingReference: `FD${Date.now().toString().slice(-8)}`,
        ...bookingData,
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
      };

      // Store confirmation
      localStorage.setItem('bookingConfirmation', JSON.stringify(confirmation));
      localStorage.removeItem('pendingBooking');

      // Navigate to confirmation page
      router.push('/confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return null;
  }

  const basePrice = parseFloat(bookingData.offer.display_price || bookingData.offer.total_amount);
  const totalPassengers = bookingData.passengers.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Payment Info */}
          <div className="space-y-6">
            {/* Security Notice */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-primary-600" />
              <div>
                <div className="font-semibold text-primary-900">Secure Payment</div>
                <div className="text-sm text-primary-700">Your payment information is encrypted and secure</div>
              </div>
            </div>

            {/* Payment Form (MVP - Placeholder) */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Details
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Integration Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Stripe payment integration will be added in Phase 2. 
                  For now, click "Complete Booking" to see the confirmation page.
                </p>
              </div>

              {/* Future: Stripe Elements will go here */}
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Flight</span>
                  <span className="font-medium">
                    {bookingData.offer.slices[0].origin.iata_code} → {bookingData.offer.slices[0].destination.iata_code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Airline</span>
                  <span className="font-medium">{bookingData.offer.owner.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span className="font-medium">
                    {getDepartureTime(bookingData.offer.slices[0]) && format(new Date(getDepartureTime(bookingData.offer.slices[0])!), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Passengers</span>
                  <span className="font-medium">{totalPassengers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div>
            <PriceBreakdown
              basePrice={basePrice}
              currency={bookingData.offer.total_currency}
              addOnsTotal={bookingData.addOnsTotal || 0}
              passengerCount={totalPassengers}
            />

            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full mt-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                'Complete Booking'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this booking, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">terms and conditions</a>
            </p>

            <button
              onClick={() => router.back()}
              className="w-full mt-4 text-gray-600 hover:text-gray-900 py-2"
            >
              ← Back to Booking Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
