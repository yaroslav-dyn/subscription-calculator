import { Store } from '@tanstack/store'
import { type IDomain, Types } from '@/lib/utils'
import type { ISubscription } from '@/lib/utils/types'
import { popularServices } from '@/lib/utils/constants'
import { supabase } from '@/lib/supabaseClient'

export type TCurrency = Types.CurrencyValue

// Define the shape of the store's state
interface SubscriptionStoreState {
  popularServices: Array<ISubscription>
  subscriptions: Array<ISubscription>
  domains: Array<IDomain>
  displayCurrency: TCurrency
  newDomain: IDomain
  settingsPanelStatus: boolean
  showRatesStatus: boolean
  showDomainStatus: boolean
}

const initialDomainState: IDomain = {
  name: '',
  provider: 'Cloudflare',
  expiryDate: '',
  renewalCost: '',
  autoRenewal: false,
}

// Define the default state
const defaultState: SubscriptionStoreState = {
  popularServices,
  subscriptions: [],
  domains: [],
  displayCurrency: 'USD',
  newDomain: initialDomainState,
  settingsPanelStatus: true,
  showRatesStatus: false,
  showDomainStatus: false,
}

// Create the store with the initial state
export const subscriptionStore = new Store<SubscriptionStoreState>(defaultState)

// --- Actions to manipulate the store ---

/**
 * Fetches subscriptions from Supabase and updates the store.
 */
export const fetchSubscriptions = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching subscriptions:', error)
    return
  }

  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: data || [],
  }))
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

// SECTION: Panels showing status
export const updateSettingsPanelStatus = (status: boolean) => {
  subscriptionStore.setState((state) => ({
    ...state,
    settingsPanelStatus: status,
  }))
}

export const updateShowRatesStatus = (status: boolean) => {
  subscriptionStore.setState((state) => ({
    ...state,
    showRatesStatus: status,
  }))
}

export const updateShowDomainStatus = (status: boolean) => {
  subscriptionStore.setState((state) => ({
    ...state,
    showDomainStatus: status,
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
 * Adds a new domain to the user's list.
 */
export const addDomain = () => {
  subscriptionStore.setState((state) => {
    const newDomain = {
      ...state.newDomain,
      id: (Date.now() + Math.random()).toString(),
      renewalCost: state.newDomain.renewalCost || '0',
    }
    return {
      ...state,
      domains: [...state.domains, newDomain],
      newDomain: initialDomainState, // Reset form
    }
  })
}

/**
 * Removes a domain from the user's list by its id.
 * @param domainId The id of the domain to remove.
 */
export const removeDomain = (domainId: string) => {
  subscriptionStore.setState((state) => ({
    ...state,
    domains: state.domains.filter((d) => d.id !== domainId),
  }))
}
