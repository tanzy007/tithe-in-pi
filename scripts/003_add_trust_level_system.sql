-- Migration: Add tiered trust level system
-- Run this in your Supabase SQL editor

ALTER TABLE churches
ADD COLUMN IF NOT EXISTS trust_level TEXT DEFAULT 'listed',
ADD COLUMN IF NOT EXISTS wallet_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_method TEXT,
ADD COLUMN IF NOT EXISTS leader_name TEXT,
ADD COLUMN IF NOT EXISTS leader_title TEXT,
ADD COLUMN IF NOT EXISTS charity_number TEXT,
ADD COLUMN IF NOT EXISTS physical_address TEXT,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to have trust_level based on current state
UPDATE churches SET trust_level = 'pi_ready' WHERE wallet_address IS NOT NULL AND wallet_address != '';
UPDATE churches SET trust_level = 'listed' WHERE wallet_address IS NULL OR wallet_address = '';
UPDATE churches SET trust_level = 'verified', wallet_confirmed = true WHERE onboarding_completed = true;

-- Add index for trust_level filtering/sorting
CREATE INDEX IF NOT EXISTS idx_churches_trust_level ON churches(trust_level);
CREATE INDEX IF NOT EXISTS idx_churches_last_updated ON churches(last_updated);

-- Trust level sort order helper (for reference):
-- highly_verified = 1, verified = 2, pending = 3, pi_ready = 4, listed = 5

-- RLS Policies (run these if RLS is enabled on your table)
-- Allow anyone to read churches
CREATE POLICY IF NOT EXISTS "Allow public read" ON churches FOR SELECT TO anon USING (true);
-- Allow anyone to insert (registration)
CREATE POLICY IF NOT EXISTS "Allow public insert" ON churches FOR INSERT TO anon WITH CHECK (true);
-- Allow anyone to update (onboarding) - lock this down later with auth
CREATE POLICY IF NOT EXISTS "Allow public update" ON churches FOR UPDATE TO anon USING (true) WITH CHECK (true);
