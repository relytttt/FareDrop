import { Hotel, Car, Shield, Smartphone } from 'lucide-react';

interface TripUpsellsProps {
  destination?: string; // Airport code like "DPS"
  destinationCity?: string; // City name like "Bali"
  departureDate?: string;
  returnDate?: string;
  showTitle?: boolean;
}

export default function TripUpsells({
  destination,
  destinationCity,
  departureDate,
  returnDate,
  showTitle = true,
}: TripUpsellsProps) {
  const destinationName = destinationCity || destination || 'your destination';
  
  // Build affiliate URLs with proper encoding
  const hotelsUrl = destination
    ? `https://search.hotellook.com/?marker=689762&destination=${encodeURIComponent(destination)}${departureDate ? `&checkIn=${encodeURIComponent(departureDate)}` : ''}${returnDate ? `&checkOut=${encodeURIComponent(returnDate)}` : ''}`
    : 'https://search.hotellook.com/?marker=689762';
    
  const carsUrl = destination
    ? `https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2FSearchResults.do%3FpickupLocation%3D${encodeURIComponent(destination)}`
    : 'https://tp.media/r?marker=689762&trs=267029&p=7658&u=https%3A%2F%2Fwww.rentalcars.com%2F';
    
  const insuranceUrl = 'https://safetywing.com/nomad-insurance?referenceID=faredrop';
  const esimUrl = 'https://www.airalo.com/?ref=faredrop';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      {showTitle && (
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">✈️ Complete Your Trip to {destinationName}</h2>
          <p className="text-sm text-white/90 mt-1">Save time and money with our trusted travel partners</p>
        </div>
      )}
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hotels */}
          <a
            href={hotelsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 hover:bg-primary-50 p-4 rounded-lg transition-all duration-200 border border-gray-200 hover:border-primary-300"
          >
            <div className="flex items-start gap-3">
              <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                <Hotel className="text-primary-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Hotels in {destinationName}</h3>
                <p className="text-sm text-gray-600 mb-2">Find hotels from $45/night</p>
                <span className="text-primary-600 text-sm font-medium group-hover:underline">
                  Search Hotels →
                </span>
              </div>
            </div>
          </a>

          {/* Car Rentals */}
          <a
            href={carsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 hover:bg-accent-50 p-4 rounded-lg transition-all duration-200 border border-gray-200 hover:border-accent-300"
          >
            <div className="flex items-start gap-3">
              <div className="bg-accent-100 p-2 rounded-lg group-hover:bg-accent-200 transition-colors">
                <Car className="text-accent-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Car Rentals</h3>
                <p className="text-sm text-gray-600 mb-2">Rent a car from $25/day</p>
                <span className="text-accent-600 text-sm font-medium group-hover:underline">
                  Search Cars →
                </span>
              </div>
            </div>
          </a>

          {/* Travel Insurance */}
          <a
            href={insuranceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 hover:bg-green-50 p-4 rounded-lg transition-all duration-200 border border-gray-200 hover:border-green-300"
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                <Shield className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Travel Insurance</h3>
                <p className="text-sm text-gray-600 mb-2">Protect your trip from $42/month</p>
                <span className="text-green-600 text-sm font-medium group-hover:underline">
                  Get Covered →
                </span>
              </div>
            </div>
          </a>

          {/* eSIM Data */}
          <a
            href={esimUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gray-50 hover:bg-purple-50 p-4 rounded-lg transition-all duration-200 border border-gray-200 hover:border-purple-300"
          >
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Smartphone className="text-purple-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Stay Connected</h3>
                <p className="text-sm text-gray-600 mb-2">Get eSIM data for {destinationName}</p>
                <span className="text-purple-600 text-sm font-medium group-hover:underline">
                  Get eSIM →
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
