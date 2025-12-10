'use client';

import { useState, useEffect } from 'react';
import { Bookmark, Trash2, Search, Calendar } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { SavedSearch } from '@/types';
import { useRouter } from 'next/navigation';

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('/api/saved-searches');
      const data = await response.json();

      if (response.ok) {
        setSearches(data.searches || []);
      }
    } catch (err) {
      console.error('Error fetching saved searches:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (searchId: string) => {
    if (!confirm('Are you sure you want to delete this saved search?')) return;

    setDeleting(searchId);
    try {
      const response = await fetch(`/api/saved-searches?id=${searchId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSearches(searches.filter((s) => s.id !== searchId));
      } else {
        alert('Failed to delete saved search');
      }
    } catch (err) {
      console.error('Error deleting saved search:', err);
      alert('Failed to delete saved search');
    } finally {
      setDeleting(null);
    }
  };

  const handleSearchAgain = (search: SavedSearch) => {
    const params = new URLSearchParams({
      origin: search.origin,
      destination: search.destination,
      adults: search.passengers_adults.toString(),
      children: search.passengers_children.toString(),
      infants: search.passengers_infants.toString(),
      cabinClass: search.cabin_class,
    });

    if (search.departure_date_from) {
      params.set('departureDate', search.departure_date_from);
    }
    if (search.return_date_from) {
      params.set('returnDate', search.return_date_from);
    }

    router.push(`/flights?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="text-primary-600" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Saved Searches</h2>
          <p className="text-gray-600">Quick access to your favorite search routes</p>
        </div>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No saved searches yet</h3>
          <p className="text-gray-600 mb-6">Save your frequent searches for quick access later!</p>
          <a
            href="/search"
            className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
          >
            Search Flights
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  {search.name && (
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{search.name}</h3>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-800">{search.origin}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-xl font-bold text-gray-800">{search.destination}</span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    {search.departure_date_from && (
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>
                          Departure: {new Date(search.departure_date_from).toLocaleDateString()}
                          {search.departure_date_to && ` - ${new Date(search.departure_date_to).toLocaleDateString()}`}
                        </span>
                      </p>
                    )}
                    {search.return_date_from && (
                      <p className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>
                          Return: {new Date(search.return_date_from).toLocaleDateString()}
                          {search.return_date_to && ` - ${new Date(search.return_date_to).toLocaleDateString()}`}
                        </span>
                      </p>
                    )}
                    <p>
                      {search.passengers_adults} adult{search.passengers_adults !== 1 ? 's' : ''}
                      {search.passengers_children > 0 && `, ${search.passengers_children} child${search.passengers_children !== 1 ? 'ren' : ''}`}
                      {search.passengers_infants > 0 && `, ${search.passengers_infants} infant${search.passengers_infants !== 1 ? 's' : ''}`}
                      {' · '}
                      {search.cabin_class.charAt(0).toUpperCase() + search.cabin_class.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSearchAgain(search)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
                  >
                    <Search size={18} />
                    Search Again
                  </button>

                  <button
                    onClick={() => handleDelete(search.id)}
                    disabled={deleting === search.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
