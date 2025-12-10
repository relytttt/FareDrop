'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, MapPin, Download } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { Booking } from '@/types';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/';
          return;
        }

        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [supabase]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingBag className="text-primary-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Bookings</h2>
          <p className="text-gray-600">View your past and upcoming bookings</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start exploring and book your next adventure!</p>
          <a
            href="/search"
            className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
          >
            Search Flights
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isUpcoming = new Date(booking.departure_date) > new Date();
            const statusColors = {
              confirmed: 'bg-green-100 text-green-800',
              cancelled: 'bg-red-100 text-red-800',
              completed: 'bg-gray-100 text-gray-800',
            };

            return (
              <div
                key={booking.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {booking.origin} → {booking.destination}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[booking.status]}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      {isUpcoming && booking.status === 'confirmed' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-gray-600">
                      {booking.booking_reference && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Reference:</span> {booking.booking_reference}
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Departure: {new Date(booking.departure_date).toLocaleDateString()}</span>
                      </p>
                      {booking.return_date && (
                        <p className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Return: {new Date(booking.return_date).toLocaleDateString()}</span>
                        </p>
                      )}
                      <p className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{booking.passengers_count} passenger{booking.passengers_count !== 1 ? 's' : ''}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-600">
                        {booking.currency} ${booking.total_amount}
                      </p>
                      <p className="text-sm text-gray-500">Total Amount</p>
                    </div>

                    {booking.status === 'confirmed' && (
                      <button className="flex items-center gap-2 px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                        <Download size={18} />
                        E-Ticket
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
