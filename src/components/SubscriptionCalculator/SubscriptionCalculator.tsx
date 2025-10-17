import { useEffect, useState } from 'react'
import { Plus, Target } from 'lucide-react'
import { isMobile } from 'react-device-detect'
import SortableItem from '../SortableDragWrapper'
import './caclulator.css'
import { useStore } from '@tanstack/react-store'
import {
  DndContext,
  closestCenter,
  // KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  // sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import ModalUiWrapper from '../ui/ModalUiWrapper'
import DomainForm from './components/DomainSubscriptions/DomainForm'
import EditSubscriptionModal from './EditSubscriptionModal'
import SummaryBySubscriptions from './components/SummaryBySubscriptions'
import DomainSubscriptions from './components/DomainSubscriptions'
import { type SettingsStoreState, updateSettingsPanelStatus } from '@/store/settingsStore';
import type { ReactNode } from 'react';
import type { ISubscription } from '@/lib/utils/types'
import CalculatorHeading from '@/components/CalculatorHeading'
import { useGetAPIRates } from '@/lib/utils/calculator.utils'
import Subscriptions, {
  CustomSubscriptionForm,
} from '@/components/SubscriptionCalculator/components/Subscriptions'
import {
  addDomain as addDomainToAction,
  addSubscription as addSubscriptionToAction,
  fetchDomains,
  fetchSubscriptions,
  removeDomain as removeDomainFromAction,
  removeSubscription as removeSubscriptionFromAction,
  setNewDomain,
  subscriptionStore,
  updateDisplayCurrency,
  updateSubscription as updateSubscriptionAction,
} from '@/store/subscriptionStore'
import { settingsStore } from '@/store/settingsStore'

import {
  Types, 
  useCalculatorUtils,
} from '@/lib/utils'
import RatesElement from '@/components/RatesElement/RatesElement'
import { userStore } from '@/store/user.store'


const SubscriptionCalculator = () => {

  const { user } = useStore(userStore, (state) => state)
  // NOTE: STORE
  const { popularServices, displayCurrency, newDomain } = useStore(
    subscriptionStore,
    (state) => state,
  )

  const settingsStoreInstance = useStore(settingsStore, (state) => state)
  const { data: currentRates, isLoading } = useGetAPIRates()

  // NOTE: HOOKS
  const { formatCurrency } = useCalculatorUtils()

  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [showDomainForm, setShowDomainForm] = useState<boolean>(false)
  const [projectionYears, setProjectionYears] = useState(5)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [editingSubscription, setEditingSubscription] =
    useState<ISubscription | null>(null)

  const [rightColumnItems, setRightColumnItems] = useState([
    'subscriptions',
    'rates',
    'domains',
    'summary',
  ])

  const sensors = useSensors(
    // useSensor(PointerSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
    isMobile ? useSensor(TouchSensor) : useSensor(PointerSensor),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setRightColumnItems((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        // Save new order to localStorage
        localStorage.setItem(
          'subscriptionCalculatorRightColumnOrder',
          JSON.stringify(newOrder),
        )
        return newOrder
      })
    }
  }

  useEffect(() => {
    // Load saved order from localStorage on mount
    setPanelOrder()
    user && (fetchSubscriptions(user), fetchDomains(user))
    console.log("🚀 ~ SubscriptionCalculator ~ user:", user)
  }, [user])

  const setPanelOrder = () => {
    const savedOrder = localStorage.getItem(
      'subscriptionCalculatorRightColumnOrder',
    )
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder)
        if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
          setRightColumnItems(parsedOrder)
        }
      } catch (e) {
        console.error(
          'Failed to parse saved right column order from localStorage',
          e,
        )
      }
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
    if (newDomain.name && newDomain.expiry_date) {
      addDomainToAction()
      setShowDomainForm(false)
    }
  }

  const removeSubscription = (name: string) => {
    removeSubscriptionFromAction(name)
  }

  const rightColumnComponents: { [key: string]: ReactNode } = {
    subscriptions: (
      <Subscriptions
        triggerSettingshandler={() => setShowAddForm(true)}
        projectionYears={projectionYears}
        editSubscription={handleEditClick}
        removeSubscription={removeSubscription}
        currentRates={currentRates}
        showAddFormhandler={() => setShowAddForm(true)}
        isLoading={isLoading}
      />
    ),
    rates: settingsStoreInstance.rates && currentRates && (
      <RatesElement
        hidePanelHeading={false}
        isPage={false}
        isLoading={isLoading}
      />
    ),
    domains: settingsStoreInstance.domains && (
      <DomainSubscriptions
        hideAddButton={true}
        removeDomainhandler={removeDomainFromAction}
        triggerDomainModal={() => setShowDomainForm(true)}
      />
    ),
    summary: <SummaryBySubscriptions projectionYears={projectionYears} />,
  }

  return (
    <main className="p-4">
      <section className="relative max-w-6xl mx-auto max-lg:overflow-x-hidden">
        <CalculatorHeading />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* SECTION: Left Column - Controls */}
          {settingsStoreInstance.settings && (
            <aside id="calc_left__column" className={`lg:col-span-1 space-y-6`}>
              {/* Currency & Projection Settings */}
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Settings
                  </h3>
                  <Target
                    xlinkTitle='Hide settings'
                    size={30}
                    onClick={() => updateSettingsPanelStatus('settings', !settingsStoreInstance.settings)}
                    opacity={!settingsStoreInstance.settings ? '0.5' : '1'}
                    className="text-white cursor-pointer hover:scale-110"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white/90 text-sm mb-2 block">
                      Display Currency
                    </label>
                    <select
                      value={displayCurrency}
                      onChange={(e) => updateDisplayCurrency(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {Types.AvailableCurrencies.map((curr) => (
                        <option key={curr} value={curr}>
                          {curr}
                        </option>
                      ))}
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

                <div className="light-scrollbar space-y-2 max-h-64 overflow-y-auto overflow-x-hidden">
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
              </div>

              {/* SECTION: Domain Renewal Tracker */}
              <DomainSubscriptions
                hideAddButton={false}
                removeDomainhandler={() => undefined}
                triggerDomainModal={() => setShowDomainForm(!showDomainForm)}
              />
            </aside>
          )}

          {/* SECTION: Right Column - Results */}
          <section
            id="calc_right__column"
            className={`${settingsStoreInstance.settings ? 'lg:col-span-2' : 'lg:col-span-3'
              } space-y-6`}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={rightColumnItems}
                strategy={verticalListSortingStrategy}
              >
                {rightColumnItems.map((id) => {
                  if (settingsStoreInstance[id as keyof SettingsStoreState]) {
                    return (
                      <SortableItem key={id} id={id}>
                        {rightColumnComponents[id]}
                      </SortableItem>
                    )
                  }
                })}
              </SortableContext>
            </DndContext>
          </section>
        </div>
      </section>

      {/* SECTION: Custom Subscription modal */}
      <ModalUiWrapper isOpen={showAddForm}>
        <CustomSubscriptionForm onCancel={() => setShowAddForm(false)} />
      </ModalUiWrapper>

      {/* SECTION: Domain Renewals modal  */}
      <ModalUiWrapper isOpen={showDomainForm}>
        <DomainForm
          domain={newDomain}
          setDomain={setNewDomain}
          onAdd={handleAddDomain}
          onCancel={() => setShowDomainForm(false)}
        />
      </ModalUiWrapper>

      {/* SECTION: Edit Subscriptiom modal  */}
      <ModalUiWrapper isOpen={isEditModalOpen}>
        <EditSubscriptionModal
          onClose={() => setIsEditModalOpen(false)}
          subscription={editingSubscription}
          onSave={handleSaveSubscription}
        />
      </ModalUiWrapper>
    </main>
  )
}

export default SubscriptionCalculator
