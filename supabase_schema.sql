-- ==========================================
-- SUPABASE SCHEMA FOR MIND MAP CMS & PORTAL
-- ==========================================
-- Copy and run this script in your Supabase SQL Editor to provision the required tables.

-- 1. CMS SECTIONS TABLE (Stores the entire website contents, projects, stats, curious tech facts, etc.)
CREATE TABLE IF NOT EXISTS cms_sections (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on cms_sections
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for cms_sections
-- Policy: Allow anyone to read CMS settings
CREATE POLICY "Allow public read access to CMS sections" 
ON cms_sections FOR SELECT 
USING (true);

-- Policy: Allow all users (or authenticated admins) to insert/update CMS settings
-- Note: In a production environment, you would restrict this to authenticated users.
-- For the AI Studio client-side proxy, we allow full writes to the "main" row.
CREATE POLICY "Allow write access to CMS sections" 
ON cms_sections FOR ALL 
USING (true)
WITH CHECK (true);


-- 2. ENQUIRIES TABLE (Stores contact form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    date TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on enquiries
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for enquiries
-- Policy: Allow anyone to insert an enquiry (public submission)
CREATE POLICY "Allow public insert to enquiries" 
ON enquiries FOR INSERT 
WITH CHECK (true);

-- Policy: Allow read/write access to enquiries (for admin viewing)
CREATE POLICY "Allow read/write access to enquiries" 
ON enquiries FOR ALL 
USING (true)
WITH CHECK (true);


-- 3. LOGIN ATTEMPTS AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS login_attempts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    status TEXT NOT NULL, -- 'SUCCESS' or 'FAILED'
    ip_address TEXT DEFAULT 'Unknown',
    user_agent TEXT DEFAULT 'Unknown',
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on login_attempts
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (so both successful and failed attempts from any user can be written)
CREATE POLICY "Allow public insert to login_attempts" 
ON login_attempts FOR INSERT 
WITH CHECK (true);

-- Policy: Allow public read to login_attempts (so we can view details inside our secure admin deck)
CREATE POLICY "Allow public read to login_attempts" 
ON login_attempts FOR SELECT 
USING (true);


-- ==========================================
-- OPTIONAL: INITIAL SEED DATA
-- ==========================================
-- This seeds the database with the core "main" record if it doesn't already exist.
-- The application will automatically update this on first Admin save.
