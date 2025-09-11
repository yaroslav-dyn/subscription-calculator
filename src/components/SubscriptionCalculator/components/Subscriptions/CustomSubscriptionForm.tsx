import { useCalculatorUtils, type Types } from '@/lib/utils'
import { useState } from 'react'
import {
  addSubscription as addSubscriptionToAction,
  subscriptionStore
} from '@/store/subscriptionStore'
import { useStore } from '@tanstack/react-store'
import { BarChart3 } from 'lucide-react'
import CurrencySelectElement from '@/components/ui/CurrencySelect'

interface ICustomSubscriptionFrom {
  onCancel: () => void
}

const CustomSubscriptionForm = (
  {
    onCancel
  }: ICustomSubscriptionFrom
) => {

  const {
    displayCurrency
  } = useStore(subscriptionStore, (state) => state)

  const { periods } = useCalculatorUtils()

  const [newSub, setNewSub] = useState({
    name: '',
    price: '',
    period: 'monthly' as 'monthly' | 'yearly',
    currency: 'USD' as Types.CurrencyValue,
  })


  const addCustomSubscription = () => {
    if (newSub.name && newSub.price) {
      addSubscriptionToAction({
        ...newSub,
        price: parseFloat(newSub.price),
        currency: displayCurrency,
      })
      setNewSub({ name: '', price: '', period: 'monthly', currency: 'USD' })
      onCancel()
    }
  }

  return (
    <div className="mt-4 space-y-3">

      <h3 className="text-white font-semibold flex items-center mb-6">
        <BarChart3 className="w-5 h-5 mr-2" />
        New Subscriptions
      </h3>

      <input
        type="text"
        placeholder="Service name"
        value={newSub.name}
        onChange={(e) =>
          setNewSub({ ...newSub, name: e.target.value })
        }
        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Price"
          value={newSub.price}
          onChange={(e) =>
            setNewSub({ ...newSub, price: e.target.value })
          }
          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <CurrencySelectElement extEvent={(curr) => setNewSub({ ...newSub, currency: curr })} />
      </div>

      <select
        value={newSub.period}
        onChange={(e) =>
          setNewSub({
            ...newSub,
            period: e.target.value as 'monthly' | 'yearly',
          })
        }
        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {Object.entries(periods).map(([key, value]) => (
          <option key={key} value={key}>
            {value.label}
          </option>
        ))}
      </select>

      <div className="mt-6 flex flex-col md:flex-row md:justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={addCustomSubscription}
          className="w-full p-2 bg-green-500/30 rounded-xl text-white hover:bg-green-500/40 transition-all duration-300"
        >
          Add subscription
        </button>
      </div>
    </div>
  )
}

export default CustomSubscriptionForm