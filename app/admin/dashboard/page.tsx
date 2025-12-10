'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, BarChart3 } from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  monthlyBookings: number;
  averageBookingValue: number;
  subscriptionMRR: number;
  commissionEarned: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll simulate data
    setTimeout(() => {
      setStats({
        totalRevenue: 45678.50,
        monthlyRevenue: 12345.75,
        totalBookings: 156,
        monthlyBookings: 42,
        averageBookingValue: 294.32,
        subscriptionMRR: 2498.00,
        commissionEarned: 6789.45,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+8.3%',
      icon: TrendingUp,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      change: '+15.2%',
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Monthly Bookings',
      value: stats.monthlyBookings.toString(),
      change: '+10.1%',
      icon: Calendar,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Avg Booking Value',
      value: `$${stats.averageBookingValue.toFixed(2)}`,
      change: '+2.8%',
      icon: BarChart3,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Subscription MRR',
      value: `$${stats.subscriptionMRR.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      change: '+18.9%',
      icon: CreditCard,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-white ${stat.color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Commission Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Commission Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Total Commission Earned</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats.commissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${(stats.commissionEarned * 0.3).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Flight Bookings</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${(stats.commissionEarned * 0.7).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">70% of total</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Subscriptions</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${(stats.commissionEarned * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">25% of total</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Add-ons</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${(stats.commissionEarned * 0.05).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">5% of total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Real-time booking data will appear here</p>
            <p className="text-sm mt-2">Connect to live database to see recent transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
