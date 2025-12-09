'use client';

import { SERVICE_FEE, MARKUP_PERCENTAGE } from '@/lib/duffel';

interface PriceBreakdownProps {
  basePrice: number;
  currency: string;
  addOnsTotal?: number;
  passengerCount?: number;
}

export default function PriceBreakdown({
  basePrice,
  currency,
  addOnsTotal = 0,
  passengerCount = 1,
}: PriceBreakdownProps) {
  const markup = basePrice * MARKUP_PERCENTAGE;
  const subtotal = basePrice + addOnsTotal;
  const total = subtotal + markup + SERVICE_FEE;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Breakdown</h3>

      <div className="space-y-3">
        {/* Base Fare */}
        <div className="flex justify-between text-gray-700">
          <span>Base Fare ({passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'})</span>
          <span>{currency} ${basePrice.toFixed(2)}</span>
        </div>

        {/* Add-ons */}
        {addOnsTotal > 0 && (
          <div className="flex justify-between text-gray-700">
            <span>Add-ons & Services</span>
            <span>{currency} ${addOnsTotal.toFixed(2)}</span>
          </div>
        )}

        {/* Markup */}
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Service Markup ({(MARKUP_PERCENTAGE * 100).toFixed(0)}%)</span>
          <span>{currency} ${markup.toFixed(2)}</span>
        </div>

        {/* Service Fee */}
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Booking Service Fee</span>
          <span>{currency} ${SERVICE_FEE.toFixed(2)}</span>
        </div>

        <div className="border-t border-gray-300 my-3"></div>

        {/* Total */}
        <div className="flex justify-between text-xl font-bold text-primary-600">
          <span>Total Amount</span>
          <span>{currency} ${total.toFixed(2)}</span>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Prices include all taxes and fees. Final price in {currency}.
        </p>
      </div>
    </div>
  );
}
