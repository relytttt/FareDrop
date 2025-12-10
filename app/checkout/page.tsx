'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PriceBreakdown from '@/components/PriceBreakdown';
import PaymentForm from '@/components/PaymentForm';
import { SERVICE_FEE, MARKUP_PERCENTAGE, calculateTotalPrice } from '@/lib/duffel';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';
import { getDepartureTime } from '@/lib/utils/flightUtils';

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
  const totalAmount = calculateTotalPrice(basePrice) + (bookingData.addOnsTotal || 0);
  const route = `${bookingData.offer.slices[0].origin.iata_code} → ${bookingData.offer.slices[0].destination.iata_code}`;

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

            {/* Payment Form */}
            <PaymentForm
              offerId={bookingData.offerId}
              totalAmount={totalAmount}
              currency={bookingData.offer.total_currency}
              passengerCount={totalPassengers}
              route={route}
            />

            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {(() => {
                const departureTime = getDepartureTime(bookingData.offer.slices[0]);
                return (
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
                        {departureTime ? format(new Date(departureTime), 'dd MMM yyyy') : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers</span>
                      <span className="font-medium">{totalPassengers}</span>
                    </div>
                  </div>
                );
              })()}
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
