import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key are required.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
