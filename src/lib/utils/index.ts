import type { Currency } from '@/store/subscriptionStore'

const periods = {
  weekly: { multiplier: 52, label: 'Weekly' },
  monthly: { multiplier: 12, label: 'Monthly' },
  quarterly: { multiplier: 4, label: 'Quarterly' },
  'half-yearly': { multiplier: 2, label: 'Half-yearly' },
  yearly: { multiplier: 1, label: 'Yearly' },
}

type CurrencyInfo = {
  symbol: string
  rate: number
}

const currencies: Record<string, CurrencyInfo> = {
  USD: { symbol: '$', rate: 1 }, // Base currency
  EUR: { symbol: '€', rate: 1.08 }, // 1 EUR = 1.08 USD
  UAH: { symbol: '₴', rate: 0.025 }, // 1 UAH = 0.025 USD
}

/**
 * NOTE: API Currencies RATE
 * conversion_rates
 */
/**
 * TODO: Change to 6v API and change
 * field: rates => conversion_rates
 * and add other currencies
 **/
const getAPIRates = async () => {
  try {
    const response = await fetch(
      ' https://api.exchangerate-api.com/v4/latest/USD',
    )
    const lastRates = await response.json()

    for (const key of Object.keys(currencies)) {
      const currencyRate = lastRates?.rates?.[key]
      if (currencyRate) {
        currencies[key].rate = Number(1 / currencyRate)
      }
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error while getting rates from API', error?.message)
    } else {
      console.error('Error while getting rates from API', error)
    }
  }
} //

export const useCalculatorUtils = () => {
  const formatCurrency = (amount: number, currencyCode: Currency) => {
    const symbol = currencies[currencyCode].symbol
    return `${symbol}${amount.toFixed(2)}`
  }

  // NOTE: Convert sum to current currency equivalent
  const convertSumWithCurrencyRate = (sum: number, currencyCode: Currency) =>
    sum / currencies[currencyCode].rate

  return {
    periods,
    currencies,
    formatCurrency,
    getAPIRates,
    $cr: convertSumWithCurrencyRate,
  }
}
