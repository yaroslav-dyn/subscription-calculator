import { useEffect, useState } from 'react'
import { Bell, Clock, Globe, Plus, Target, Trash2 } from 'lucide-react'
import './caclulator.css'
import { useStore } from '@tanstack/react-store'
import ModalUiWrapper from '../ui/ModalUiWrapper'
import EditSubscriptionModal from './EditSubscriptionModal'
import DomainForm from './DomainForm'
import Subscriptions from './components/Subscriptions'
import type { ISubscription } from '@/store/subscriptionStore'
import {
  addDomain as addDomainToAction,
  addSubscription as addSubscriptionToAction,
  removeDomain as removeDomainFromAction,
  removeSubscription as removeSubscriptionFromAction,
  setNewDomain,
  subscriptionStore,
  updateDisplayCurrency,
  updateSubscription as updateSubscriptionAction,
} from '@/store/subscriptionStore'
import { Types, useCalculatorUtils, useDomainUtils } from '@/lib/utils'
import SummaryBySubscriptions from './components/SummaryBySubscriptions'

const SubscriptionCalculator = () => {
  const { popularServices, displayCurrency, domains, newDomain } = useStore(
    subscriptionStore,
    (state) => state,
  )
  // SECTION: HOOKS
  const { periods, formatCurrency, getAPIRates } = useCalculatorUtils()
  const {
    getDaysUntilExpiry,
    getExpiringDomains,
    getStatusColor,
    getStatusBg,
  } = useDomainUtils()

  const [showAddForm, setShowAddForm] = useState(false)
  const [showDomainForm, setShowDomainForm] = useState(false)
  const [projectionYears, setProjectionYears] = useState(5)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSubscription, setEditingSubscription] =
    useState<ISubscription | null>(null)

  const [newSub, setNewSub] = useState({
    name: '',
    price: '',
    period: 'monthly' as 'monthly' | 'yearly',
    currency: 'USD' as Types.CurrencyValue,
  })

  useEffect(() => {
    getAPIRates()
  }, [])

  const addCustomSubscription = () => {
    if (newSub.name && newSub.price) {
      addSubscriptionToAction({
        ...newSub,
        price: parseFloat(newSub.price),
        currency: displayCurrency,
      })
      setNewSub({ name: '', price: '', period: 'monthly', currency: 'USD' })
      setShowAddForm(false)
    }
  }

  const handleEditClick = (sub: ISubscription) => {
    setEditingSubscription(sub)
    setIsEditModalOpen(true)
  }

  const handleSaveSubscription = (updatedSubscription: ISubscription) => {
    updateSubscriptionAction(updatedSubscription.name, updatedSubscription)
    setIsEditModalOpen(false)
    setEditingSubscription(null)
  }

  const handleAddDomain = () => {
    if (newDomain.name && newDomain.expiryDate) {
      addDomainToAction()
      setShowDomainForm(false)
    }
  }

  const removeSubscription = (name: string) => {
    removeSubscriptionFromAction(name)
  }

  return (
    <div className="p-4">
      {/* Background Elements */}
      <div className={`absolute min-h-screen md:inset-0`}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <section className="relative max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Subscription Cost Calculator
          </h1>
          <p className="text-white/70">
            Discover the true lifetime cost of your subscriptions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Currency & Projection Settings */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-white/90 text-sm mb-2 block">
                    Display Currency
                  </label>
                  <select
                    value={displayCurrency}
                    onChange={(e) =>
                      updateDisplayCurrency(e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {Types.AvailableCurrencies.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                    {/* <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="UAH">UAH (₴)</option> */}
                  </select>
                </div>

                <div>
                  <label className="text-white/90 text-sm mb-2 block">
                    Projection Years: {projectionYears}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={projectionYears}
                    onChange={(e) =>
                      setProjectionYears(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
                  />
                  <div className="flex justify-between text-white/60 text-xs mt-1">
                    <span>1yr</span>
                    <span>50yrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Popular Services */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Popular Services
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden">
                {popularServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => addSubscriptionToAction(service)}
                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-left hover:bg-white/20 transition-all duration-300 hover:scale-95"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-sm text-white/80">
                        {formatCurrency(service.price, service.currency)}/
                        {service.period}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION: Add Custom Subscription */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Custom subscription
              </button>

              {showAddForm && (
                <div className="mt-4 space-y-3">
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
                    <select
                      value={newSub.period}
                      onChange={(e) =>
                        setNewSub({
                          ...newSub,
                          period: e.target.value as 'monthly' | 'yearly',
                        })
                      }
                      className="px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {Object.entries(periods).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={addCustomSubscription}
                    className="w-full p-2 bg-green-500/30 rounded-xl text-white hover:bg-green-500/40 transition-all duration-300"
                  >
                    Add subscription
                  </button>
                </div>
              )}
            </div>

            {/* SECTION: Domain Renewal Tracker */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Domain Renewals
              </h3>

              {/* NOTE: Expiring Domains Alert */}
              {getExpiringDomains(domains).length > 0 && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center text-red-300 mb-2">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="font-medium">Renewal Alerts</span>
                  </div>
                  {getExpiringDomains(domains).map((domain) => {
                    const daysLeft = getDaysUntilExpiry(domain.expiryDate)
                    return (
                      <div
                        key={domain.id}
                        className="text-sm text-white/90 mb-1"
                      >
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

              <button
                onClick={() => setShowDomainForm(!showDomainForm)}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-blue-500/30 to-teal-500/30 rounded-xl text-white hover:from-blue-500/40 hover:to-teal-500/40 transition-all duration-300 mb-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Domain
              </button>

              {/* NOTE: Domain List */}
              {domains.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {domains.map((domain) => {
                    const daysLeft = getDaysUntilExpiry(domain.expiryDate)
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
                              <h4 className="text-white font-medium">
                                {domain.name}
                              </h4>
                              {domain.autoRenewal && (
                                <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded-full">
                                  Auto
                                </span>
                              )}
                            </div>
                            <p className="text-white/60 text-sm">
                              {domain.provider}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span
                                className={`text-sm font-medium ${statusColor}`}
                              >
                                <Clock className="w-3 h-3 inline mr-1" />
                                {daysLeft < 0
                                  ? 'Expired'
                                  : daysLeft === 0
                                    ? 'Expires Today!'
                                    : daysLeft === 1
                                      ? 'Expires Tomorrow!'
                                      : `${daysLeft} days left`}
                              </span>
                              {parseFloat(domain.renewalCost) > 0 && (
                                <span className="text-white/60 text-sm">
                                  {formatCurrency(
                                    parseFloat(domain.renewalCost),
                                    displayCurrency,
                                  )}
                                  /year
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              removeDomainFromAction(domain.id as string)
                            }
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
          </div>

          {/* SECTION: Right Column - Results */}

          <div className='lg:col-span-2 space-y-6'>
            <Subscriptions
              projectionYears={projectionYears}
              editSubscription={handleEditClick}
              removeSubscription={removeSubscription}
            />
            {/* showAddFormhandler={() => setShowAddForm(true)} */}

          <SummaryBySubscriptions 
            projectionYears={projectionYears} 
            showAddFormhandler={() => setShowAddForm(true)}   
          />

        </div>
        </div>
      </section>

      {/* SECTION: Domain Renewals modal  */}
      {showDomainForm && (
        <ModalUiWrapper>
          <DomainForm
            domain={newDomain}
            setDomain={setNewDomain}
            onAdd={handleAddDomain}
            onCancel={() => setShowDomainForm(false)}
          />
        </ModalUiWrapper>
      )}

      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subscription={editingSubscription}
        onSave={handleSaveSubscription}
      />
    </div>
  )
}

export default SubscriptionCalculator
