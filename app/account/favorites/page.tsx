'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { FavoriteDeal } from '@/types';
import DealCard from '@/components/DealCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('/api/favorites');
      const data = await response.json();

      if (response.ok) {
        setFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (dealId: string) => {
    if (!confirm('Are you sure you want to remove this favorite?')) return;

    setDeleting(dealId);
    try {
      const response = await fetch(`/api/favorites?deal_id=${dealId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFavorites(favorites.filter((f) => f.deal_id !== dealId));
      } else {
        alert('Failed to remove favorite');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert('Failed to remove favorite');
    } finally {
      setDeleting(null);
    }
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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-primary-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Favorite Deals</h2>
            <p className="text-gray-600">Your saved flight deals</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start saving your favorite deals!</p>
            <a
              href="/deals"
              className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
            >
              Browse Deals
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((favorite) => {
              if (!favorite.deal) return null;

              const deal = favorite.deal;
              const isExpired = new Date(deal.expires_at) < new Date();

              return (
                <div key={favorite.id} className="relative">
                  {isExpired && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Deal Expired
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleRemove(favorite.deal_id)}
                    disabled={deleting === favorite.deal_id}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                    title="Remove from favorites"
                  >
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </button>

                  <div className={isExpired ? 'opacity-60' : ''}>
                    <DealCard deal={deal} variant="default" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
