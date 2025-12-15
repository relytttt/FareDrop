import Link from 'next/link';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <h2 className="text-xl font-bold text-yellow-900 mb-2 flex items-center gap-2">
                ⚠️ Important: No "Change of Mind" Refunds
              </h2>
              <p className="text-yellow-800">
                FareDrop does not offer refunds for "change of mind" or customer convenience. 
                All flight bookings are final once payment is completed. Please review your booking 
                carefully before proceeding with payment.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">
                When you book a flight through FareDrop, you are entering into a contract with the airline 
                and related service providers. Refunds are governed by the airline's fare rules and terms of service.
              </p>
              <p className="text-gray-700 mb-4">
                FareDrop facilitates flight bookings but does not control airline refund policies. We will 
                assist you in requesting refunds in eligible circumstances, but the final decision rests with 
                the airline.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">When Refunds May Be Available</h2>
              <p className="text-gray-700 mb-4">
                Refunds may be considered only in the following circumstances beyond anyone's control:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Airline Cancellation:</strong> The airline cancels your flight</li>
                <li><strong>Significant Schedule Change:</strong> The airline significantly changes your flight schedule (typically 3+ hours)</li>
                <li><strong>Natural Disasters:</strong> Acts of nature that prevent travel (hurricanes, earthquakes, etc.)</li>
                <li><strong>Government Travel Bans:</strong> Official government restrictions preventing travel</li>
                <li><strong>Medical Emergency:</strong> Serious illness or injury requiring hospitalization (documentation required)</li>
                <li><strong>Death:</strong> Death of passenger or immediate family member (death certificate required)</li>
                <li><strong>Service Failure:</strong> Confirmed booking error or payment processing issue on FareDrop's part</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Note:</strong> Refund availability depends on the airline's fare rules. Non-refundable tickets 
                may only be eligible for partial refunds or travel credits minus cancellation fees.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Not Eligible for Refunds</h2>
              <p className="text-gray-700 mb-4">
                The following circumstances are NOT eligible for refunds:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Change of mind or change of plans</li>
                <li>Finding a cheaper flight elsewhere after booking</li>
                <li>Personal scheduling conflicts or obligations</li>
                <li>Missing your flight due to late arrival</li>
                <li>Minor schedule changes (less than 3 hours)</li>
                <li>Visa or passport issues</li>
                <li>Travel insurance claims (contact your insurance provider)</li>
                <li>Dissatisfaction with airline service during flight</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Request a Refund</h2>
              <p className="text-gray-700 mb-4">
                If you believe your situation qualifies for a refund:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3">
                <li>
                  <strong>Contact us immediately:</strong> Email <a href="mailto:refunds@faredrop.com" className="text-primary-600 hover:underline">refunds@faredrop.com</a> with your booking reference number
                </li>
                <li>
                  <strong>Provide documentation:</strong> Include relevant proof (airline notification, medical certificates, death certificates, government orders, etc.)
                </li>
                <li>
                  <strong>Include details:</strong> Explain your situation clearly and provide all relevant booking information
                </li>
                <li>
                  <strong>Wait for review:</strong> We will review your request within 2-3 business days and contact the airline on your behalf
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Processing</h2>
              <p className="text-gray-700 mb-4">
                If your refund is approved:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Timeframe:</strong> Refunds typically take 7-14 business days to process, but can take up to 30 days depending on the airline and payment method</li>
                <li><strong>Amount:</strong> The refund amount depends on the airline's fare rules. Cancellation fees and non-refundable taxes may be deducted</li>
                <li><strong>Method:</strong> Refunds are returned to the original payment method</li>
                <li><strong>Currency:</strong> Refunds are issued in the original currency of purchase. Exchange rate differences may apply</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Fees</h2>
              <p className="text-gray-700 mb-4">
                FareDrop's service fees are non-refundable except in cases where:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The booking was not successfully completed due to our error</li>
                <li>You were charged incorrectly due to a system error</li>
                <li>The airline cancels your flight (service fee will be refunded)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Travel Insurance</h2>
              <p className="text-gray-700 mb-4">
                We strongly recommend purchasing comprehensive travel insurance to protect against unforeseen circumstances. 
                Travel insurance can cover trip cancellations, interruptions, medical emergencies, and other situations not 
                covered by airline refund policies.
              </p>
              <p className="text-gray-700">
                FareDrop does not offer travel insurance directly. Please purchase from a third-party insurance provider 
                before your travel dates.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chargebacks</h2>
              <p className="text-gray-700 mb-4">
                Filing a chargeback without first contacting us may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Delayed resolution of your issue</li>
                <li>Cancellation of your booking</li>
                <li>Account suspension</li>
                <li>Legal action to recover costs</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Please contact us first to resolve any payment or booking concerns.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For refund requests or questions about this policy:
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Refunds Email:</strong> <a href="mailto:refunds@faredrop.com" className="text-primary-600 hover:text-primary-700">refunds@faredrop.com</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>General Support:</strong> <a href="mailto:support@faredrop.com" className="text-primary-600 hover:text-primary-700">support@faredrop.com</a>
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
