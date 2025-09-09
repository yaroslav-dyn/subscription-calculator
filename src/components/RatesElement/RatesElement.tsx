import { useEffect, useMemo } from 'react'
import { useStore } from '@tanstack/react-store'
import { Banknote } from 'lucide-react'
import type {CurrencyInfo} from '@/lib/utils/calculator.utils';
import {
  
  useCalculatorUtils
} from '@/lib/utils/calculator.utils'
import { subscriptionStore } from '@/store/subscriptionStore'

const RatesElement = ({
  currentRates,
}: {
  currentRates: Record<string, CurrencyInfo> | undefined
}) => {
  const { formatCurrency } = useCalculatorUtils()

  const { displayCurrency } = useStore(subscriptionStore, (state) => state)

  const displayRates = useMemo(() => {
    return (
      (currentRates &&
        Object.entries(currentRates)
          .map(([key, value]) => {
            return {
              cur: key,
              rate: value.rate / currentRates?.[displayCurrency]?.rate,
              symbol: value.symbol,
            }
          })
          .filter((crr) => crr.cur !== displayCurrency)) ||
      []
    )
  }, [currentRates])

  useEffect(() => {
    console.log('getActualRates', currentRates, displayRates)
  }, [currentRates])

  return (
    <div className="RatesElement-component backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl py-6 px-6 shadow-xl">
      <div className="flex items-center mb-2">
        <Banknote className="text-white w-5 h-5 mr-2" />
        <h3 className="text-white font-semibold flex items-center">
          Currency rate
        </h3>
      </div>

      <section className="text-white grid md:grid-cols-2 gap-4 mb-2">
        {displayRates &&
          displayRates.map((cr) => (
            <div
              className='flex items-center gap-2 text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"'
              key={cr.cur}
            >
              <span>{cr.cur}</span>
              <span>{formatCurrency(cr.rate, cr.cur)}</span>
            </div>
          ))}
      </section>
    </div>
  )
}

export default RatesElement
