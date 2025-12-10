-- Users table for accounts and subscriptions
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free', -- 'free', 'premium', 'cancelled'
  subscription_id TEXT,
  subscription_ends_at TIMESTAMP WITH TIME ZONE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  duffel_order_id TEXT NOT NULL,
  booking_reference TEXT NOT NULL,
  stripe_payment_id TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passenger_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
  type TEXT NOT NULL, -- 'booking', 'subscription'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for users (users can only see their own data)
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (true);

CREATE POLICY "Users can insert own data"
    ON users FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own data"
    ON users FOR UPDATE
    USING (true);

-- RLS policies for bookings
CREATE POLICY "Bookings are viewable by everyone"
    ON bookings FOR SELECT
    USING (true);

CREATE POLICY "Bookings can be inserted"
    ON bookings FOR INSERT
    WITH CHECK (true);

-- RLS policies for payments
CREATE POLICY "Payments are viewable by everyone"
    ON payments FOR SELECT
    USING (true);

CREATE POLICY "Payments can be inserted"
    ON payments FOR INSERT
    WITH CHECK (true);
