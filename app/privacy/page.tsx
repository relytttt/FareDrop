import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to FareDrop. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our 
                website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect and process the following types of information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number</li>
                <li><strong>Payment Information:</strong> Payment card details (processed securely by Stripe)</li>
                <li><strong>Booking Details:</strong> Flight preferences, travel dates, passenger information</li>
                <li><strong>Account Data:</strong> Login credentials, subscription tier, saved searches</li>
                <li><strong>Usage Data:</strong> How you interact with our website and services</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, cookies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Process Bookings:</strong> Book flights on your behalf through our partners</li>
                <li><strong>Send Alerts:</strong> Deliver flight deal alerts based on your preferences</li>
                <li><strong>Payment Processing:</strong> Handle secure payment transactions via Stripe</li>
                <li><strong>Customer Service:</strong> Respond to inquiries and provide support</li>
                <li><strong>Service Improvement:</strong> Analyze usage patterns to enhance user experience</li>
                <li><strong>Communications:</strong> Send booking confirmations, updates, and promotional offers</li>
                <li><strong>Legal Compliance:</strong> Fulfill our legal and regulatory obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                We work with trusted third-party service providers to deliver our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Duffel:</strong> Flight booking API provider. We share passenger and booking information necessary to complete flight reservations. See <a href="https://duffel.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Duffel's Privacy Policy</a>.</li>
                <li><strong>Stripe:</strong> Payment processing. Payment card details are processed directly by Stripe and never stored on our servers. See <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Stripe's Privacy Policy</a>.</li>
                <li><strong>Resend:</strong> Email delivery service for sending booking confirmations and deal alerts.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to improve your experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication and basic functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
              </ul>
              <p className="text-gray-700 mt-4">
                You can control cookies through your browser settings. However, disabling cookies may affect website functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security audits and monitoring</li>
                <li>PCI-compliant payment processing via Stripe</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise any of these rights, please contact us at the email address below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information only as long as necessary for the purposes outlined in this policy:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Booking data is retained for 7 years for legal and tax compliance</li>
                <li>Account data is retained while your account is active</li>
                <li>Marketing preferences are retained until you opt out</li>
                <li>Usage data may be retained in aggregated, anonymized form indefinitely</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your privacy rights, please contact us at:
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:privacy@faredrop.com" className="text-primary-600 hover:text-primary-700">privacy@faredrop.com</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Support:</strong> <a href="mailto:support@faredrop.com" className="text-primary-600 hover:text-primary-700">support@faredrop.com</a>
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
