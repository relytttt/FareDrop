-- Phase 2B: User Accounts, Saved Searches & Price Alerts Migration

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free' or 'premium'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT, -- Optional name like "Bali Trip"
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    departure_date_from DATE,
    departure_date_to DATE,
    return_date_from DATE,
    return_date_to DATE,
    passengers_adults INTEGER DEFAULT 1,
    passengers_children INTEGER DEFAULT 0,
    passengers_infants INTEGER DEFAULT 0,
    cabin_class VARCHAR(50) DEFAULT 'economy',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorite_deals table
CREATE TABLE IF NOT EXISTS favorite_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, deal_id)
);

-- Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    target_price DECIMAL(10,2) NOT NULL,
    current_lowest_price DECIMAL(10,2),
    departure_date_from DATE,
    departure_date_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    triggered_at TIMESTAMP WITH TIME ZONE, -- When price dropped below target
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price_alert_history table
CREATE TABLE IF NOT EXISTS price_alert_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES price_alerts(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table (for future use with Duffel API)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    duffel_order_id VARCHAR(255) UNIQUE,
    booking_reference VARCHAR(50),
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    passengers_count INTEGER NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled, completed
    booking_data JSONB, -- Store full Duffel order response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_origin ON saved_searches(origin);
CREATE INDEX IF NOT EXISTS idx_saved_searches_destination ON saved_searches(destination);

CREATE INDEX IF NOT EXISTS idx_favorite_deals_user_id ON favorite_deals(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_deals_deal_id ON favorite_deals(deal_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_is_active ON price_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_price_alerts_origin_destination ON price_alerts(origin, destination);

CREATE INDEX IF NOT EXISTS idx_price_alert_history_alert_id ON price_alert_history(alert_id);
CREATE INDEX IF NOT EXISTS idx_price_alert_history_checked_at ON price_alert_history(checked_at);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_duffel_order_id ON bookings(duffel_order_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- RLS Policies for saved_searches table
CREATE POLICY "Users can view own saved searches"
    ON saved_searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved searches"
    ON saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved searches"
    ON saved_searches FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for favorite_deals table
CREATE POLICY "Users can view own favorites"
    ON favorite_deals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
    ON favorite_deals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorite_deals FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for price_alerts table
CREATE POLICY "Users can view own price alerts"
    ON price_alerts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own price alerts"
    ON price_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own price alerts"
    ON price_alerts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own price alerts"
    ON price_alerts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for price_alert_history table
CREATE POLICY "Users can view own alert history"
    ON price_alert_history FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM price_alerts
        WHERE price_alerts.id = price_alert_history.alert_id
        AND price_alerts.user_id = auth.uid()
    ));

-- RLS Policies for bookings table
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
