import { createBrowserClient } from "@supabase/ssr"


const SUPABASE_URL = "https://olfuqxvmcbuohdyyuvyh.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZnVxeHZtY2J1b2hkeXl1dnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTkxMTQsImV4cCI6MjA3OTc3NTExNH0.GaSoAA02WPBl732kzWTSRb6LQFyXbiRRKmAWX78i-mA"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  )

  return supabaseClient
}

export type TrustLevel = 'listed' | 'pi_ready' | 'pending' | 'verified' | 'highly_verified'

export type Church = {
  id: string
  name: string
  denomination: string | null
  city: string
  country: string
  website: string | null
  email: string
  description: string | null
  wallet_address: string | null
  kyb_status: boolean
  onboarding_step: number
  onboarding_completed: boolean
  created_at: string
  // Trust level system
  trust_level: TrustLevel
  wallet_confirmed: boolean
  verification_method: string | null
  leader_name: string | null
  leader_title: string | null
  charity_number: string | null
  physical_address: string | null
  last_updated: string | null
}

export const TRUST_LEVEL_ORDER: Record<TrustLevel, number> = {
  highly_verified: 1,
  verified: 2,
  pending: 3,
  pi_ready: 4,
  listed: 5,
}

export const TRUST_LEVEL_LABELS: Record<TrustLevel, string> = {
  highly_verified: 'Highly Verified',
  verified: 'Verified',
  pending: 'Pending Review',
  pi_ready: 'Pi-Ready',
  listed: 'Listed',
}

export const TRUST_LEVEL_DESCRIPTIONS: Record<TrustLevel, string> = {
  highly_verified: 'Additional official credentials confirmed (charity registration, KYB, etc.)',
  verified: 'Organization and wallet independently confirmed by Tithe in Pi',
  pending: 'Verification proof submitted — awaiting independent review',
  pi_ready: 'Wallet address added but not yet verified',
  listed: 'Basic information provided by the ministry — not yet verified',
}
