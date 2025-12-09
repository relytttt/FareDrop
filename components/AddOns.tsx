'use client';

import { useState } from 'react';
import { Briefcase, Check } from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  type: 'baggage' | 'seat' | 'meal' | 'other';
}

interface AddOnsProps {
  availableAddOns: AddOn[];
  onAddOnsChange: (selectedIds: string[], total: number) => void;
}

export default function AddOns({ availableAddOns, onAddOnsChange }: AddOnsProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  const toggleAddOn = (addOnId: string) => {
    const newSelected = new Set(selectedAddOns);
    if (newSelected.has(addOnId)) {
      newSelected.delete(addOnId);
    } else {
      newSelected.add(addOnId);
    }
    setSelectedAddOns(newSelected);

    // Calculate total
    const total = availableAddOns
      .filter((addOn) => newSelected.has(addOn.id))
      .reduce((sum, addOn) => sum + addOn.price, 0);

    onAddOnsChange(Array.from(newSelected), total);
  };

  const baggageAddOns = availableAddOns.filter((a) => a.type === 'baggage');
  const seatAddOns = availableAddOns.filter((a) => a.type === 'seat');
  const mealAddOns = availableAddOns.filter((a) => a.type === 'meal');
  const otherAddOns = availableAddOns.filter((a) => a.type === 'other');

  const renderAddOnGroup = (title: string, addOns: AddOn[], icon?: React.ReactNode) => {
    if (addOns.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <div className="space-y-2">
          {addOns.map((addOn) => (
            <label
              key={addOn.id}
              className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedAddOns.has(addOn.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedAddOns.has(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                  className="w-5 h-5 text-primary-500 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{addOn.name}</div>
                  {addOn.description && (
                    <div className="text-sm text-gray-600">{addOn.description}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {addOn.currency} ${addOn.price.toFixed(2)}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  };

  if (availableAddOns.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
        <p>No additional services available for this flight.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Add-Ons & Services</h3>
      <p className="text-gray-600 mb-6">Enhance your journey with these optional services</p>

      {renderAddOnGroup('Checked Baggage', baggageAddOns, <Briefcase className="w-5 h-5" />)}
      {renderAddOnGroup('Seat Selection', seatAddOns)}
      {renderAddOnGroup('In-Flight Meals', mealAddOns)}
      {renderAddOnGroup('Other Services', otherAddOns)}

      {selectedAddOns.size > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <div className="flex items-center gap-2 text-primary-700">
            <Check className="w-5 h-5" />
            <span className="font-medium">
              {selectedAddOns.size} service{selectedAddOns.size !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
