'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CheckCircle, Download, Plane, Calendar, Users, Mail } from 'lucide-react';
import TripUpsells from '@/components/TripUpsells';

// Helper to get departure time from slice or first segment
const getDepartureTime = (slice: any): string | null => {
  if (slice.departure_time) return slice.departure_time;
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[0].departing_at;
  }
  return null;
};

// Helper to get arrival time from slice or last segment
const getArrivalTime = (slice: any): string | null => {
  if (slice.arrival_time) return slice.arrival_time;
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[slice.segments.length - 1].arriving_at;
  }
  return null;
};

export default function ConfirmationPage() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load confirmation data from localStorage
    const data = localStorage.getItem('bookingConfirmation');
    if (data) {
      setConfirmation(JSON.parse(data));
    } else {
      // No confirmation data, redirect to home
      router.push('/');
    }
    setLoading(false);
  }, []);

  const handleDownloadItinerary = () => {
    // In a real implementation, this would generate a PDF
    alert('PDF generation will be implemented in Phase 2. Your itinerary will be emailed to you.');
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

  if (!confirmation) {
    return null;
  }

  const totalPassengers = confirmation.passengers.length;
  const destination = confirmation.offer.slices[0].destination;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-xl text-gray-600">
            Your flight has been successfully booked
          </p>
        </div>

        {/* Booking Reference */}
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg p-6 text-white text-center mb-8">
          <div className="text-sm uppercase tracking-wide mb-2">Booking Reference</div>
          <div className="text-4xl font-bold tracking-wider">{confirmation.bookingReference}</div>
          <div className="text-sm mt-2 opacity-90">
            Save this reference number for your records
          </div>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Flight Details</h2>

          {/* Flight Info */}
          {confirmation.offer.slices.map((slice: any, index: number) => {
            const departureTime = getDepartureTime(slice);
            const arrivalTime = getArrivalTime(slice);
            
            return (
            <div key={slice.id} className={`${index > 0 ? 'mt-6 pt-6 border-t' : ''}`}>
              <div className="flex items-center gap-4 mb-4">
                <Plane className="w-6 h-6 text-primary-500" />
                <div>
                  <div className="text-lg font-semibold">
                    {slice.origin.city_name || slice.origin.iata_code} → {slice.destination.city_name || slice.destination.iata_code}
                  </div>
                  <div className="text-sm text-gray-600">
                    {confirmation.offer.owner.name}
                  </div>
                </div>
              </div>

              <div className="ml-10 space-y-2">
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {departureTime && format(new Date(departureTime), 'EEEE, dd MMMM yyyy')}
                  </span>
                </div>
                <div className="text-gray-600">
                  Departure: {departureTime && format(new Date(departureTime), 'HH:mm')} ({slice.origin.iata_code})
                </div>
                <div className="text-gray-600">
                  Arrival: {arrivalTime && format(new Date(arrivalTime), 'HH:mm')} ({slice.destination.iata_code})
                </div>
              </div>
            </div>
            );
          })}

          {/* Passengers */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-primary-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Passengers ({totalPassengers})
              </h3>
            </div>
            <div className="space-y-2 ml-8">
              {confirmation.passengers.map((passenger: any, index: number) => (
                <div key={index} className="text-gray-700">
                  {passenger.title && `${passenger.title.toUpperCase()}. `}
                  {passenger.given_name} {passenger.family_name}
                  {passenger.email && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({passenger.email})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Email Confirmation */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-primary-500" />
              <div>
                <div className="font-medium">Confirmation Email Sent</div>
                <div className="text-sm text-gray-600">
                  We've sent your booking confirmation and itinerary to {confirmation.passengers[0].email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <button
            onClick={handleDownloadItinerary}
            className="flex-1 bg-white border-2 border-primary-500 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Itinerary
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>

        {/* Trip Upsells */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Complete Your Trip to {destination.city_name || destination.iata_code}
          </h2>
          <TripUpsells
            destination={destination.iata_code}
            destinationCity={destination.city_name}
          />
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Check your email for your booking confirmation and e-tickets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Ensure your passport is valid for at least 6 months from your travel date</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Check visa requirements for your destination</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">✓</span>
              <span>Online check-in usually opens 24 hours before departure</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
