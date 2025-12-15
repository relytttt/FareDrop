import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using FareDrop, you accept and agree to be bound by the terms and provisions 
                of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-700 mb-4">
                FareDrop is a full-service flight booking platform powered by Duffel API. Our service includes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Flight Search:</strong> Search and compare real-time flight prices from multiple airlines</li>
                <li><strong>Direct Booking:</strong> Book and pay for flights directly through our platform</li>
                <li><strong>Deal Alerts:</strong> Receive notifications for flight deals based on your preferences</li>
                <li><strong>Payment Processing:</strong> Secure payment processing via Stripe</li>
                <li><strong>Booking Management:</strong> Access your booking confirmations and travel documents</li>
              </ul>
              <p className="text-gray-700 mt-4">
                When you book a flight through FareDrop, you are entering into a contract with the airline. 
                FareDrop acts as an agent to facilitate the booking on your behalf.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                When using FareDrop, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate information when subscribing to alerts</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to interfere with or disrupt the service</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Booking Terms</h2>
              <p className="text-gray-700 mb-4">
                When you book a flight through FareDrop:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Accuracy:</strong> You are responsible for ensuring all passenger information is accurate and matches travel documents</li>
                <li><strong>Payment:</strong> Payment must be completed at the time of booking. All prices are in the currency displayed</li>
                <li><strong>Confirmation:</strong> You will receive a booking confirmation via email. Check all details immediately</li>
                <li><strong>Changes:</strong> Changes to bookings are subject to airline policies and may incur fees</li>
                <li><strong>Cancellations:</strong> Cancellations are subject to our Refund Policy and airline fare rules</li>
                <li><strong>No-Shows:</strong> Failure to check in or board your flight results in forfeiture of your ticket with no refund</li>
                <li><strong>Travel Documents:</strong> You are responsible for obtaining necessary visas, passports, and travel authorizations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing and Payment</h2>
              <p className="text-gray-700 mb-4">
                All prices displayed include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Base airfare</li>
                <li>Mandatory taxes and fees</li>
                <li>Airline surcharges</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Prices may change without notice until payment is completed. We are not responsible for price 
                increases between search and booking. Additional fees may apply for optional services (baggage, 
                seat selection, etc.).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                FareDrop partners with third-party service providers:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Airlines:</strong> Flight services are provided by the carrier. Airline terms and conditions apply</li>
                <li><strong>Duffel:</strong> Flight booking API provider. Their terms govern the booking process</li>
                <li><strong>Stripe:</strong> Payment processing. Stripe's terms govern payment transactions</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We have no control over, and assume no responsibility for, the content, privacy policies, or 
                practices of third-party service providers beyond facilitating the transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                FareDrop is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The accuracy or completeness of deal information</li>
                <li>The availability of deals shown on our platform</li>
                <li>That the service will be uninterrupted or error-free</li>
                <li>Final booking prices with third-party providers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, FareDrop shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Flight delays, cancellations, or schedule changes made by airlines</li>
                <li>Lost, delayed, or damaged baggage</li>
                <li>Denied boarding or travel due to visa, passport, or documentation issues</li>
                <li>Acts of nature, war, terrorism, or other force majeure events</li>
                <li>Airline service quality or in-flight experience</li>
                <li>Third-party service failures beyond our control</li>
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Our maximum liability to you for any claim is limited to the amount you paid for the booking, 
                excluding airline-imposed fees and taxes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-700 mb-4">
                In the event of a dispute:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-2">
                <li>Contact our support team at <a href="mailto:support@faredrop.com" className="text-primary-600 hover:underline">support@faredrop.com</a> to resolve the issue informally</li>
                <li>If informal resolution fails, disputes will be resolved through binding arbitration</li>
                <li>You agree to waive your right to a jury trial or to participate in a class action lawsuit</li>
              </ol>
              <p className="text-gray-700 mt-4">
                These terms are governed by the laws of the jurisdiction in which FareDrop operates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or replace these Terms at any time. Continued use of the service 
                after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: <a href="mailto:support@faredrop.com" className="text-primary-600 hover:text-primary-700">support@faredrop.com</a>
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
