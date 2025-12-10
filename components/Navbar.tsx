'use client';

import Link from 'next/link';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const handleOpenAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
              <Plane className="text-accent-500" size={32} />
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                FareDrop
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Search Flights
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                All Deals
              </Link>
              <Link href="/trip-extras" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Hotels & Cars
              </Link>
              <Link href="/alerts" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                Alerts
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
                About
              </Link>
            </div>

            {/* User Menu / Sign In Button */}
            <div className="hidden md:block">
              <UserMenu onLoginClick={() => handleOpenAuthModal('login')} />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/search"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Flights
                </Link>
                <Link
                  href="/deals"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Deals
                </Link>
                <Link
                  href="/trip-extras"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hotels & Cars
                </Link>
                <Link
                  href="/alerts"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Alerts
                </Link>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                {/* Mobile User Menu */}
                <div className="pt-4 border-t border-gray-200">
                  <UserMenu onLoginClick={() => {
                    setMobileMenuOpen(false);
                    handleOpenAuthModal('login');
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
