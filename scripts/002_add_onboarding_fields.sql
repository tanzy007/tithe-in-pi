-- Add onboarding fields to churches table
ALTER TABLE churches 
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Create index for onboarding status
CREATE INDEX IF NOT EXISTS idx_churches_onboarding_completed ON churches(onboarding_completed);
