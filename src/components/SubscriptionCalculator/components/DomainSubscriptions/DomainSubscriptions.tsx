import { useStore } from '@tanstack/react-store'
import { Bell, Clock, Globe, Plus, Trash2 } from 'lucide-react'
import { useCalculatorUtils, useDomainUtils } from '@/lib/utils'
import { subscriptionStore } from '@/store/subscriptionStore'

interface IDomainSubscriptions {
  hideAddButton: boolean
  removeDomainhandler: (name: string) => void
  triggerDomainModal: () => void
}

const DomainSubscriptions = ({
  hideAddButton,
  removeDomainhandler,
  triggerDomainModal,
}: IDomainSubscriptions) => {
  const {
    getDaysUntilExpiry,
    getExpiringDomains,
    getStatusColor,
    getStatusBg,
  } = useDomainUtils()

  const { displayCurrency, domains } = useStore(
    subscriptionStore,
    (state) => state,
  )

  const { formatCurrency } = useCalculatorUtils()

  return (
    <div className="DomainSubscriptions-component backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Domain Renewals
        </h3>
        {hideAddButton && (
          <Plus
            strokeWidth="2"
            onClick={triggerDomainModal}
            className="text-white cursor-pointer"
          />
        )}
      </div>

      {/* NOTE: Expiring Domains Alert */}
      {getExpiringDomains(domains).length > 0 && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
          <div className="flex items-center text-red-300 mb-2">
            <Bell className="w-4 h-4 mr-2" />
            <span className="font-medium">Renewal Alerts</span>
          </div>
          {getExpiringDomains(domains).map((domain) => {
            const daysLeft = getDaysUntilExpiry(domain.expiry_date)
            return (
              <div key={domain.id} className="text-sm text-white/90 mb-1">
                <strong>{domain.name}</strong> expires in{' '}
                {daysLeft === 0
                  ? 'TODAY'
                  : daysLeft === 1
                    ? 'TOMORROW'
                    : `${daysLeft} days`}
                {daysLeft === 1 && ' 🚨'}
              </div>
            )
          })}
        </div>
      )}

      {!hideAddButton && (
        <button
          onClick={triggerDomainModal}
          className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-xl text-white hover:from-blue-500/40 hover:to-teal-500/40 transition-all duration-300 mb-4"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Domain
        </button>
      )}

      {/* NOTE: Domain List */}
      {hideAddButton && domains.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {domains.map((domain) => {
            const daysLeft = getDaysUntilExpiry(domain.expiry_date)
            const statusColor = getStatusColor(daysLeft)
            const statusBg = getStatusBg(daysLeft)

            return (
              <div
                key={domain.id}
                className={`p-3 ${statusBg} backdrop-blur-sm rounded-xl border border-white/20 relative`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{domain.name}</h4>
                      {domain.auto_renewal && (
                        <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded-full">
                          Auto
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm">{domain.provider}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`text-sm font-medium ${statusColor}`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {daysLeft < 0
                          ? 'Expired'
                          : daysLeft === 0
                            ? 'Expires Today!'
                            : daysLeft === 1
                              ? 'Expires Tomorrow!'
                              : `${daysLeft} days left`}
                      </span>
                      {parseFloat(domain.renewal_cost) > 0 && (
                        <span className="text-white/60 text-sm">
                          {formatCurrency(
                            parseFloat(domain.renewal_cost),
                            displayCurrency,
                          )}
                          /year
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeDomainhandler(domain.id as string)}
                    className="p-1 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DomainSubscriptions
