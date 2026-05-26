import { supabase } from '@/lib/supabaseClient'
import type { IDataService } from './types'
import type { ISubscription } from '@/lib/utils/types'
import type { IDomain } from '@/lib/utils/domain.utils'

function getSupabase() {
  if (!supabase) throw new Error('Supabase client is not initialized')
  return supabase
}

export const supabaseDataService: IDataService = {
  async fetchSubscriptions(userId: string) {
    const { data, error } = await getSupabase()
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching subscriptions:', error)
      throw new Error(error.message || error.details)
    }
    return data || []
  },

  async addSubscription(sub: ISubscription, userId: string) {
    const { data, error } = await getSupabase()
      .from('subscriptions')
      .insert([{ ...sub, user_id: userId }])
      .select()

    if (error) {
      console.error('Error adding subscription:', error)
      throw error
    }
    return data![0]
  },

  async removeSubscription(id: string) {
    const { error } = await getSupabase()
      .from('subscriptions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error removing subscription:', error)
      throw error
    }
  },

  async updateSubscription(id: string, values: Partial<ISubscription>) {
    const { data, error } = await getSupabase()
      .from('subscriptions')
      .update(values)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating subscription:', error)
      throw error
    }
    return data![0]
  },

  async fetchDomains(userId: string) {
    const { data, error } = await getSupabase()
      .from('domains')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching domains:', error)
      throw new Error(error.message || error.details)
    }
    return data || []
  },

  async addDomain(domain: IDomain, userId: string) {
    const domainToInsert = {
      ...domain,
      user_id: userId,
      renewal_cost: domain.renewal_cost || '0',
    }

    const { data, error } = await getSupabase()
      .from('domains')
      .insert([domainToInsert])
      .select()

    if (error) {
      console.error('Error adding domain:', error)
      throw error
    }
    return data![0]
  },

  async removeDomain(id: string) {
    const { error } = await getSupabase().from('domains').delete().eq('id', id)

    if (error) {
      console.error('Error removing domain:', error)
      throw error
    }
  },

  async updateDomain(id: string, values: Partial<IDomain>) {
    const { data, error } = await getSupabase()
      .from('domains')
      .update(values)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating domain:', error)
      throw error
    }
    return data![0]
  },
}
