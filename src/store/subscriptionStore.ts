import { Store } from '@tanstack/store'
import type { IDomain, Types  } from '@/lib/utils';
import type { ISubscription } from '@/lib/utils/types'
import type { User } from '@supabase/supabase-js'
import { popularServices } from '@/lib/utils/constants'
import { supabase } from '@/lib/supabaseClient'

export type TCurrency = Types.CurrencyValue

// Define the shape of the store's state
interface SubscriptionStoreState {
  popularServices: Array<ISubscription>
  subscriptions: Array<ISubscription>
  isPendingSubscriptions: boolean
  domains: Array<IDomain>
  displayCurrency: TCurrency
  newDomain: IDomain
}

const initialDomainState: IDomain = {
  name: '',
  provider: 'Cloudflare',
  expiry_date: '',
  renewal_cost: '',
  auto_renewal: false,
}

// Define the default state
const defaultState: SubscriptionStoreState = {
  popularServices,
  subscriptions: [],
  isPendingSubscriptions: false,
  domains: [],
  displayCurrency: 'USD',
  newDomain: initialDomainState,
}

// Create the store with the initial state
export const subscriptionStore = new Store<SubscriptionStoreState>(defaultState)

// --- Actions to manipulate the store ---

/**
 * Fetches subscriptions from Supabase and updates the store.
 */
export const fetchSubscriptions = async (user: User) => {
  if (!user) return

  let isLoading = true
  let subsData: Array<any> = []

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching subscriptions:', error)
      throw new Error(error.message || error?.details)
    }
    subsData = data
  } catch (error: unknown) {
    isLoading = false
  } finally {
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: subsData || [],
      isPendingSubscriptions: isLoading,
    }))
  }
}

/**
 * Adds a new subscription to the user's list and Supabase.
 * @param subscription The subscription to add.
 */
export const addSubscription = async (subscription: ISubscription) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{ ...subscription, user_id: user.id }])
    .select()

  if (error) {
    console.error('Error adding subscription:', error)
    return
  }

  if (data) {
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: [...state.subscriptions, data[0]],
    }))
  }
}

/**
 * Removes a subscription from the user's list and Supabase by its name.
 * @param subscriptionName The name of the subscription to remove.
 */
export const removeSubscription = async (subscriptionName: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const subToRemove = subscriptionStore.state.subscriptions.find(
    (s) => s.name === subscriptionName,
  )
  if (!subToRemove) return

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', subToRemove.id)

  if (error) {
    console.error('Error removing subscription:', error)
    return
  }

  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: state.subscriptions.filter(
      (s) => s.name !== subscriptionName,
    ),
  }))
}

/**
 * Updates an existing subscription in the user's list and Supabase.
 * @param subscriptionName The name of the subscription to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateSubscription = async (
  subscriptionName: string,
  updatedValues: Partial<ISubscription>,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const subToUpdate = subscriptionStore.state.subscriptions.find(
    (s) => s.name === subscriptionName,
  )
  if (!subToUpdate) return

  const { data, error } = await supabase
    .from('subscriptions')
    .update(updatedValues)
    .eq('id', subToUpdate.id)
    .select()

  if (error) {
    console.error('Error updating subscription:', error)
    return
  }

  if (data) {
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: state.subscriptions.map((s) =>
        s.name === subscriptionName ? data[0] : s,
      ),
    }))
  }
}

/**
 * Updates the display currency.
 * @param currency The new currency to set.
 */
export const updateDisplayCurrency = (currency: TCurrency) => {
  subscriptionStore.setState((state) => ({
    ...state,
    displayCurrency: currency,
  }))
}

// SECTION: Domains
/**
 * Sets the new domain form state.
 * @param domain The new domain state.
 */
export const setNewDomain = (domain: IDomain) => {
  subscriptionStore.setState((state) => ({
    ...state,
    newDomain: domain,
  }))
}

/**
 * Fetches domains from Supabase and updates the store.
 */
export const fetchDomains = async (user: User) => {
  if (!user) return

  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching domains:', error)
    return
  }

  subscriptionStore.setState((state) => ({
    ...state,
    domains: data || [],
  }))
}

/**
 * Adds a new domain to Supabase and updates the store.
 * @param domain The domain to add.
 */
export const addDomainToSupabase = async (domain: IDomain) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const domainToInsert = {
    ...domain,
    user_id: user.id,
    renewal_cost: domain.renewal_cost || '0',
  }

  const { data, error } = await supabase
    .from('domains')
    .insert([domainToInsert])
    .select()

  if (error) {
    console.error('Error adding domain:', error)
    return
  }

  if (data) {
    subscriptionStore.setState((state) => ({
      ...state,
      domains: [...state.domains, data[0]],
    }))
  }
}

/**
 * Removes a domain from Supabase and updates the store.
 * @param domainId The id of the domain to remove.
 */
export const removeDomainFromSupabase = async (domainId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.from('domains').delete().eq('id', domainId)

  if (error) {
    console.error('Error removing domain:', error)
    return
  }

  subscriptionStore.setState((state) => ({
    ...state,
    domains: state.domains.filter((d) => d.id !== domainId),
  }))
}

/**
 * Updates an existing domain in Supabase and updates the store.
 * @param domainId The id of the domain to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateDomainInSupabase = async (
  domainId: string,
  updatedValues: Partial<IDomain>,
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('domains')
    .update(updatedValues)
    .eq('id', domainId)
    .select()

  if (error) {
    console.error('Error updating domain:', error)
    return
  }

  if (data) {
    subscriptionStore.setState((state) => ({
      ...state,
      domains: state.domains.map((d) => (d.id === domainId ? data[0] : d)),
    }))
  }
}

/**
 * Adds a new domain to the user's list and Supabase.
 */
export const addDomain = async () => {
  const domainToAdd = subscriptionStore.state.newDomain
  if (!domainToAdd.name) return

  const newDomain = {
    ...domainToAdd,
    id: (Date.now() + Math.random()).toString(),
    renewal_cost: domainToAdd.renewal_cost || '0',
  }

  await addDomainToSupabase(newDomain)

  subscriptionStore.setState((state) => ({
    ...state,
    newDomain: initialDomainState, // Reset form
  }))
}

/**
 * Removes a domain from the user's list and Supabase by its id.
 * @param domainId The id of the domain to remove.
 */
export const removeDomain = async (domainId: string) => {
  await removeDomainFromSupabase(domainId)
}
