-- Add trip_extras column to bookings table
-- This stores trip extras (car rental, insurance, eSIM, etc.) purchased with the booking

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS trip_extras JSONB;

-- Add index for querying bookings with specific extras
CREATE INDEX IF NOT EXISTS idx_bookings_trip_extras ON bookings USING GIN (trip_extras);

-- Add comment to describe the column
COMMENT ON COLUMN bookings.trip_extras IS 'JSON array of trip extras (car rental, insurance, eSIM) selected during booking. Each item contains: extra (TripExtra object), quantity (for per_day items), and calculatedPrice.';
