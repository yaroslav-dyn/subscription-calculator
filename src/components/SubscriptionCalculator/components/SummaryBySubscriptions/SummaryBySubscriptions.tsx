import { useStore } from '@tanstack/react-store'
import { AlertCircle, PieChart, TrendingUp } from 'lucide-react'
import { useCalculatorUtils } from '@/lib/utils'
import { subscriptionStore } from '@/store/subscriptionStore'

interface ISummaryBySubscriptions {
  projectionYears: number
  showAddFormhandler: (status: boolean) => void
}

const SummaryBySubscriptions = ({
  projectionYears,
  showAddFormhandler,
}: ISummaryBySubscriptions) => {
  const { formatCurrency, getTotalCosts, getInsights } = useCalculatorUtils()

  const { subscriptions, displayCurrency } = useStore(
    subscriptionStore,
    (state) => state,
  )

  return (
    <div className="SummaryBySubscriptions-component">
      <>
        {/* Total Summary */}
        {subscriptions.length > 0 && (
          <div className="backdrop-blur-lg bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-semibold mb-6 flex items-center text-xl">
              <TrendingUp className="w-6 h-6 mr-2" />
              Cost Summary
            </h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-white/80 text-sm mb-1">Monthly Total</p>
                <p className="text-2xl font-bold text-green-300">
                  {formatCurrency(
                    getTotalCosts(
                      subscriptions,
                      displayCurrency,
                      projectionYears,
                    ).monthly,
                    displayCurrency,
                  )}
                </p>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-white/80 text-sm mb-1">Yearly Total</p>
                <p className="text-2xl font-bold text-blue-300">
                  {formatCurrency(
                    getTotalCosts(
                      subscriptions,
                      displayCurrency,
                      projectionYears,
                    ).yearly,
                    displayCurrency,
                  )}
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl backdrop-blur-sm border border-white/20">
                <p className="text-white/80 text-sm mb-1">
                  {projectionYears}-Year Total
                </p>
                <p className="text-3xl font-bold text-white">
                  {formatCurrency(
                    getTotalCosts(
                      subscriptions,
                      displayCurrency,
                      projectionYears,
                    ).projection,
                    displayCurrency,
                  )}
                </p>
              </div>
            </div>

            {/* Insights */}
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Reality Check
              </h4>
              <div className="space-y-2 text-white/80">
                <p>
                  💰 You spend{' '}
                  <strong>
                    {formatCurrency(
                      getInsights(
                        subscriptions,
                        displayCurrency,
                        projectionYears,
                      ).dailyCost,
                      displayCurrency,
                    )}
                  </strong>{' '}
                  per day on subscriptions
                </p>
                <p>
                  ✈️ Your subscriptions cost equals a vacation every{' '}
                  <strong>
                    {
                      getInsights(
                        subscriptions,
                        displayCurrency,
                        projectionYears,
                      ).vacationEquivalent
                    }
                  </strong>{' '}
                  years
                </p>
                <p>
                  ☕ That's like buying{' '}
                  <strong>
                    {
                      getInsights(
                        subscriptions,
                        displayCurrency,
                        projectionYears,
                      ).coffeeEquivalent
                    }
                  </strong>{' '}
                  coffees per day
                </p>
              </div>
            </div>
          </div>
        )}

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
      </>
    </div>
  )
}

export default SummaryBySubscriptions
