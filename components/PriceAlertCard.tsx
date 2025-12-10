'use client';

import { useState } from 'react';
import { Plane, Calendar, DollarSign, TrendingDown, Trash2, Power } from 'lucide-react';
import type { PriceAlert } from '@/types';

interface PriceAlertCardProps {
  alert: PriceAlert;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function PriceAlertCard({ alert: priceAlert, onUpdate, onDelete }: PriceAlertCardProps) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleActive = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/price-alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: priceAlert.id,
          is_active: !priceAlert.is_active,
        }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        window.alert('Failed to update alert');
      }
    } catch (err) {
      console.error('Error updating alert:', err);
      window.alert('Failed to update alert');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this price alert?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/price-alerts?id=${priceAlert.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete();
      } else {
        window.alert('Failed to delete alert');
      }
    } catch (err) {
      console.error('Error deleting alert:', err);
      window.alert('Failed to delete alert');
    } finally {
      setDeleting(false);
    }
  };

  const progressPercent = priceAlert.current_lowest_price
    ? Math.min(100, Math.max(0, (priceAlert.current_lowest_price / priceAlert.target_price) * 100))
    : 100;

  const isTriggered = priceAlert.triggered_at !== null;
  const isCloseToTarget = priceAlert.current_lowest_price && priceAlert.current_lowest_price <= priceAlert.target_price * 1.1;

  return (
    <div className={`border rounded-lg p-6 ${priceAlert.is_active ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-800">{priceAlert.origin}</span>
              <Plane size={16} className="text-primary-500" />
              <span className="text-xl font-bold text-gray-800">{priceAlert.destination}</span>
            </div>

            {isTriggered && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Price Dropped! 🎉
              </span>
            )}

            {!priceAlert.is_active && (
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
                Paused
              </span>
            )}
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <DollarSign size={14} />
                <span>
                  Target: <span className="font-semibold text-gray-800">${priceAlert.target_price}</span>
                </span>
              </div>

              {priceAlert.current_lowest_price && (
                <div className="flex items-center gap-2">
                  <TrendingDown size={14} />
                  <span>
                    Current: <span className={`font-semibold ${isCloseToTarget ? 'text-green-600' : 'text-gray-800'}`}>
                      ${priceAlert.current_lowest_price}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {(priceAlert.departure_date_from || priceAlert.departure_date_to) && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {priceAlert.departure_date_from && new Date(priceAlert.departure_date_from).toLocaleDateString()}
                  {priceAlert.departure_date_to && ` - ${new Date(priceAlert.departure_date_to).toLocaleDateString()}`}
                  {!priceAlert.departure_date_from && !priceAlert.departure_date_to && 'Any date'}
                </span>
              </div>
            )}

            {priceAlert.last_checked_at && (
              <p className="text-xs text-gray-500">
                Last checked: {new Date(priceAlert.last_checked_at).toLocaleString()}
              </p>
            )}
          </div>

          {/* Price Progress Bar */}
          {priceAlert.current_lowest_price && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Price Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    progressPercent <= 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, progressPercent)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleToggleActive}
            disabled={updating}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
              priceAlert.is_active
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={priceAlert.is_active ? 'Pause alert' : 'Activate alert'}
          >
            <Power size={20} />
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete alert"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
