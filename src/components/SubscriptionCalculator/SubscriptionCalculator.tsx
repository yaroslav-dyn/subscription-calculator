import { useEffect, useState, type ReactNode } from 'react'
import { Banknote, Calculator, Globe, Plus, Target } from 'lucide-react'
import './caclulator.css'
import { useStore } from '@tanstack/react-store'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ModalUiWrapper from '../ui/ModalUiWrapper'
import EditSubscriptionModal from './EditSubscriptionModal'
import DomainForm from './components/DomainSubscriptions/DomainForm'
import SummaryBySubscriptions from './components/SummaryBySubscriptions'
import DomainSubscriptions from './components/DomainSubscriptions'
import type { ISubscription } from '@/lib/utils/types'
import type { CurrencyInfo } from '@/lib/utils/calculator.utils'
import Subscriptions, { CustomSubscriptionForm } from '@/components/SubscriptionCalculator/components/Subscriptions'
import {
  addDomain as addDomainToAction,
  addSubscription as addSubscriptionToAction,
  removeDomain as removeDomainFromAction,
  removeSubscription as removeSubscriptionFromAction,
  setNewDomain,
  subscriptionStore,
  updateDisplayCurrency,
  updateSettingsPanelStatus,
  updateShowDomainStatus,
  updateShowRatesStatus,
  updateSubscription as updateSubscriptionAction,
} from '@/store/subscriptionStore'
import { Types, useCalculatorUtils } from '@/lib/utils'
import RatesElement from '@/components/RatesElement/RatesElement'

import { cloneElement } from 'react'
import { GripVertical } from 'lucide-react'

const SortableItem = ({ id, children }: { id: string, children: ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  // Clone the child element to add the drag handle props
  const childWithProps = children ? cloneElement(children as React.ReactElement, {
    ...attributes,
    ...listeners,
  }) : null;


  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute top-1 right-1 z-10 cursor-grab" {...attributes} {...listeners}>
        <GripVertical className="text-white/50" />
      </div>
      {childWithProps}
    </div>
  );
}

const SubscriptionCalculator = () => {
  // NOTE: STORE
  const {
    popularServices,
    settingsPanelStatus,
    showRatesStatus,
    showDomainStatus,
    displayCurrency,
    newDomain,
  } = useStore(subscriptionStore, (state) => state)

  // NOTE: HOOKS
  const { formatCurrency, getAPIRates } = useCalculatorUtils()

  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [showDomainForm, setShowDomainForm] = useState<boolean>(false)
  const [projectionYears, setProjectionYears] = useState(5)
  const [currentRates, setCurrentRates] = useState<
    Record<string, CurrencyInfo> | undefined
  >(undefined)

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [editingSubscription, setEditingSubscription] =
    useState<ISubscription | null>(null)

  const [rightColumnItems, setRightColumnItems] = useState(['subscriptions', 'rates', 'domains', 'summary']);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setRightColumnItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  useEffect(() => {
    const updateRates = async () => {
      const res = await getAPIRates()
      setCurrentRates(res)
    }
    updateRates()
  }, [])


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

  const triggerSettingsPanel = () => {
    updateSettingsPanelStatus(!settingsPanelStatus)
  }

  const triggerRatesPanel = () => {
    updateShowRatesStatus(!showRatesStatus)
  }

  const triggerDomainPanel = () => {
    updateShowDomainStatus(!showDomainStatus)
  }

  const rightColumnComponents: { [key: string]: ReactNode } = {
    subscriptions: currentRates && (
      <Subscriptions
        triggerSettingshandler={() => setShowAddForm(true)}
        projectionYears={projectionYears}
        editSubscription={handleEditClick}
        removeSubscription={removeSubscription}
        currentRates={currentRates}
        showAddFormhandler={() => setShowAddForm(true)}
      />
    ),
    rates: showRatesStatus && currentRates && (
      <RatesElement hidePanelHeading={false} isPage={false} />
    ),
    domains: showDomainStatus && (
      <DomainSubscriptions
        hideAddButton={true}
        removeDomainhandler={removeDomainFromAction}
        triggerDomainModal={() => setShowDomainForm(true)}
      />
    ),
    summary: <SummaryBySubscriptions projectionYears={projectionYears} />,
  };

  return (
    <main className="p-4">

      <div className="text-center mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
            <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
      </div>

      {/* Background Elements */}
      <div className={`absolute min-h-screen md:inset-0`}>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="flex flex-row md:flex-row items-center gap-4 md:gap-4 fixed z-50 top-2 md:top-4 right-2 md:right-4">
        <Target
          size={30}
          onClick={triggerSettingsPanel}
          opacity={!settingsPanelStatus ? '0.5' : '1'}
          className="text-white cursor-pointer hover:opacity-100"
        />

        <Banknote
          size={34}
          onClick={triggerRatesPanel}
          opacity={!showRatesStatus ? '0.5' : '1'}
          className="text-white cursor-pointer hover:opacity-100"
        />

        <Globe
          size={26}
          onClick={triggerDomainPanel}
          opacity={!showDomainStatus ? '0.5' : '1'}
          className="text-white cursor-pointer hover:opacity-100"
        />
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

          {/* SECTION: Left Column - Controls */}
          {settingsPanelStatus && (
            <aside id='calc_left__column' className={`lg:col-span-1 space-y-6`}>
              {/* Currency & Projection Settings */}
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Settings
                  </h3>
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
            id='calc_right__column'
            className={`${settingsPanelStatus ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}
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
                {rightColumnItems.map(id => (
                  <SortableItem key={id} id={id}>
                    {rightColumnComponents[id]}
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          </section>
        </div>
      </section>

      {/* SECTION: Custom Subscription modal */}
      <ModalUiWrapper isOpen={showAddForm}>
        <CustomSubscriptionForm
          onCancel={() => setShowAddForm(false)}
        />
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
      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subscription={editingSubscription}
        onSave={handleSaveSubscription}
      />

    </main>
  )
}

export default SubscriptionCalculator 

