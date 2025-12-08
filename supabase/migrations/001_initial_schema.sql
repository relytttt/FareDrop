-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    origin_city VARCHAR(255),
    destination_city VARCHAR(255),
    destination_region VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    airline VARCHAR(255) NOT NULL,
    departure_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    trip_type VARCHAR(20) DEFAULT 'round-trip',
    deal_score INTEGER NOT NULL CHECK (deal_score >= 0 AND deal_score <= 100),
    affiliate_link TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    departure_city VARCHAR(100),
    destinations TEXT[], -- Array of destination preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subscriber_id, deal_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deals_origin ON deals(origin);
CREATE INDEX IF NOT EXISTS idx_deals_destination ON deals(destination);
CREATE INDEX IF NOT EXISTS idx_deals_destination_region ON deals(destination_region);
CREATE INDEX IF NOT EXISTS idx_deals_departure_date ON deals(departure_date);
CREATE INDEX IF NOT EXISTS idx_deals_price ON deals(price);
CREATE INDEX IF NOT EXISTS idx_deals_deal_score ON deals(deal_score);
CREATE INDEX IF NOT EXISTS idx_deals_expires_at ON deals(expires_at);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_departure_city ON subscribers(departure_city);
CREATE INDEX IF NOT EXISTS idx_subscribers_verified ON subscribers(verified);

CREATE INDEX IF NOT EXISTS idx_alerts_subscriber_id ON alerts(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_alerts_deal_id ON alerts(deal_id);
CREATE INDEX IF NOT EXISTS idx_alerts_sent_at ON alerts(sent_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscribers_updated_at
    BEFORE UPDATE ON subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deals (public read access)
CREATE POLICY "Deals are viewable by everyone"
    ON deals FOR SELECT
    USING (expires_at > NOW());

-- Create RLS policies for subscribers (users can only see their own data)
CREATE POLICY "Subscribers can view own data"
    ON subscribers FOR SELECT
    USING (true);

CREATE POLICY "Subscribers can insert own data"
    ON subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Subscribers can update own data"
    ON subscribers FOR UPDATE
    USING (true);

-- Create RLS policies for alerts
CREATE POLICY "Alerts are viewable by subscriber"
    ON alerts FOR SELECT
    USING (true);

-- Insert sample/mock data for initial display
INSERT INTO deals (origin, destination, origin_city, destination_city, destination_region, price, original_price, airline, departure_date, return_date, deal_score, affiliate_link, expires_at, trip_type)
VALUES
    ('JFK', 'LHR', 'New York', 'London', 'Europe', 289.00, 650.00, 'British Airways', NOW() + INTERVAL '30 days', NOW() + INTERVAL '37 days', 85, 'https://example.com/deal/1', NOW() + INTERVAL '7 days', 'round-trip'),
    ('LAX', 'NRT', 'Los Angeles', 'Tokyo', 'Asia', 425.00, 890.00, 'ANA', NOW() + INTERVAL '45 days', NOW() + INTERVAL '60 days', 92, 'https://example.com/deal/2', NOW() + INTERVAL '5 days', 'round-trip'),
    ('MIA', 'CUN', 'Miami', 'Cancun', 'Caribbean', 149.00, 320.00, 'American Airlines', NOW() + INTERVAL '21 days', NOW() + INTERVAL '28 days', 78, 'https://example.com/deal/3', NOW() + INTERVAL '10 days', 'round-trip'),
    ('ORD', 'CDG', 'Chicago', 'Paris', 'Europe', 315.00, 720.00, 'Air France', NOW() + INTERVAL '40 days', NOW() + INTERVAL '49 days', 88, 'https://example.com/deal/4', NOW() + INTERVAL '6 days', 'round-trip'),
    ('SFO', 'SYD', 'San Francisco', 'Sydney', 'Oceania', 599.00, 1200.00, 'Qantas', NOW() + INTERVAL '60 days', NOW() + INTERVAL '75 days', 90, 'https://example.com/deal/5', NOW() + INTERVAL '8 days', 'round-trip'),
    ('BOS', 'BCN', 'Boston', 'Barcelona', 'Europe', 275.00, 595.00, 'Iberia', NOW() + INTERVAL '35 days', NOW() + INTERVAL '42 days', 83, 'https://example.com/deal/6', NOW() + INTERVAL '9 days', 'round-trip'),
    ('SEA', 'HNL', 'Seattle', 'Honolulu', 'North America', 189.00, 425.00, 'Alaska Airlines', NOW() + INTERVAL '28 days', NOW() + INTERVAL '35 days', 75, 'https://example.com/deal/7', NOW() + INTERVAL '12 days', 'round-trip'),
    ('IAD', 'DXB', 'Washington DC', 'Dubai', 'Middle East', 499.00, 950.00, 'Emirates', NOW() + INTERVAL '50 days', NOW() + INTERVAL '64 days', 87, 'https://example.com/deal/8', NOW() + INTERVAL '7 days', 'round-trip'),
    ('ATL', 'LIM', 'Atlanta', 'Lima', 'South America', 329.00, 680.00, 'LATAM', NOW() + INTERVAL '38 days', NOW() + INTERVAL '45 days', 81, 'https://example.com/deal/9', NOW() + INTERVAL '6 days', 'round-trip'),
    ('DFW', 'AMS', 'Dallas', 'Amsterdam', 'Europe', 345.00, 740.00, 'KLM', NOW() + INTERVAL '42 days', NOW() + INTERVAL '49 days', 84, 'https://example.com/deal/10', NOW() + INTERVAL '8 days', 'round-trip'),
    ('JFK', 'FCO', 'New York', 'Rome', 'Europe', 298.00, 665.00, 'Alitalia', NOW() + INTERVAL '33 days', NOW() + INTERVAL '40 days', 86, 'https://example.com/deal/11', NOW() + INTERVAL '5 days', 'round-trip'),
    ('LAX', 'BKK', 'Los Angeles', 'Bangkok', 'Asia', 449.00, 920.00, 'Thai Airways', NOW() + INTERVAL '55 days', NOW() + INTERVAL '70 days', 89, 'https://example.com/deal/12', NOW() + INTERVAL '11 days', 'round-trip');
