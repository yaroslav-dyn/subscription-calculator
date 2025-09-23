import { useStore } from '@tanstack/react-store'
import { BarChart3, Edit, PieChart, Plus, Trash2 } from 'lucide-react'
import type { ISubscription } from '@/lib/utils/types'
import type { CurrencyInfo } from '@/lib/utils/calculator.utils'
import { useCalculatorUtils } from '@/lib/utils'
import { subscriptionStore } from '@/store/subscriptionStore'
import Preloader from '@/components/ui/Preloader'

interface ISubscriptions {
  projectionYears: number
  triggerSettingshandler: () => void
  editSubscription: (sub: ISubscription) => void
  removeSubscription: (name: string) => void
  currentRates: Record<string, CurrencyInfo> | undefined
  showAddFormhandler: (status: boolean) => void
  isLoading?: boolean
}

const Subscriptions = ({
  projectionYears,
  triggerSettingshandler,
  editSubscription,
  removeSubscription,
  currentRates,
  showAddFormhandler,
  isLoading,
}: ISubscriptions) => {
  const { formatCurrency, calculateYearlyCost } = useCalculatorUtils()

  const { subscriptions, displayCurrency } = useStore(
    subscriptionStore,
    (state) => state,
  )
  return (
    <div className="Subscriptions-component relative">
      {/* Current Subscriptions */}

      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Your Subscriptions
          </h3>
          <Plus
            strokeWidth="2"
            onClick={triggerSettingshandler}
            className="text-white cursor-pointer"
          />
        </div>

        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const yearlyCost = calculateYearlyCost(
              sub,
              displayCurrency,
              currentRates!,
            )
            return (
              <div
                key={sub.name}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{sub.name}</h4>
                    <p className="text-white/60 text-sm">
                      {formatCurrency(sub.price, sub.currency)} per {sub.period}
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

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12 shadow-xl text-center">
          <PieChart className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">
            No Subscriptions Yet
          </h3>
          <p className="text-white/70 mb-6">
            Add your first subscription to see the lifetime cost analysis
          </p>
          <button
            onClick={() => showAddFormhandler(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      )}

      {isLoading && <Preloader loading={isLoading} />}
    </div>
  )
}

export default Subscriptions
