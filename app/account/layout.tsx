'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, ShoppingBag, Bookmark, Heart, Bell } from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/account', label: 'Profile Settings', icon: Settings },
    { href: '/account/bookings', label: 'My Bookings', icon: ShoppingBag },
    { href: '/account/saved', label: 'Saved Searches', icon: Bookmark },
    { href: '/account/favorites', label: 'Favorite Deals', icon: Heart },
    { href: '/account/alerts', label: 'Price Alerts', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile, bookings, and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
