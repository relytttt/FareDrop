import { Plane, Users, Target, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-accent-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Plane size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">About FareDrop</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're on a mission to make travel accessible to everyone by finding and sharing the best flight deals from around the world.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              Making dream trips affordable for everyone
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p>
              At FareDrop, we believe that everyone deserves to explore the world. Travel shouldn't be a luxury reserved for the few—it should be accessible to all. That's why we've built a powerful flight booking platform that allows you to search, book, and pay for flights directly through our service.
            </p>
            <p>
              Powered by Duffel API, we connect you to real airline inventory and live pricing. When you book through FareDrop, you're making a real reservation with the airline—not just finding a deal that disappears when you click through. Our platform handles the entire booking process from search to payment to confirmation.
            </p>
            <p>
              Beyond direct booking, our advanced algorithms analyze pricing patterns, identify exceptional deals, and spot limited-time promotions. We then deliver these incredible deals directly to you, saving you hours of research and potentially thousands of dollars.
            </p>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Find Deals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Target className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Direct Booking Platform</h3>
              <p className="text-gray-600">
                Search, compare, and book flights directly through FareDrop. Powered by Duffel API for real airline bookings with instant confirmation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="text-accent-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-600">
                Complete your booking with confidence using Stripe's secure payment processing. No redirects to third-party sites—everything happens on FareDrop.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Deal Discovery</h3>
              <p className="text-gray-600">
                Browse curated deals or set up price alerts. We monitor flights 24/7 and notify you immediately when exceptional deals matching your preferences appear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">150+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">90%</div>
              <div className="text-gray-600">Avg. Savings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600">
                We show you exactly what you're getting—no hidden fees, no bait-and-switch tactics. All prices include taxes and mandatory fees. Book with confidence knowing the price you see is the price you pay.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                We don't spam you with every mediocre deal. We're selective, sharing only legitimate offers that represent real value.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Security & Trust</h3>
              <p className="text-gray-600">
                Your data and payments are protected with industry-standard encryption. We partner with trusted providers (Duffel for bookings, Stripe for payments) to ensure your information is secure. See our <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> for details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-accent-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Saving?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who are already discovering amazing deals
          </p>
          <Link
            href="/alerts"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg"
          >
            Set Up Deal Alerts
          </Link>
        </div>
      </section>
    </div>
  );
}
