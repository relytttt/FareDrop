'use client';

import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';

interface EmailCaptureProps {
  variant?: 'inline' | 'footer';
}

export default function EmailCapture({ variant = 'inline' }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email to confirm.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'footer') {
    return (
      <div className="w-full max-w-md">
        <h3 className="text-lg font-semibold text-white mb-2">Get Deal Alerts</h3>
        <p className="text-gray-300 text-sm mb-4">
          Never miss a great flight deal. Subscribe to our newsletter.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Subscribe'}
          </button>
        </form>
        {status === 'success' && (
          <p className="mt-2 text-sm text-green-400">{message}</p>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-400">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg p-8 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <Mail size={32} />
        <h2 className="text-2xl font-bold">Never Miss a Deal</h2>
      </div>
      <p className="mb-6 text-white/90">
        Get exclusive flight deals delivered straight to your inbox. No spam, just amazing savings!
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Subscribing...</span>
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-4 text-white/90 font-medium">{message}</p>
      )}
      {status === 'error' && (
        <p className="mt-4 text-red-200 font-medium">{message}</p>
      )}
    </div>
  );
}
