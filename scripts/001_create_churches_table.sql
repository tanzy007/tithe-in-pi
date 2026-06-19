-- Create churches table for Tithe in Pi
CREATE TABLE IF NOT EXISTS churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  denomination TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  website TEXT,
  email TEXT NOT NULL,
  description TEXT,
  wallet_address TEXT,
  kyb_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_churches_city ON churches(city);
CREATE INDEX IF NOT EXISTS idx_churches_denomination ON churches(denomination);
CREATE INDEX IF NOT EXISTS idx_churches_kyb_status ON churches(kyb_status);
CREATE INDEX IF NOT EXISTS idx_churches_wallet_address ON churches(wallet_address);
