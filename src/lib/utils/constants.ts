import type { ISubscription } from '@/lib/utils/types'

// A list of popular services that can be used as suggestions
export const popularServices: Array<ISubscription> = [
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
