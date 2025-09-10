import { useMemo, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { Banknote } from 'lucide-react'
import { useCalculatorUtils, useGetFullRates } from '@/lib/utils/calculator.utils'
import { subscriptionStore } from '@/store/subscriptionStore'
import getSymbolFromCurrency from 'currency-symbol-map'
import { useQuery } from '@tanstack/react-query'

const RatesElement = () => {
  const { displayCurrency } = useStore(subscriptionStore, (state) => state)
  const { formatCurrency } = useCalculatorUtils()
  const { data: ratesBySymbol, isLoading, isError } = useGetFullRates(displayCurrency);
  const [currencyFilter, setCurrencyFilter] = useState<string>('');

  const actualRates = useMemo(() => ratesBySymbol?.rates || [], [ratesBySymbol]);
  console.log("🚀 ~ RatesElement ~ actualRates:", actualRates)

  const displayRates = useMemo(() => {
    return (
      (actualRates &&
        Object.entries(actualRates)
          .map(([key, value]) => {
            return {
              cur: key,
              rate: value as number,
              symbol: getSymbolFromCurrency(key),
            }
          })
          .filter((crr) => crr.cur !== displayCurrency &&
            (currencyFilter ? crr.cur.toLowerCase().includes(currencyFilter.toLowerCase()) : true)))
      || []
    )
  }, [actualRates, displayCurrency, currencyFilter])


  return (
    <div className="RatesElement-component backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-6 px-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center max-md:gap-y-4 md:justify-between mb-4">
        <div className='flex items-center gap-x-1 md:basis-1/2'>
          <Banknote className="text-white w-5 h-5 mr-2" />
          <h3 className="text-white font-semibold flex items-center text-2xl">
            Currency rate
          </h3>
        </div>
        <input
          className='border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm basis-full md:basis-1/2'
          type="search"
          value={currencyFilter}
          onInput={(e) => setCurrencyFilter((e.target as HTMLInputElement).value)}
          placeholder='Find currency ...'
        />
      </div>

      <section className="text-white grid grid-cols-2 md:grid-cols-4 gap-4 mb-2 max-h-48 overflow-y-auto">
        {isLoading && <p>Loading rates...</p>}
        {isError && <p>Error fetching rates.</p>}
        {displayRates &&
          displayRates.map((cr) => (
            <div
              className='flex items-center gap-2 text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm'
              key={cr.cur}
            >
              <span>{cr.cur}</span>
              <span>{formatCurrency(cr.rate, cr.cur, cr.symbol || '$')}</span>
            </div>
          ))}
      </section>
    </div>
  )
}

export default RatesElement
