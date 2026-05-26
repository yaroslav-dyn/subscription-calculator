import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { isLocalMode } from '@/services/config'

export let supabase: SupabaseClient | null = null

if (!isLocalMode) {
  const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required.')
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
}
