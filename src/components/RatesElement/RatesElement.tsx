
import { useMemo, useState } from 'react'
import { useStore } from '@tanstack/react-store'
import { Currency } from 'lucide-react'
import { useCalculatorUtils, useGetFullRates } from '@/lib/utils/calculator.utils'
import { subscriptionStore } from '@/store/subscriptionStore'
import getSymbolFromCurrency from 'currency-symbol-map'
import CurrencySelectElement from '@/components/ui/CurrencySelect'
import Preloader from '../ui/Preloader'

interface IRatesTypes {
  classes?: string
  hidePanelHeading?: boolean
  isPage?: boolean
  isLoading?: boolean
}

interface IDisplayRate {
  cur: string;
  rate: number;
  symbol: string;
}

const RatesElement = ({ classes = '', hidePanelHeading, isPage, isLoading }: IRatesTypes) => {
  const { displayCurrency } = useStore(subscriptionStore, (state) => state)
  const { formatCurrency } = useCalculatorUtils()
  const { data: ratesBySymbol, isLoading: ratesLoading, isError } = useGetFullRates(displayCurrency);
  const [currencyFilter, setCurrencyFilter] = useState<string>('');

  const [coefficiant, setCoefficiant] = useState<string>('1');

  const containerClasses = `RatesElement-component backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-6 px-6 shadow-xl`

  const actualRates = useMemo(() => ratesBySymbol?.rates || [], [ratesBySymbol]);

  const displayRates: IDisplayRate[] = useMemo(() => {
    return (
      (actualRates &&
        Object.entries(actualRates)
          .map(([key, value]) => {
            return {
              cur: key,
              rate: value as number * (parseFloat(coefficiant) || 1),
              symbol: getSymbolFromCurrency(key),
            }
          })
          .filter((crr) => crr.cur !== displayCurrency &&
            (currencyFilter ? crr.cur.toLowerCase().includes(currencyFilter.toLowerCase()) : true)))
      || []
    )
  }, [actualRates, displayCurrency, currencyFilter, coefficiant])

  return (
    <div className={`max-w-6xl mx-auto ${classes}`}>
      {hidePanelHeading && (
        <>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
              <Currency className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>

          <h2 className='flex items-center gap-x-2 justify-center mb-2'>
            {/* <Currency className="text-white w-8 h-8" /> */}
            <div className="text-white font-semibold flex items-center text-4xl">
              Currency rate
            </div>
          </h2>
          <p className="text-white/70 text-center mb-1">Check the latest currency exchange rates.</p>
          <p className="text-white/50 text-xs text-center mb-6">
            Using data from <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">exchangerate-api.com</a>
          </p>
        </>
      )
      }
      <div className={containerClasses}>
        <div className="flex flex-col md:flex-row md:items-center max-md:gap-y-4 md:justify-between mb-6">
          {!hidePanelHeading && (
            <div className='flex items-center gap-x-1 md:basis-1/3'>
              <Currency className="text-white w-5 h-5 mr-2" />
              <h3 className="text-white font-semibold flex items-center text-2xl">
                Currency rate
              </h3>
            </div>
          )}

          <div className={`flex flex-col md:flex-row gap-2 md:items-center md:justify-between 
            ${!isPage ? 'md:basis-2/3' : 'flex-1'} gap-x-2`}>
            {isPage && (
              <CurrencySelectElement classes="md:basis-28" />
            )}
            <input
              className='border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm md:basis-24'
              type="number"
              value={coefficiant}
              onInput={(e) => setCoefficiant( (e.target as HTMLInputElement).value)}
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
          ${!isPage ? 'max-h-48' : 'max-h-[42vh] md:max-h-[50vh]'} overflow-y-auto`}>
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
      <Preloader 
        loading={isLoading || ratesLoading} 
        classes={`${!isPage ? 'h-48' : 'h-[42vh] md:h-[50vh'}`} />
    </div>
  )
}

export default RatesElement 
