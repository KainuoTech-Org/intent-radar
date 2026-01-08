import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

// During build time, if env vars are missing, we provide placeholders to prevent crashes.
// Real values must be provided in Vercel/production environment.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
