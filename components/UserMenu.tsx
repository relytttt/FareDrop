'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut, Settings, Bookmark, Heart, Bell, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase';
import type { User as UserType } from '@/types';

interface UserMenuProps {
  onLoginClick: () => void;
}

export default function UserMenu({ onLoginClick }: UserMenuProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(profile);
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block text-gray-700 font-medium">
          {user.full_name || 'My Account'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-semibold text-gray-800">{user.full_name || 'User'}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            {user.subscription_tier === 'premium' && (
              <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded">
                ⭐ Premium
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              <span>Account Settings</span>
            </Link>

            <Link
              href="/account/bookings"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={18} />
              <span>My Bookings</span>
            </Link>

            <Link
              href="/account/saved"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Bookmark size={18} />
              <span>Saved Searches</span>
            </Link>

            <Link
              href="/account/favorites"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={18} />
              <span>Favorite Deals</span>
            </Link>

            <Link
              href="/account/alerts"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <Bell size={18} />
              <span>Price Alerts</span>
            </Link>
          </div>

          {/* Admin Dashboard - Only for admins */}
          {(user.role === 'admin' || user.email?.endsWith('@faredrop.com') || user.email?.endsWith('@faredrop.com.au')) && (
            <>
              <div className="border-t border-gray-200"></div>
              <div className="py-2">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-primary-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            </>
          )}

          {/* Logout */}
          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 w-full text-left"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
