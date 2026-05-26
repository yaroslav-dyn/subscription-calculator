import { Store } from '@tanstack/store'
import type { IDomain, Types } from '@/lib/utils';
import type { ISubscription } from '@/lib/utils/types'
import type { AppUser } from '@/services/auth'
import { popularServices } from '@/lib/utils/constants'
import { dataService } from '@/services/data'
import { authService } from '@/services/auth'

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
 * Fetches subscriptions from the data service and updates the store.
 */
export const fetchSubscriptions = async (user: AppUser) => {
  if (!user) return

  let isLoading = true
  let subsData: Array<ISubscription> = []

  try {
    subsData = await dataService.fetchSubscriptions(user.id)
  } catch (error: unknown) {
    console.error('Error fetching subscriptions:', error)
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
 * Adds a new subscription to the user's list and the data service.
 * @param subscription The subscription to add.
 */
export const addSubscription = async (subscription: ISubscription) => {
  const user = await authService.getUser()
  if (!user) return

  try {
    const newSub = await dataService.addSubscription(subscription, user.id)
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: [...state.subscriptions, newSub],
    }))
  } catch (error) {
    console.error('Error adding subscription:', error)
  }
}

/**
 * Removes a subscription from the user's list and the data service by its name.
 * @param subscriptionName The name of the subscription to remove.
 */
export const removeSubscription = async (subscriptionName: string) => {
  const subToRemove = subscriptionStore.state.subscriptions.find(
    (s) => s.name === subscriptionName,
  )
  if (!subToRemove?.id) return

  try {
    await dataService.removeSubscription(subToRemove.id)
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: state.subscriptions.filter(
        (s) => s.name !== subscriptionName,
      ),
    }))
  } catch (error) {
    console.error('Error removing subscription:', error)
  }
}

/**
 * Updates an existing subscription in the user's list and the data service.
 * @param subscriptionName The name of the subscription to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateSubscription = async (
  subscriptionName: string,
  updatedValues: Partial<ISubscription>,
) => {
  const subToUpdate = subscriptionStore.state.subscriptions.find(
    (s) => s.name === subscriptionName,
  )
  if (!subToUpdate?.id) return

  try {
    const updated = await dataService.updateSubscription(subToUpdate.id, updatedValues)
    subscriptionStore.setState((state) => ({
      ...state,
      subscriptions: state.subscriptions.map((s) =>
        s.name === subscriptionName ? updated : s,
      ),
    }))
  } catch (error) {
    console.error('Error updating subscription:', error)
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
 * Fetches domains from the data service and updates the store.
 */
export const fetchDomains = async (user: AppUser) => {
  if (!user) return

  try {
    const domains = await dataService.fetchDomains(user.id)
    subscriptionStore.setState((state) => ({
      ...state,
      domains: domains || [],
    }))
  } catch (error) {
    console.error('Error fetching domains:', error)
  }
}

/**
 * Adds a new domain to the data service and updates the store.
 * @param domain The domain to add.
 */
export const addDomainToSupabase = async (domain: IDomain) => {
  const user = await authService.getUser()
  if (!user) return

  const domainToInsert = {
    ...domain,
    user_id: user.id,
    renewal_cost: domain.renewal_cost || '0',
  }

  try {
    const newDomain = await dataService.addDomain(domainToInsert, user.id)
    subscriptionStore.setState((state) => ({
      ...state,
      domains: [...state.domains, newDomain],
    }))
  } catch (error) {
    console.error('Error adding domain:', error)
  }
}

/**
 * Removes a domain from the data service and updates the store.
 * @param domainId The id of the domain to remove.
 */
export const removeDomainFromSupabase = async (domainId: string) => {
  try {
    await dataService.removeDomain(domainId)
    subscriptionStore.setState((state) => ({
      ...state,
      domains: state.domains.filter((d) => d.id !== domainId),
    }))
    return { success: true }
  } catch (error: unknown) {
    console.error('Error removing domain:', error)
    return { success: false, error }
  }
}

/**
 * Updates an existing domain in the data service and updates the store.
 * @param domainId The id of the domain to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateDomainInSupabase = async (
  domainId: string,
  updatedValues: Partial<IDomain>,
) => {
  try {
    const updated = await dataService.updateDomain(domainId, updatedValues)
    subscriptionStore.setState((state) => ({
      ...state,
      domains: state.domains.map((d) => (d.id === domainId ? updated : d)),
    }))
  } catch (error) {
    console.error('Error updating domain:', error)
  }
}

/**
 * Adds a new domain to the user's list and the data service.
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
 * Removes a domain from the user's list and the data service by its id.
 * @param domainId The id of the domain to remove.
 */
export const removeDomain = async (domainId: string) => {
  const res = await removeDomainFromSupabase(domainId)
  return res
}
