import { useStore } from '@tanstack/react-store'
import type { CurrencyValue } from '@/lib/utils/types'
import { Types } from '@/lib/utils'
import {
  subscriptionStore,
  updateDisplayCurrency,
} from '@/store/subscriptionStore'

interface ICurrencySelect {
  classes?: string
  extEvent?: (currency: CurrencyValue) => void
  onChangeCurrency?: (CurrencyValue: CurrencyValue) => void
  selectedCurrecny?: string
}

const CurrencySelectElement = ({ classes = '', extEvent, onChangeCurrency, selectedCurrecny }: ICurrencySelect) => {
  const { displayCurrency } = useStore(subscriptionStore, (state) => state)

  return (
    <select
      value={!extEvent ? displayCurrency : selectedCurrecny!}
      onChange={(e) => {
        extEvent
          ? extEvent(e.target.value)
          : updateDisplayCurrency(e.target.value)
        onChangeCurrency && onChangeCurrency(e.target.value)
      }
      }

      className={`w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-purple-400 ${classes}`}
    >
      {Types.AvailableCurrencies.map((curr) => (
        <option key={curr} value={curr}>
          {curr}
        </option>
      ))}
    </select>
  )
}

export default CurrencySelectElement
