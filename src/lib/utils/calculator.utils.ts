import { Types } from '@/lib/utils'

const periods = {
  weekly: { multiplier: 52, label: 'Weekly' },
  monthly: { multiplier: 12, label: 'Monthly' },
  quarterly: { multiplier: 4, label: 'Quarterly' },
  'half-yearly': { multiplier: 2, label: 'Half-yearly' },
  yearly: { multiplier: 1, label: 'Yearly' },
}

export type CurrencyInfo = {
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

// NOTE: Convert sum to current currency equivalent
const convertSumWithCurrencyRate = (sum: number, currencyCode: Types.CurrencyValue) =>
  sum / currencies[currencyCode].rate

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
    return currencies
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.error('Error while getting rates from API', error?.message)
    } else {
      console.error('Error while getting rates from API', error)
    }
  }
} //

const calculateYearlyCost = (
  sub: Types.ISubscription,
  displayCurrency: Types.CurrencyValue,
) => {
  // Convert subscription price to the base currency (USD)
  const priceInBaseCurrency = sub.price * currencies[sub.currency].rate
  // Convert from base currency to the selected display currency
  const priceInDisplayCurrency =
    priceInBaseCurrency / currencies[displayCurrency].rate
  return priceInDisplayCurrency * periods[sub.period].multiplier
}

const getTotalCosts = (
  subscriptionsArray: Array<Types.ISubscription>,
  displayCurrency: Types.CurrencyValue,
  projectionYears: number,
) => {
  const yearlyTotal =
    subscriptionsArray &&
    subscriptionsArray.reduce((total, sub) => {
      return total + calculateYearlyCost(sub, displayCurrency)
    }, 0)

  return {
    yearly: yearlyTotal,
    projection: yearlyTotal * projectionYears,
    monthly: yearlyTotal / 12,
  }
}

const getInsights = (
  subscriptions: Array<Types.ISubscription>,
  displayCurrency: Types.CurrencyValue,
  projectionYears: number,
) => {
  const totals = getTotalCosts(subscriptions, displayCurrency, projectionYears)
  const vacationCost = 3000 // Average vacation cost
  const yearsForVacation =
    totals.yearly > 0
      ? Math.ceil(
          convertSumWithCurrencyRate(vacationCost, displayCurrency) /
            totals.yearly,
        )
      : 0

  return {
    vacationEquivalent: yearsForVacation,
    dailyCost: totals.yearly / 365,
    coffeeEquivalent:
      totals.yearly > 0
        ? Math.floor(
            totals.yearly /
              (convertSumWithCurrencyRate(3, displayCurrency) * 365),
          )
        : 0, // $3 coffee
  }
}

export const useCalculatorUtils = () => {
  const formatCurrency = (amount: number, currencyCode: Types.CurrencyValue) => {
    const symbol = currencies[currencyCode].symbol
    return `${symbol}${amount.toFixed(2)}`
  }

  return {
    periods,
    currencies,
    formatCurrency,
    getAPIRates,
    $cr: convertSumWithCurrencyRate,
    calculateYearlyCost,
    getTotalCosts,
    getInsights,
  }
}
