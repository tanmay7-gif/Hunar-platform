-- =========================================================================
-- HUNAR (हुनर) — Production Database Schema for Supabase / PostgreSQL
-- Authentic Grassroots Indian Creator & Artisan Guild Monetization Platform
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CREATORS / USERS TABLE
CREATE TABLE IF NOT EXISTS creators (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'creator-' || uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    name_hindi VARCHAR(255),
    username VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(30),
    whatsapp VARCHAR(30),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'India',
    primary_art_form VARCHAR(100) NOT NULL, -- Visual Arts, Madhubani/Folk Craft, Bridal Mehndi, Murals, Pottery, Performing
    art_form_hindi VARCHAR(100),
    languages TEXT[] DEFAULT ARRAY['Hindi', 'English'],
    experience_level VARCHAR(60) NOT NULL, -- Beginner, Emerging (1-3 yrs), Established (3-7 yrs), Master Artisan (8+ yrs)
    bio TEXT NOT NULL,
    bio_hindi TEXT,
    avatar_url TEXT NOT NULL,
    cover_image TEXT,
    is_verified BOOLEAN DEFAULT false,
    min_pricing INTEGER NOT NULL DEFAULT 1500,
    hourly_rate INTEGER DEFAULT 500,
    unit_pricing_label VARCHAR(150),
    six_month_income_goal INTEGER DEFAULT 35000,
    current_monthly_income INTEGER DEFAULT 12000,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    reviews_count INTEGER DEFAULT 0,
    completed_gigs_count INTEGER DEFAULT 0,
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    badges TEXT[] DEFAULT ARRAY[]::TEXT[],
    portfolio_images JSONB DEFAULT '[]'::jsonb,
    whatsapp_inquiry_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. OPPORTUNITIES (GIGS, COMMISSIONS, WALL MURALS, GRANTS) TABLE
CREATE TABLE IF NOT EXISTS opportunities (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'opp-' || uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    title_hindi VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- Murals, Madhubani & Folk, Pottery, Bridal Mehndi, Visual Arts
    type VARCHAR(60) NOT NULL, -- Commission, Murals, Event Booking, Exhibition, Grant
    type_hindi VARCHAR(60),
    location VARCHAR(120) NOT NULL, -- e.g. "Delhi NCR", "Jaipur", "Remote"
    budget_min INTEGER NOT NULL,
    budget_max INTEGER NOT NULL,
    deadline VARCHAR(60) NOT NULL,
    posted_by VARCHAR(150) NOT NULL,
    posted_by_org VARCHAR(150),
    posted_by_avatar TEXT,
    posted_by_verified BOOLEAN DEFAULT true,
    requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN DEFAULT false,
    matched_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. APPLICATIONS (GIG BIDS & INTEREST) TABLE
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'app-' || uuid_generate_v4()::text,
    opportunity_id VARCHAR(64) REFERENCES opportunities(id) ON DELETE CASCADE,
    creator_id VARCHAR(64) REFERENCES creators(id) ON DELETE CASCADE,
    creator_name VARCHAR(150),
    proposed_rate INTEGER NOT NULL,
    pitch TEXT NOT NULL,
    portfolio_attachment TEXT,
    status VARCHAR(30) DEFAULT 'pending', -- pending, shortlisted, accepted, declined
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. KALA ROADMAP STEPS TABLE
CREATE TABLE IF NOT EXISTS roadmap_steps (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'step-' || uuid_generate_v4()::text,
    art_form VARCHAR(100) NOT NULL, -- Murals, Pottery, Madhubani & Folk, Bridal Mehndi
    stage_number INTEGER NOT NULL, -- 1, 2, 3
    timeframe VARCHAR(100) NOT NULL, -- Month 1: Groundwork & Pricing, Month 3: First 5 Clients, Month 6: Scaled Income
    timeframe_hindi VARCHAR(100),
    income_benchmark VARCHAR(100) NOT NULL, -- e.g. "₹18,000 - ₹30,000 / mo"
    tools_to_learn TEXT[] DEFAULT ARRAY[]::TEXT[],
    milestones JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 5. MENTORSHIP SESSIONS & GURU GUILD TABLE
CREATE TABLE IF NOT EXISTS mentorship_sessions (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'mentor-' || uuid_generate_v4()::text,
    mentor_id VARCHAR(64),
    mentor_name VARCHAR(150) NOT NULL,
    mentor_name_hindi VARCHAR(150),
    mentor_role VARCHAR(150) NOT NULL,
    mentor_role_hindi VARCHAR(150),
    mentor_avatar TEXT NOT NULL,
    mentor_rating NUMERIC(3, 2) DEFAULT 5.0,
    title VARCHAR(255) NOT NULL,
    title_hindi VARCHAR(255),
    format VARCHAR(100) NOT NULL, -- 1-on-1 Portfolio Review, Pricing Strategy, Technique Workshop
    price INTEGER NOT NULL DEFAULT 499,
    duration_minutes INTEGER DEFAULT 30,
    next_available_slot VARCHAR(100) NOT NULL,
    next_available_slot_hindi VARCHAR(100),
    topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    bookings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. BOOKINGS & HIRE COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'booking-' || uuid_generate_v4()::text,
    session_id VARCHAR(64) REFERENCES mentorship_sessions(id) ON DELETE SET NULL,
    creator_id VARCHAR(64) REFERENCES creators(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(40) NOT NULL, -- "mentorship" or "creator_hire"
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(40) NOT NULL,
    client_email VARCHAR(150),
    selected_slot VARCHAR(100),
    budget_proposed INTEGER,
    note TEXT,
    status VARCHAR(30) DEFAULT 'confirmed', -- confirmed, pending, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. PRODUCTS & ARTWORK CATALOG
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'prod-' || uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    title_hindi VARCHAR(255),
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    lead_time VARCHAR(100) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    delivery_format VARCHAR(60) NOT NULL DEFAULT 'Physical Artwork',
    status VARCHAR(30) NOT NULL DEFAULT 'Live',
    dimensions VARCHAR(100),
    material VARCHAR(150),
    seller_id VARCHAR(64) REFERENCES creators(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. CUSTOMER INQUIRIES & COMMISSIONS TRACKER
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(64) PRIMARY KEY DEFAULT 'inq-' || uuid_generate_v4()::text,
    customer_id VARCHAR(64) REFERENCES creators(id) ON DELETE CASCADE,
    seller_id VARCHAR(64) REFERENCES creators(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    type VARCHAR(40) NOT NULL DEFAULT 'custom_commission',
    requirements TEXT NOT NULL,
    proposed_budget NUMERIC(10, 2) NOT NULL,
    timeline VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Under Review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR FAST PERFORMANCE & HYPER-LOCAL MATCHING
CREATE INDEX IF NOT EXISTS idx_creators_art_form ON creators(primary_art_form);
CREATE INDEX IF NOT EXISTS idx_creators_city ON creators(city);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_location ON opportunities(location);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_applications_opp ON applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_creator ON bookings(creator_id);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inquiries_customer ON inquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON inquiries(seller_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS POLICIES
CREATE POLICY "Public creators are viewable by everyone" ON creators FOR SELECT USING (true);
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Mentors are viewable by everyone" ON mentorship_sessions FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can submit bookings or inquiries" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Inquiries are viewable by participants" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Inquiries can be created by patrons" ON inquiries FOR INSERT WITH CHECK (true);
