export const AvailableCurrencies = ['USD', 'EUR', 'UAH']

export type CurrencyValue = (typeof AvailableCurrencies)[number]
export type CurrencyArray = Array<CurrencyValue>

// Define the shape of a subscription
export interface ISubscription {
  name: string
  price: number
  period: 'monthly' | 'yearly'
  currency: CurrencyValue 
}
