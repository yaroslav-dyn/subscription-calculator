import { type IDomain,Types } from '@/lib/utils'
import { Store } from '@tanstack/store'

export type TCurrency = Types.CurrencyValue

// Define the shape of a subscription
export interface ISubscription {
  name: string
  price: number
  period: 'monthly' | 'yearly'
  currency: TCurrency
}

// Define the shape of the store's state
interface SubscriptionStoreState {
  popularServices: Array<ISubscription>
  subscriptions: Array<ISubscription>
  domains: Array<IDomain>
  displayCurrency: TCurrency
  newDomain: IDomain
}

// A list of popular services that can be used as suggestions
const popularServices: Array<ISubscription> = [
  { name: 'Netflix', price: 15.49, period: 'monthly', currency: 'USD' },
  { name: 'Spotify', price: 10.99, period: 'monthly', currency: 'USD' },
  { name: 'Disney+', price: 7.99, period: 'monthly', currency: 'USD' },
  { name: 'Amazon Prime', price: 139, period: 'yearly', currency: 'USD' },
  { name: 'Apple Music', price: 10.99, period: 'monthly', currency: 'USD' },
  { name: 'YouTube Premium', price: 13.99, period: 'monthly', currency: 'USD' },
  {
    name: 'Adobe Creative Cloud',
    price: 52.99,
    period: 'monthly',
    currency: 'USD',
  },
  { name: 'Microsoft 365', price: 69.99, period: 'yearly', currency: 'USD' },
  { name: 'Dropbox', price: 9.99, period: 'monthly', currency: 'USD' },
  { name: 'Canva Pro', price: 119.99, period: 'yearly', currency: 'USD' },
]

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
}

// Function to safely get the initial state from localStorage
const getInitialState = (): SubscriptionStoreState => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedState = localStorage.getItem('subscription_store')
    if (storedState) {
      try {
        // Merge the stored state with the default state to ensure all keys are present
        return { ...defaultState, ...JSON.parse(storedState) }
      } catch (error) {
        console.error('Error parsing state from localStorage:', error)
        return defaultState
      }
    }
  }
  return defaultState
}

// Create the store with the initial state
export const subscriptionStore = new Store<SubscriptionStoreState>(
  getInitialState(),
)

// Subscribe to store changes to persist the entire state to localStorage
subscriptionStore.subscribe(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const state = subscriptionStore.state
    localStorage.setItem('subscription_store', JSON.stringify(state))
  }
})

// --- Actions to manipulate the store ---

/**
 * Adds a new subscription to the user's list.
 * @param subscription The subscription to add.
 */
export const addSubscription = (subscription: ISubscription) => {
  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: [...state.subscriptions, subscription],
  }))
}

/**
 * Removes a subscription from the user's list by its name.
 * @param subscriptionName The name of the subscription to remove.
 */
export const removeSubscription = (subscriptionName: string) => {
  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: state.subscriptions.filter(
      (s) => s.name !== subscriptionName,
    ),
  }))
}

/**
 * Updates an existing subscription.
 * @param subscriptionName The name of the subscription to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateSubscription = (
  subscriptionName: string,
  updatedValues: Partial<ISubscription>,
) => {
  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: state.subscriptions.map((s) =>
      s.name === subscriptionName ? { ...s, ...updatedValues } : s,
    ),
  }))
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
