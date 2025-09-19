import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import type { ISubscription } from '@/lib/utils/types'
import type { Types } from '@/lib/utils'

interface EditSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  subscription: ISubscription | null
  onSave: (updatedSubscription: ISubscription) => void
}

const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSave,
}) => {
  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('monthly')
  const [currency, setCurrency] = React.useState<Types.CurrencyValue>('USD')

  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setPrice(subscription.price.toString())
      setPeriod(subscription.period)
      setCurrency(subscription.currency)
    }
  }, [subscription])

  const handleSave = () => {
    if (subscription) {
      onSave({
        ...subscription,
        name,
        price: parseFloat(price),
        period,
        currency,
      })
    }
  }

  if (!isOpen || !subscription) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">
            Edit Subscription
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <select
              value={currency}
              onChange={(e) =>
                setCurrency(e.target.value as 'USD' | 'EUR' | 'UAH')
              }
              className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="UAH">UAH</option>
            </select>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'monthly' | 'yearly')}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 rounded-xl text-white/80 hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-500/80 rounded-xl text-white hover:bg-purple-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditSubscriptionModal
