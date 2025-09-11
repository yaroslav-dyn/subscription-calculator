import { Types } from '@/lib/utils';
import { useStore } from '@tanstack/react-store';
import {
  subscriptionStore,
  updateDisplayCurrency,
} from '@/store/subscriptionStore'
import type { CurrencyValue } from '@/lib/utils/types';


interface ICurrencySelect {
  classes?: string
  extEvent?: (currency: CurrencyValue) => void
}

const CurrencySelectElement = ({ classes = "", extEvent }: ICurrencySelect) => {

  const {
    displayCurrency,
  } = useStore(subscriptionStore, (state) => state)

  return (
    <select
      value={displayCurrency}
      onChange={e => extEvent ? extEvent(e.target.value) : updateDisplayCurrency(e.target.value)}
      className={`w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 ${classes}`}>
      {Types.AvailableCurrencies.map(curr => <option key={curr} value={curr}>
        {curr}
      </option>)}
    </select>);


}

export default CurrencySelectElement;
