'use client';

import { useState } from 'react';
import { Shield, ShieldCheck, Smartphone, Wifi, Car, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';
import { TripExtra, SelectedExtra, TRIP_EXTRAS, calculateExtraPrice } from '@/lib/tripExtras';

interface TripExtrasSelectorProps {
  tripDuration: number; // in days, for per_day pricing
  destination: string;
  onExtrasChange: (selectedExtras: SelectedExtra[], total: number) => void;
}

const iconMap: Record<string, any> = {
  Shield,
  ShieldCheck,
  Smartphone,
  Wifi,
  Car,
};

export default function TripExtrasSelector({
  tripDuration,
  destination,
  onExtrasChange,
}: TripExtrasSelectorProps) {
  const [selectedExtras, setSelectedExtras] = useState<Map<string, SelectedExtra>>(new Map());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['insurance']));

  const toggleExtra = (extra: TripExtra) => {
    const newSelected = new Map(selectedExtras);
    
    if (newSelected.has(extra.id)) {
      newSelected.delete(extra.id);
    } else {
      const calculatedPrice = calculateExtraPrice(extra, tripDuration);
      newSelected.set(extra.id, {
        extra,
        quantity: extra.priceType === 'per_day' ? tripDuration : undefined,
        calculatedPrice,
      });
    }
    
    setSelectedExtras(newSelected);
    
    // Calculate total
    const total = Array.from(newSelected.values()).reduce((sum, item) => sum + item.calculatedPrice, 0);
    onExtrasChange(Array.from(newSelected.values()), total);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const categories = [
    {
      id: 'insurance',
      name: 'Travel Insurance',
      description: 'Protect your trip from unexpected events',
      color: 'green',
    },
    {
      id: 'esim',
      name: 'Stay Connected',
      description: 'Get mobile data for your destination',
      color: 'purple',
    },
    {
      id: 'car_rental',
      name: 'Car Rental',
      description: 'Explore at your own pace',
      color: 'blue',
    },
  ];

  const getColorClasses = (color: string, selected: boolean) => {
    const colors: Record<string, { border: string; bg: string; text: string; selectedBg: string }> = {
      green: {
        border: 'border-green-300',
        bg: 'bg-green-100',
        text: 'text-green-600',
        selectedBg: 'bg-green-50',
      },
      purple: {
        border: 'border-purple-300',
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        selectedBg: 'bg-purple-50',
      },
      blue: {
        border: 'border-blue-300',
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        selectedBg: 'bg-blue-50',
      },
    };
    
    const colorSet = colors[color] || colors.blue;
    
    return {
      border: selected ? colorSet.border : 'border-gray-200',
      bg: colorSet.bg,
      text: colorSet.text,
      selectedBg: colorSet.selectedBg,
    };
  };

  const renderExtra = (extra: TripExtra, categoryColor: string) => {
    const isSelected = selectedExtras.has(extra.id);
    const Icon = iconMap[extra.icon];
    const calculatedPrice = calculateExtraPrice(extra, tripDuration);
    const colors = getColorClasses(categoryColor, isSelected);

    return (
      <div
        key={extra.id}
        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? `${colors.border} ${colors.selectedBg}` : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => toggleExtra(extra)}
      >
        {extra.popular && (
          <div className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Popular
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0`}>
            {Icon && <Icon className={colors.text} size={24} />}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{extra.name}</h4>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleExtra(extra);
                }}
                className={`w-5 h-5 rounded focus:ring-offset-0 focus:ring-2 flex-shrink-0 mt-0.5`}
                style={{ accentColor: isSelected ? colors.text.replace('text-', '#') : undefined }}
                aria-label={`Select ${extra.name}`}
              />
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{extra.description}</p>
            
            <ul className="text-xs text-gray-500 space-y-1 mb-3">
              {extra.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">${calculatedPrice.toFixed(2)}</span>
                {extra.priceType === 'per_day' && (
                  <span className="text-xs text-gray-500 ml-1">
                    (${extra.price}/day × {tripDuration} days)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCategory = (category: typeof categories[0]) => {
    const categoryExtras = TRIP_EXTRAS.filter(e => e.category === category.id);
    const isExpanded = expandedCategories.has(category.id);
    
    if (categoryExtras.length === 0) return null;

    return (
      <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleCategory(category.id)}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {isExpanded && (
          <div className="p-6 space-y-4 bg-white">
            {categoryExtras.map(extra => renderExtra(extra, category.color))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-4">
        <h2 className="text-2xl font-bold">✨ Enhance Your Trip to {destination}</h2>
        <p className="text-sm text-white/90 mt-1">Add extras to make your journey even better</p>
      </div>
      
      <div className="p-6 space-y-4">
        {categories.map(category => renderCategory(category))}
        
        {selectedExtras.size > 0 && (
          <div className="mt-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-primary-900">
                  {selectedExtras.size} extra{selectedExtras.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-primary-700">Extras Total</div>
                <div className="text-xl font-bold text-primary-900">
                  ${Array.from(selectedExtras.values()).reduce((sum, item) => sum + item.calculatedPrice, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
