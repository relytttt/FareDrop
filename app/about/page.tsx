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
              At FareDrop, we believe that everyone deserves to explore the world. Travel shouldn't be a luxury reserved for the few—it should be accessible to all. That's why we've built a powerful platform that scans thousands of flights every day to find the absolute best deals.
            </p>
            <p>
              Our advanced algorithms analyze pricing patterns, identify mistake fares, and spot limited-time promotions before they disappear. We then deliver these incredible deals directly to you, saving you hours of research and potentially thousands of dollars.
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Algorithms</h3>
              <p className="text-gray-600">
                Our technology monitors pricing across airlines, consolidators, and OTAs 24/7, identifying patterns and anomalies.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Users className="text-accent-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Human Curation</h3>
              <p className="text-gray-600">
                Our team of travel experts reviews and verifies deals to ensure quality and real value for our users.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Mail className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Alerts</h3>
              <p className="text-gray-600">
                When we find an exceptional deal matching your preferences, you're notified immediately via email.
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
                We show you exactly what you're getting—no hidden fees, no bait-and-switch tactics. Every deal links directly to the booking site.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                We don't spam you with every mediocre deal. We're selective, sharing only legitimate offers that represent real value.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">User Privacy</h3>
              <p className="text-gray-600">
                Your data is yours. We never sell your information to third parties and only use your email to send you the deals you want.
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
