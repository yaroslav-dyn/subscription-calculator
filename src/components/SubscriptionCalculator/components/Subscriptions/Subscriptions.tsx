import { NoRecordsState } from './../../../elements/NoRecordsState';
import { useStore } from '@tanstack/react-store'
import { BarChart3, Edit, Plus, Trash2 } from 'lucide-react'
import type { ISubscription } from '@/lib/utils/types'
import type { CurrencyInfo } from '@/lib/utils/calculator.utils'
import { useCalculatorUtils } from '@/lib/utils'
import { subscriptionStore } from '@/store/subscriptionStore'
import Preloader from '@/components/ui/Preloader'
import RemoveProofelement from '@/components/RemoveProofElement'
import React, { useRef } from 'react'

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

  const proofElementRef = useRef<{ data: any; title: string } | null>(null)
  const [isRemoveProofOpen, setIsRemoveProofOpen] = React.useState(false)

  const removeProof = <T,>(params: { data: T; title: string }) => {
    proofElementRef.current = { data: params.data, title: params.title }
    setIsRemoveProofOpen(true)
  }

  const handleProofDelete = () => {
    if (proofElementRef.current?.data) {
      removeSubscription(proofElementRef.current.data)
    }
    setIsRemoveProofOpen(false)
    proofElementRef.current = null
  }

  const handleProofClose = () => {
    setIsRemoveProofOpen(false)
    proofElementRef.current = null
  }


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
                      onClick={() =>
                        removeProof({ data: sub.name, title: `Delete ${sub.name}?` })
                      }
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
        <NoRecordsState showAddFormhandler={showAddFormhandler}  />
      )}

      <RemoveProofelement
        isOpen={isRemoveProofOpen}
        title={proofElementRef.current?.title || ''}
        onProofDelete={handleProofDelete}
        onClose={handleProofClose}
      />

      {isLoading && <Preloader loading={isLoading} />}
    </div>
  )
}

export default Subscriptions
