'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Plane, Calendar, Users, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    // In a real implementation, we would fetch the booking details from the database
    // For now, we'll simulate a successful booking
    setTimeout(() => {
      setBooking({
        bookingReference: `FD${Date.now().toString().slice(-8)}`,
        route: 'SYD → DPS',
        passengers: 2,
        totalAmount: 598.00,
        currency: 'AUD',
        departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
      setLoading(false);
    }, 1500);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <p className="text-red-800 font-semibold mb-2">Booking Error</p>
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-xl text-gray-600">
              Your flight has been successfully booked
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="text-3xl font-bold text-primary-600">
                  {booking.bookingReference}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Route</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.route}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Departure Date</p>
                  <p className="text-lg font-semibold text-gray-900">{booking.departureDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Passengers</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount Paid</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {booking.currency} ${booking.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 flex items-start gap-4">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Confirmation Email Sent</p>
              <p className="text-sm text-blue-800">
                We've sent a confirmation email with your booking details and e-tickets. 
                Please check your inbox and spam folder.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h2>
            <ol className="space-y-3 list-decimal list-inside text-gray-700">
              <li>Check your email for booking confirmation and e-tickets</li>
              <li>Save your booking reference: <strong>{booking.bookingReference}</strong></li>
              <li>Check in online 24-48 hours before departure</li>
              <li>Arrive at the airport at least 2-3 hours before your flight</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/deals"
              className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              Browse More Deals
            </Link>
            <Link
              href="/"
              className="flex-1 bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 border-2 border-gray-200 text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Support */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <Link href="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    }>
      <BookingConfirmationContent />
    </Suspense>
  );
}
