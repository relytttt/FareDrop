'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { PassengerDetails } from '@/lib/duffel';

interface PassengerFormProps {
  passengerCount: {
    adults: number;
    children: number;
    infants: number;
  };
  onPassengersChange: (passengers: PassengerDetails[]) => void;
}

export default function PassengerForm({ passengerCount, onPassengersChange }: PassengerFormProps) {
  const [passengers, setPassengers] = useState<PassengerDetails[]>(() => {
    const initial: PassengerDetails[] = [];
    
    // Add adults
    for (let i = 0; i < passengerCount.adults; i++) {
      initial.push({
        type: 'adult',
        given_name: '',
        family_name: '',
        born_on: '',
        gender: 'm',
        title: 'mr',
        email: i === 0 ? '' : undefined,
        phone_number: i === 0 ? '' : undefined,
      });
    }
    
    // Add children
    for (let i = 0; i < passengerCount.children; i++) {
      initial.push({
        type: 'child',
        given_name: '',
        family_name: '',
        born_on: '',
        gender: 'm',
      });
    }
    
    // Add infants
    for (let i = 0; i < passengerCount.infants; i++) {
      initial.push({
        type: 'infant_without_seat',
        given_name: '',
        family_name: '',
        born_on: '',
        gender: 'm',
      });
    }
    
    return initial;
  });

  const updatePassenger = (index: number, field: keyof PassengerDetails, value: any) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
    onPassengersChange(updated);
  };

  const getPassengerLabel = (passenger: PassengerDetails, index: number) => {
    if (passenger.type === 'adult') {
      return index === 0 ? 'Lead Passenger (Adult)' : `Adult ${index + 1}`;
    } else if (passenger.type === 'child') {
      return `Child ${index - passengerCount.adults + 1}`;
    } else {
      return `Infant ${index - passengerCount.adults - passengerCount.children + 1}`;
    }
  };

  const getMaxBirthDate = (type: string) => {
    const today = new Date();
    if (type === 'adult') {
      // 12+ years ago
      return new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
    } else if (type === 'child') {
      // 2-11 years ago
      return new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    } else {
      // 0-2 years ago
      return today;
    }
  };

  const getMinBirthDate = (type: string) => {
    const today = new Date();
    if (type === 'adult') {
      // Max 120 years old
      return new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    } else if (type === 'child') {
      // 2-11 years ago
      return new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
    } else {
      // 0-2 years ago
      return new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    }
  };

  return (
    <div className="space-y-6">
      {passengers.map((passenger, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {getPassengerLabel(passenger, index)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title (for adults only) */}
            {passenger.type === 'adult' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <select
                  value={passenger.title || 'mr'}
                  onChange={(e) => updatePassenger(index, 'title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="mr">Mr</option>
                  <option value="ms">Ms</option>
                  <option value="mrs">Mrs</option>
                  <option value="miss">Miss</option>
                  <option value="dr">Dr</option>
                </select>
              </div>
            )}

            {/* First Name */}
            <div className={passenger.type === 'adult' ? '' : 'md:col-span-1'}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={passenger.given_name}
                onChange={(e) => updatePassenger(index, 'given_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="As shown on passport"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={passenger.family_name}
                onChange={(e) => updatePassenger(index, 'family_name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="As shown on passport"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={passenger.born_on}
                onChange={(e) => updatePassenger(index, 'born_on', e.target.value)}
                max={getMaxBirthDate(passenger.type).toISOString().split('T')[0]}
                min={getMinBirthDate(passenger.type).toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={passenger.gender}
                onChange={(e) => updatePassenger(index, 'gender', e.target.value as 'm' | 'f')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="m">Male</option>
                <option value="f">Female</option>
              </select>
            </div>

            {/* Email (lead passenger only) */}
            {index === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={passenger.email || ''}
                  onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
            )}

            {/* Phone (lead passenger only) */}
            {index === 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={passenger.phone_number || ''}
                  onChange={(e) => updatePassenger(index, 'phone_number', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="+61 XXX XXX XXX"
                  required
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
