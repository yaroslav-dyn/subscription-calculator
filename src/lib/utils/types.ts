export const AvailableCurrencies = ['USD', 'EUR', 'UAH']

export type CurrencyValue = (typeof AvailableCurrencies)[number]
export type CurrencyArray = Array<CurrencyValue>

// Define the shape of a subscription
export interface ISubscription {
  id?: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  currency: CurrencyValue
}

export interface IMessageDrawerData {
  status: boolean
  message: string
  type?: 'DEFAULT' | 'ERROR' | 'WARNING' | 'SUCCESS'
  countdown?: number
}
