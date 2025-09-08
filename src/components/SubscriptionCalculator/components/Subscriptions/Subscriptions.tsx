import { useStore } from '@tanstack/react-store'
import {
  BarChart3,
  Edit,
  Trash2,
} from 'lucide-react'
import type {ISubscription} from '@/store/subscriptionStore';
import { useCalculatorUtils } from '@/lib/utils'
import {
  
  subscriptionStore
} from '@/store/subscriptionStore'

interface ISubscriptions {
  projectionYears: number
  editSubscription: (sub: ISubscription) => void
  removeSubscription: (name: string) => void
}

const Subscriptions = ({
  projectionYears,
  editSubscription,
  removeSubscription,
}: ISubscriptions) => {
  const { formatCurrency, calculateYearlyCost  } = useCalculatorUtils()

  const { subscriptions, displayCurrency } = useStore(
    subscriptionStore,
    (state) => state,
  )

  return (
    <div className="Subscriptions-component">
      {/* Current Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Your Subscriptions
          </h3>

          <div className="space-y-3">
            {subscriptions.map((sub) => {
              const yearlyCost = calculateYearlyCost(sub, displayCurrency)
              return (
                <div
                  key={sub.name}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{sub.name}</h4>
                      <p className="text-white/60 text-sm">
                        {formatCurrency(sub.price, sub.currency)} per{' '}
                        {sub.period}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editSubscription(sub)}
                        className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeSubscription(sub.name)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-white/10 rounded-lg">
                      <p className="text-white/60">Yearly Cost</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(yearlyCost, displayCurrency)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-white/10 rounded-lg">
                      <p className="text-white/60">{projectionYears}yr Total</p>
                      <p className="text-white font-semibold">
                        {formatCurrency(
                          yearlyCost * projectionYears,
                          displayCurrency,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

export default Subscriptions
