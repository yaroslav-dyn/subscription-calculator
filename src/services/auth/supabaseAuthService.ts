import { supabase } from '@/lib/supabaseClient'
import type { IAuthService, AppUser } from './types'

function getSupabase() {
  if (!supabase) throw new Error('Supabase client is not initialized')
  return supabase
}

function mapUser(user: any): AppUser | null {
  if (!user) return null
  return {
    id: user.id,
    email: user.email,
    app_metadata: user.app_metadata,
  }
}

export const supabaseAuthService: IAuthService = {
  async getUser() {
    const { data, error } = await getSupabase().auth.getUser()
    if (error) {
      console.error('Error getting user:', error.message)
      return null
    }
    return mapUser(data.user)
  },

  async signOut() {
    const { error } = await getSupabase().auth.signOut()
    if (error) throw error
  },

  onAuthStateChange(callback) {
    const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
      callback(mapUser(session?.user ?? null))
    })
    return () => data.subscription.unsubscribe()
  },

  async signInWithPassword(credentials) {
    const { error } = await getSupabase().auth.signInWithPassword(credentials)
    return { error: error ?? undefined }
  },

  async signInWithOAuth(options) {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: options.provider as any,
      options: { redirectTo: options.redirectTo },
    })
    return { error: error ?? undefined }
  },

  async signUp(credentials) {
    const { error } = await getSupabase().auth.signUp(credentials)
    return { error: error ?? undefined }
  },
}
