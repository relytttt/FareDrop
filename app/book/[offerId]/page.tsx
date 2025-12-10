'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DuffelOffer } from '@/types';
import { PassengerDetails } from '@/lib/duffel';
import PassengerForm from '@/components/PassengerForm';
import PriceBreakdown from '@/components/PriceBreakdown';
import AddOns from '@/components/AddOns';
import { format } from 'date-fns';
import { Plane, Calendar, Clock } from 'lucide-react';
import { getDepartureTime, getArrivalTime } from '@/lib/utils/flightUtils';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.offerId as string;

  const [offer, setOffer] = useState<(DuffelOffer & { display_price?: string; display_currency?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<PassengerDetails[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOnsTotal, setAddOnsTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Get search params from URL
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const passengerCount = {
    adults: parseInt(searchParams.get('adults') || '1'),
    children: parseInt(searchParams.get('children') || '0'),
    infants: parseInt(searchParams.get('infants') || '0'),
  };

  useEffect(() => {
    fetchOffer();
  }, [offerId]);

  const fetchOffer = async () => {
    try {
      // In a real implementation, we'd fetch the offer from Duffel
      // For now, we'll use localStorage to get the cached offer
      const cachedOffers = localStorage.getItem('flightOffers');
      if (cachedOffers) {
        const offers = JSON.parse(cachedOffers);
        const foundOffer = offers.find((o: any) => o.id === offerId);
        if (foundOffer) {
          setOffer(foundOffer);
        } else {
          setError('Offer not found or has expired');
        }
      } else {
        setError('Offer not found. Please search for flights again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load offer');
    } finally {
      setLoading(false);
    }
  };

  const handlePassengersChange = (updatedPassengers: PassengerDetails[]) => {
    setPassengers(updatedPassengers);
  };

  const handleAddOnsChange = (selectedIds: string[], total: number) => {
    setSelectedAddOns(selectedIds);
    setAddOnsTotal(total);
  };

  const validateForm = () => {
    // Check all passengers have required fields
    for (const passenger of passengers) {
      if (!passenger.given_name || !passenger.family_name || !passenger.born_on || !passenger.gender) {
        return false;
      }
      // Lead passenger needs email and phone
      if (passengers.indexOf(passenger) === 0) {
        if (!passenger.email || !passenger.phone_number) {
          return false;
        }
      }
    }
    return true;
  };

  const handleContinueToPayment = async () => {
    if (!validateForm()) {
      alert('Please fill in all required passenger details');
      return;
    }

    setSubmitting(true);

    try {
      // Store booking data in localStorage for checkout page
      const bookingData = {
        offerId,
        offer,
        passengers,
        selectedAddOns,
        addOnsTotal,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

      // Navigate to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error preparing checkout:', error);
      alert('Failed to prepare checkout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold mb-2">Error</p>
          <p className="text-red-600 mb-4">{error || 'Offer not found'}</p>
          <button
            onClick={() => router.push('/search')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const basePrice = parseFloat(offer.display_price || offer.total_amount);
  const totalPassengers = passengerCount.adults + passengerCount.children + passengerCount.infants;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Results
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Flight Summary</h2>
              
              {offer.slices.map((slice, index) => {
                const departureTime = getDepartureTime(slice);
                const arrivalTime = getArrivalTime(slice);
                
                return (
                <div key={slice.id} className={`${index > 0 ? 'mt-4 pt-4 border-t' : ''}`}>
                  <div className="flex items-center gap-4 mb-2">
                    <Plane className="w-5 h-5 text-primary-500" />
                    <span className="font-semibold">
                      {slice.origin.iata_code} → {slice.destination.iata_code}
                    </span>
                  </div>
                  <div className="ml-9 text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {departureTime ? format(new Date(departureTime), 'EEE, dd MMM yyyy') : 'TBD'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {departureTime ? format(new Date(departureTime), 'HH:mm') : '--:--'} - {arrivalTime ? format(new Date(arrivalTime), 'HH:mm') : '--:--'}
                    </div>
                  </div>
                </div>
                );
              })}

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  {offer.owner.logo_symbol_url && (
                    <img src={offer.owner.logo_symbol_url} alt={offer.owner.name} className="w-8 h-8" />
                  )}
                  <span className="text-sm text-gray-700">{offer.owner.name}</span>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Passenger Details</h2>
              <PassengerForm
                passengerCount={passengerCount}
                onPassengersChange={handlePassengersChange}
              />
            </div>

            {/* Add-ons (placeholder - in real app would fetch from Duffel) */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Optional Add-Ons</h2>
              <AddOns
                availableAddOns={[
                  // Example add-ons - in real app, fetch from Duffel
                  {
                    id: 'bag-1',
                    name: 'Checked Baggage 23kg',
                    description: 'One piece up to 23kg',
                    price: 35,
                    currency: offer.total_currency,
                    type: 'baggage',
                  },
                  {
                    id: 'bag-2',
                    name: 'Extra Baggage 32kg',
                    description: 'One piece up to 32kg',
                    price: 60,
                    currency: offer.total_currency,
                    type: 'baggage',
                  },
                ]}
                onAddOnsChange={handleAddOnsChange}
              />
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <PriceBreakdown
                basePrice={basePrice}
                currency={offer.total_currency}
                addOnsTotal={addOnsTotal}
                passengerCount={totalPassengers}
              />

              <button
                onClick={handleContinueToPayment}
                disabled={submitting || passengers.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Continue to Payment'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking continue, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
