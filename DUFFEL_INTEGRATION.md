# Duffel Flight Booking Integration

This document provides an overview of the Duffel API integration for the FareDrop flight booking system.

## Overview

FareDrop now includes a complete flight booking system powered by the Duffel API, allowing users to search, select, and book flights directly through the platform.

## Features Implemented

### 1. Flight Search
- **Location**: `/search` and homepage
- **Components**: `FlightSearch.tsx`
- **Features**:
  - Origin/destination airport selection (Australian airports + popular destinations)
  - Departure and return date pickers
  - Passenger count selector (adults, children, infants)
  - Cabin class selection (Economy, Premium Economy, Business, First)

### 2. Search Results
- **Location**: `/flights`
- **Components**: `FlightCard.tsx`
- **Features**:
  - Display flight offers with pricing
  - Sort by price, duration, or departure time
  - Show flight details (airline, times, stops)
  - Pricing includes FareDrop markup (5% + $25 service fee)

### 3. Booking Flow
- **Location**: `/book/[offerId]`
- **Components**: `PassengerForm.tsx`, `AddOns.tsx`, `PriceBreakdown.tsx`
- **Features**:
  - Flight summary display
  - Passenger details form with validation
  - Add-ons selection (baggage, etc.)
  - Complete price breakdown showing markup

### 4. Checkout
- **Location**: `/checkout`
- **Features**:
  - Booking summary
  - Payment placeholder (Stripe integration for Phase 2)
  - MVP: Click to confirm booking

### 5. Confirmation
- **Location**: `/confirmation`
- **Features**:
  - Booking reference display
  - Flight and passenger details
  - Itinerary download (placeholder)
  - Trip upsells (hotels, cars)

## Environment Variables

Add to your `.env.local` file:

```env
DUFFEL_API_TOKEN=your_duffel_api_token_here
```

## Pricing Strategy

The system applies the following markup to Duffel prices:

- **Markup Percentage**: 5% of base fare
- **Service Fee**: $25 flat fee per booking
- **Formula**: `Total = Base Fare + (Base Fare × 5%) + $25`

These values are configurable in `lib/duffel.ts`:
```typescript
export const SERVICE_FEE = 25;
export const MARKUP_PERCENTAGE = 0.05;
```

## Testing

### Manual Testing Flow

1. **Search Flights**
   - Visit http://localhost:3000 or http://localhost:3000/search
   - Select origin (e.g., SYD - Sydney)
   - Select destination (e.g., DPS - Bali)
   - Choose dates and passengers
   - Click "Search Flights"

2. **View Results**
   - Browse flight offers at `/flights`
   - Sort and filter results
   - Select a flight to book

3. **Complete Booking**
   - Fill in passenger details at `/book/[offerId]`
   - Select add-ons (optional)
   - Review price breakdown
   - Continue to checkout

4. **Checkout**
   - Review booking summary at `/checkout`
   - Click "Complete Booking" (MVP - no actual payment)

5. **View Confirmation**
   - See booking reference at `/confirmation`
   - Review flight details and passenger info

### Important Testing Notes

⚠️ **API Integration**: The Duffel API integration requires a valid API token. If the token is not set or expired, the search will fail. Error handling is in place to show user-friendly messages.

⚠️ **Offer Expiry**: Duffel offers typically expire after 15-30 minutes. If an offer has expired when attempting to book, users will see an error message.

⚠️ **LocalStorage**: The current implementation uses localStorage to pass offer data between pages. In production, this should be replaced with server-side session management.

## Known Limitations (MVP)

1. **Payment Processing**: Stripe integration is planned for Phase 2. Currently, bookings are simulated.

2. **Order Creation**: Actual Duffel order creation is not implemented in MVP. The `/api/flights/book` endpoint is a placeholder.

3. **Add-ons**: Available services (baggage, seats, meals) are mock data. Real implementation would fetch from Duffel API.

4. **Itinerary Download**: PDF generation is planned for Phase 2.

5. **Error Handling**: Basic error handling is in place, but could be enhanced with retry logic and better user feedback.

## Next Steps (Phase 2)

1. **Stripe Integration**
   - Add Stripe Elements for payment collection
   - Create payment intents
   - Handle payment confirmation

2. **Complete Duffel Order Flow**
   - Implement actual order creation via Duffel API
   - Store bookings in database
   - Send confirmation emails

3. **Enhanced Features**
   - Real-time availability checking
   - Seat selection interface
   - Meal selection interface
   - Flight change/cancellation

4. **User Accounts**
   - User authentication
   - Booking history
   - Saved passenger profiles

## File Structure

```
app/
├── search/page.tsx              # Flight search page
├── flights/page.tsx             # Search results
├── book/[offerId]/page.tsx      # Booking details
├── checkout/page.tsx            # Payment (MVP)
├── confirmation/page.tsx        # Booking confirmation
└── api/flights/
    └── search/route.ts          # Search API endpoint

components/
├── FlightSearch.tsx             # Search form
├── FlightCard.tsx               # Flight result card
├── PassengerForm.tsx            # Passenger details form
├── AddOns.tsx                   # Add-ons selector
└── PriceBreakdown.tsx           # Price summary

lib/
└── duffel.ts                    # Duffel API client & helpers

types/
└── index.ts                     # TypeScript types (includes Duffel types)
```

## API Endpoints

### POST /api/flights/search

Search for flights using Duffel API.

**Request Body:**
```json
{
  "origin": "SYD",
  "destination": "DPS",
  "departureDate": "2025-02-15",
  "returnDate": "2025-02-22",
  "adults": 2,
  "children": 0,
  "infants": 0,
  "cabinClass": "economy"
}
```

**Response:**
```json
{
  "success": true,
  "offers": [...],
  "offerRequestId": "...",
  "count": 10
}
```

## Support

For issues or questions:
1. Check the Duffel API documentation: https://duffel.com/docs
2. Review error messages in browser console
3. Check server logs for API errors
