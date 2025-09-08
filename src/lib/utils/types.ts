export const AvailableCurrencies = ['USD', 'EUR', 'UAH']

export type CurrencyValue = typeof AvailableCurrencies[number]
export type CurrencyArray = CurrencyValue[]