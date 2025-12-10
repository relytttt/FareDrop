'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Edit2, TrendingDown, TrendingUp } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { PriceAlert } from '@/types';
import PriceAlertForm from '@/components/PriceAlertForm';
import PriceAlertCard from '@/components/PriceAlertCard';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/';
        return;
      }

      const response = await fetch('/api/price-alerts');
      const data = await response.json();

      if (response.ok) {
        setAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error('Error fetching price alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertCreated = () => {
    setShowForm(false);
    fetchAlerts();
  };

  const handleAlertUpdated = () => {
    fetchAlerts();
  };

  const handleAlertDeleted = () => {
    fetchAlerts();
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-primary-600" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Price Alerts</h2>
              <p className="text-gray-600">Get notified when prices drop</p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
          >
            <Plus size={20} />
            Create Alert
          </button>
        </div>

        {showForm && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <PriceAlertForm onSuccess={handleAlertCreated} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {alerts.length === 0 && !showForm ? (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No price alerts yet</h3>
            <p className="text-gray-600 mb-6">
              Create a price alert to get notified when flight prices drop below your target!
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
            >
              <Plus size={20} />
              Create Your First Alert
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <PriceAlertCard
                key={alert.id}
                alert={alert}
                onUpdate={handleAlertUpdated}
                onDelete={handleAlertDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">How Price Alerts Work</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <TrendingDown size={16} className="mt-0.5 flex-shrink-0" />
            <span>We check prices hourly for your selected routes</span>
          </li>
          <li className="flex items-start gap-2">
            <Bell size={16} className="mt-0.5 flex-shrink-0" />
            <span>You'll receive an email when the price drops below your target</span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp size={16} className="mt-0.5 flex-shrink-0" />
            <span>Track price trends and history for each alert</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
