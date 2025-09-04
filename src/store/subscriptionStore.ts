import { Store } from '@tanstack/store';

// Define the shape of a subscription
export interface Subscription {
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
}

// Define the shape of the store's state
interface SubscriptionStoreState {
  popularServices: Subscription[];
  subscriptions: Subscription[];
}

// A list of popular services that can be used as suggestions
const popularServices: Subscription[] = [
  { name: 'Netflix', price: 15.49, period: 'monthly' },
  { name: 'Spotify', price: 10.99, period: 'monthly' },
  { name: 'Disney+', price: 7.99, period: 'monthly' },
  { name: 'Amazon Prime', price: 139, period: 'yearly' },
  { name: 'Apple Music', price: 10.99, period: 'monthly' },
  { name: 'YouTube Premium', price: 13.99, period: 'monthly' },
  { name: 'Adobe Creative Cloud', price: 52.99, period: 'monthly' },
  { name: 'Microsoft 365', price: 69.99, period: 'yearly' },
  { name: 'Dropbox', price: 9.99, period: 'monthly' },
  { name: 'Canva Pro', price: 119.99, period: 'yearly' },
];

// Define the default state
const defaultState: SubscriptionStoreState = {
  popularServices,
  subscriptions: [],
};

// Function to safely get the initial state from localStorage
const getInitialState = (): SubscriptionStoreState => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedState = localStorage.getItem('subscription_store');
    if (storedState) {
      try {
        // Merge the stored state with the default state to ensure all keys are present
        return { ...defaultState, ...JSON.parse(storedState) };
      } catch (error) {
        console.error('Error parsing state from localStorage:', error);
        return defaultState;
      }
    }
  }
  return defaultState;
};

// Create the store with the initial state
export const subscriptionStore = new Store<SubscriptionStoreState>(getInitialState());

// Subscribe to store changes to persist the entire state to localStorage
subscriptionStore.subscribe(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const state = subscriptionStore.state;
    localStorage.setItem('subscription_store', JSON.stringify(state));
  }
});

// --- Actions to manipulate the store ---

/**
 * Adds a new subscription to the user's list.
 * @param subscription The subscription to add.
 */
export const addSubscription = (subscription: Subscription) => {
  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: [...state.subscriptions, subscription],
  }));
};

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
  }));
};

/**
 * Updates an existing subscription.
 * @param subscriptionName The name of the subscription to update.
 * @param updatedValues An object containing the properties to update.
 */
export const updateSubscription = (
  subscriptionName: string,
  updatedValues: Partial<Subscription>,
) => {
  subscriptionStore.setState((state) => ({
    ...state,
    subscriptions: state.subscriptions.map((s) =>
      s.name === subscriptionName ? { ...s, ...updatedValues } : s,
    ),
  }));
};




