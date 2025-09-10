import { useMemo, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { Banknote } from 'lucide-react'
import { useCalculatorUtils, useGetFullRates } from '@/lib/utils/calculator.utils'
import { subscriptionStore } from '@/store/subscriptionStore'
import getSymbolFromCurrency from 'currency-symbol-map'
import CurrencySelectElement from '@/components/ui/CurrencySelect/CurrencySelect'

interface IRatesTypes {
  classes?: string
  hidePanelHeading?: boolean
  isPage?: boolean
}

const RatesElement = ({ classes = '', hidePanelHeading, isPage }: IRatesTypes) => {
  const { displayCurrency } = useStore(subscriptionStore, (state) => state)
  const { formatCurrency } = useCalculatorUtils()
  const { data: ratesBySymbol, isLoading, isError } = useGetFullRates(displayCurrency);
  const [currencyFilter, setCurrencyFilter] = useState<string>('');
  
  const [coefficiant, setCoefficiant] = useState<number>(1);

  const containerClasses = `RatesElement-component backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-6 px-6 shadow-xl ${classes}`

  const actualRates = useMemo(() => ratesBySymbol?.rates || [], [ratesBySymbol]);

  const displayRates = useMemo(() => {
    return (
      (actualRates &&
        Object.entries(actualRates)
          .map(([key, value]) => {
            return {
              cur: key,
              rate: value as number * (coefficiant || 1),
              symbol: getSymbolFromCurrency(key),
            }
          })
          .filter((crr) => crr.cur !== displayCurrency &&
            (currencyFilter ? crr.cur.toLowerCase().includes(currencyFilter.toLowerCase()) : true)))
      || []
    )
  }, [actualRates, displayCurrency, currencyFilter, coefficiant])

  return (
    <div className='max-w-6xl mx-auto'>
      {hidePanelHeading
        ? <h2 className='flex items-center gap-x-2 justify-center mb-6'>
          <Banknote className="text-white w-12 h-12" />
          <div className="text-white font-semibold flex items-center text-4xl">
            Currency rate
          </div>
        </h2>
        : null
      }
      <div className={containerClasses}>
        <div className="flex flex-col md:flex-row md:items-center max-md:gap-y-4 md:justify-between mb-4">
          {!hidePanelHeading && (
            <div className='flex items-center gap-x-1 md:basis-1/3'>
              <Banknote className="text-white w-5 h-5 mr-2" />
              <h3 className="text-white font-semibold flex items-center text-2xl">
                Currency rate
              </h3>
            </div>
          )}

          <div className={`flex flex-col md:flex-row gap-2 md:items-center md:justify-between 
            ${!isPage ? 'md:basis-2/3' : 'flex-1'} gap-x-2`}>
            {isPage && (
              <CurrencySelectElement classes="md:basis-24" />
            )}
            <input
              className='border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm md:basis-24'
              type="number"
              value={coefficiant}
              onInput={(e) => setCoefficiant(parseInt((e.target as HTMLInputElement).value))}
              placeholder='Count ...'
            />
            <input
              className='border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm basis-full'
              type="search"
              value={currencyFilter}
              onInput={(e) => setCurrencyFilter((e.target as HTMLInputElement).value)}
              placeholder='Find currency ...'
            />
         </div>
        </div>

        <section className={`text-white grid grid-cols-2 md:grid-cols-4 gap-4 mb-2 
          ${!isPage ? 'max-h-48' : ''}overflow-y-auto`}>
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
    </div>
  )
}

export default RatesElement
