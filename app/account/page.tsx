'use client';

import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, CreditCard, Save } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { User } from '@/types';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/';
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser(profile);
          setFullName(profile.full_name || '');
          setEmail(profile.email);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (!user) return;

      const { error: updateError } = await supabase
        .from('users')
        .update({
          full_name: fullName,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <UserIcon className="text-primary-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
            <p className="text-gray-600">Update your personal information</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="text-primary-600" size={28} />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Subscription</h2>
            <p className="text-gray-600">Manage your subscription plan</p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {user?.subscription_tier === 'premium' ? '⭐ Premium Plan' : 'Free Plan'}
              </h3>
              <p className="text-gray-600 mt-1">
                {user?.subscription_tier === 'premium'
                  ? 'Unlimited price alerts, saved searches, and priority support'
                  : 'Limited to 3 price alerts and 5 saved searches'}
              </p>
            </div>
            {user?.subscription_tier === 'free' && (
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
