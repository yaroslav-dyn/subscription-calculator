import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  PieChart,
  BarChart3,
  AlertCircle,
  Target,
  Globe,
  Clock,
  Bell,
  Edit,
} from 'lucide-react';
import './caclulator.css';
import { useStore } from '@tanstack/react-store';
import {
  subscriptionStore,
  addSubscription as addSubscriptionToAction,
  removeSubscription as removeSubscriptionFromAction,
  updateSubscription as updateSubscriptionAction,
  updateDisplayCurrency,
  type Subscription,
  type Currency,
} from '@/store/subscriptionStore';
import EditSubscriptionModal from './EditSubscriptionModal';

const SubscriptionCalculator = () => {
  const { popularServices, subscriptions, displayCurrency } = useStore(subscriptionStore, (state) => state);

  const [domains, setDomains] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [projectionYears, setProjectionYears] = useState(5);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const [newSub, setNewSub] = useState({
    name: '',
    price: '',
    period: 'monthly' as 'monthly' | 'yearly',
    currency: 'USD' as Currency,
  });

  const [newDomain, setNewDomain] = useState({
    name: '',
    provider: 'Cloudflare',
    expiryDate: '',
    renewalCost: '',
    autoRenewal: false,
  });

  const periods = {
    weekly: { multiplier: 52, label: 'Weekly' },
    monthly: { multiplier: 12, label: 'Monthly' },
    quarterly: { multiplier: 4, label: 'Quarterly' },
    'half-yearly': { multiplier: 2, label: 'Half-yearly' },
    yearly: { multiplier: 1, label: 'Yearly' },
  };

  const currencies = {
    USD: { symbol: '$', rate: 1 }, // Base currency
    EUR: { symbol: '€', rate: 1.08 }, // 1 EUR = 1.08 USD
    UAH: { symbol: '₴', rate: 0.025 }, // 1 UAH = 0.025 USD
  };

  const formatCurrency = (amount: number, currencyCode: Currency) => {
    const symbol = currencies[currencyCode].symbol;
    return `${symbol}${amount.toFixed(2)}`;
  };

  const calculateYearlyCost = (sub: Subscription) => {
    // Convert subscription price to the base currency (USD)
    const priceInBaseCurrency = sub.price * currencies[sub.currency].rate;
    // Convert from base currency to the selected display currency
    const priceInDisplayCurrency = priceInBaseCurrency / currencies[displayCurrency].rate;
    return priceInDisplayCurrency * periods[sub.period].multiplier;
  };

  const addSubscription = (service: Subscription) => {
    addSubscriptionToAction(service);
  };

  const addCustomSubscription = () => {
    if (newSub.name && newSub.price) {
      addSubscription({
        ...newSub,
        price: parseFloat(newSub.price),
        currency: displayCurrency,
      });
      setNewSub({ name: '', price: '', period: 'monthly', currency: 'USD' });
      setShowAddForm(false);
    }
  };

  const handleEditClick = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsEditModalOpen(true);
  };

  const handleSaveSubscription = (updatedSubscription: Subscription) => {
    updateSubscriptionAction(updatedSubscription.name, updatedSubscription);
    setIsEditModalOpen(false);
    setEditingSubscription(null);
  };

  const addDomain = () => {
    if (newDomain.name && newDomain.expiryDate) {
      const id = Date.now() + Math.random();
      setDomains([...domains, { ...newDomain, id, renewalCost: parseFloat(newDomain.renewalCost) || 0 }]);
      setNewDomain({ name: '', provider: 'Cloudflare', expiryDate: '', renewalCost: '', autoRenewal: false });
      setShowDomainForm(false);
    }
  };

  const removeDomain = (id: number) => {
    setDomains(domains.filter((domain) => domain.id !== id));
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiringDomains = () => {
    return domains
      .filter((domain) => {
        const daysLeft = getDaysUntilExpiry(domain.expiryDate);
        return daysLeft <= 30 && daysLeft >= 0;
      })
      .sort((a, b) => getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate));
  };

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-gray-400'; // Expired
    if (daysLeft <= 1) return 'text-red-400'; // Critical
    if (daysLeft <= 7) return 'text-orange-400'; // Warning
    if (daysLeft <= 30) return 'text-yellow-400'; // Attention
    return 'text-green-400'; // Safe
  };

  const getStatusBg = (daysLeft: number) => {
    if (daysLeft < 0) return 'bg-gray-500/20';
    if (daysLeft <= 1) return 'bg-red-500/20';
    if (daysLeft <= 7) return 'bg-orange-500/20';
    if (daysLeft <= 30) return 'bg-yellow-500/20';
    return 'bg-green-500/20';
  };

  const removeSubscription = (name: string) => {
    removeSubscriptionFromAction(name);
  };

  const getTotalCosts = () => {
    const yearlyTotal = subscriptions.reduce((total, sub) => {
      return total + calculateYearlyCost(sub);
    }, 0);

    return {
      yearly: yearlyTotal,
      projection: yearlyTotal * projectionYears,
      monthly: yearlyTotal / 12,
    };
  };

  const getInsights = () => {
    const totals = getTotalCosts();
    const vacationCost = 3000; // Average vacation cost
    const yearsForVacation = totals.yearly > 0 ? Math.ceil(vacationCost / totals.yearly) : 0;

    return {
      vacationEquivalent: yearsForVacation,
      dailyCost: totals.yearly / 365,
      coffeeEquivalent: totals.yearly > 0 ? Math.floor(totals.yearly / (5 * 365)) : 0, // $5 coffee
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Background Elements */}
      <div className="absolute min-h-screen inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 shadow-lg">
            <Calculator className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Subscription Cost Calculator</h1>
          <p className="text-white/70">Discover the true lifetime cost of your subscriptions</p>
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
                  <label className="text-white/90 text-sm mb-2 block">Display Currency</label>
                  <select
                    value={displayCurrency}
                    onChange={(e) => updateDisplayCurrency(e.target.value as Currency)}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="UAH">UAH (₴)</option>
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
                    onChange={(e) => setProjectionYears(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none slider"
                  />
                  <div className="flex justify-between text-white/60 text-xs mt-1">
                    <span>1yr</span>
                    <span>50yrs</span>
                  </div>
                </div>
              </div>
            </div>

            {/*SECTION: Popular Services */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Popular Services
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden">
                {popularServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => addSubscription(service)}
                    className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-left hover:bg-white/20 transition-all duration-300 hover:scale-95"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-sm text-white/80">
                        {formatCurrency(service.price, service.currency)}/{service.period}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Custom Subscription */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl text-white hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Custom Subscription
              </button>

              {showAddForm && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Service name"
                    value={newSub.name}
                    onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Price"
                      value={newSub.price}
                      onChange={(e) => setNewSub({ ...newSub, price: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <select
                      value={newSub.period}
                      onChange={(e) => setNewSub({ ...newSub, period: e.target.value as 'monthly' | 'yearly' })}
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
                    Add Subscription
                  </button>
                </div>
              )}
            </div>

            {/* Domain Renewal Tracker */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Domain Renewals
              </h3>

              {/* Expiring Domains Alert */}
              {getExpiringDomains().length > 0 && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center text-red-300 mb-2">
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="font-medium">Renewal Alerts</span>
                  </div>
                  {getExpiringDomains().map((domain) => {
                    const daysLeft = getDaysUntilExpiry(domain.expiryDate);
                    return (
                      <div key={domain.id} className="text-sm text-white/90 mb-1">
                        <strong>{domain.name}</strong> expires in{' '}
                        {daysLeft === 0 ? 'TODAY' : daysLeft === 1 ? 'TOMORROW' : `${daysLeft} days`}
                        {daysLeft === 1 && ' 🚨'}
                      </div>
                    );
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

              {showDomainForm && (
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="domain.com"
                    value={newDomain.name}
                    onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex flex-col gap-2">
                    <select
                      value={newDomain.provider}
                      onChange={(e) => setNewDomain({ ...newDomain, provider: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Cloudflare">Cloudflare</option>
                      <option value="GoDaddy">GoDaddy</option>
                      <option value="Namecheap">Namecheap</option>
                      <option value="Google Domains">Google Domains</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Renewal cost"
                      value={newDomain.renewalCost}
                      onChange={(e) => setNewDomain({ ...newDomain, renewalCost: e.target.value })}
                      className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <input
                    type="date"
                    value={newDomain.expiryDate}
                    onChange={(e) => setNewDomain({ ...newDomain, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="autoRenewal"
                      checked={newDomain.autoRenewal}
                      onChange={(e) => setNewDomain({ ...newDomain, autoRenewal: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="autoRenewal" className="text-white/80 text-sm">
                      Auto-renewal enabled
                    </label>
                  </div>
                  <button
                    onClick={addDomain}
                    className="w-full p-2 bg-blue-500/30 rounded-xl text-white hover:bg-blue-500/40 transition-all duration-300"
                  >
                    Add Domain
                  </button>
                </div>
              )}

              {/* Domain List */}
              {domains.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {domains.map((domain) => {
                    const daysLeft = getDaysUntilExpiry(domain.expiryDate);
                    const statusColor = getStatusColor(daysLeft);
                    const statusBg = getStatusBg(daysLeft);

                    return (
                      <div
                        key={domain.id}
                        className={`p-3 ${statusBg} backdrop-blur-sm rounded-xl border border-white/20 relative`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{domain.name}</h4>
                              {domain.autoRenewal && (
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
                              {domain.renewalCost > 0 && (
                                <span className="text-white/60 text-sm">
                                  {formatCurrency(parseFloat(domain.renewalCost), displayCurrency)}/year
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeDomain(domain.id)}
                            className="p-1 text-red-400 hover:bg-red-400/20 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Subscriptions */}
            {subscriptions.length > 0 && (
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Your Subscriptions
                </h3>

                <div className="space-y-3">
                  {subscriptions.map((sub) => {
                    const yearlyCost = calculateYearlyCost(sub);
                    return (
                      <div key={sub.name} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{sub.name}</h4>
                            <p className="text-white/60 text-sm">
                              {formatCurrency(sub.price, sub.currency)} per {sub.period}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(sub)}
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
                            <p className="text-white font-semibold">{formatCurrency(yearlyCost, displayCurrency)}</p>
                          </div>
                          <div className="text-center p-2 bg-white/10 rounded-lg">
                            <p className="text-white/60">{projectionYears}yr Total</p>
                            <p className="text-white font-semibold">{formatCurrency(yearlyCost * projectionYears, displayCurrency)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                    <p className="text-2xl font-bold text-green-300">{formatCurrency(getTotalCosts().monthly, displayCurrency)}</p>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                    <p className="text-white/80 text-sm mb-1">Yearly Total</p>
                    <p className="text-2xl font-bold text-blue-300">{formatCurrency(getTotalCosts().yearly, displayCurrency)}</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl backdrop-blur-sm border border-white/20">
                    <p className="text-white/80 text-sm mb-1">{projectionYears}-Year Total</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(getTotalCosts().projection, displayCurrency)}</p>
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
                      💰 You spend <strong>{formatCurrency(getInsights().dailyCost, displayCurrency)}</strong> per day on subscriptions
                    </p>
                    <p>
                      ✈️ Your subscriptions cost equals a vacation every{' '}
                      <strong>{getInsights().vacationEquivalent}</strong> years
                    </p>
                    <p>
                      ☕ That's like buying <strong>{getInsights().coffeeEquivalent}</strong> coffees per day
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {subscriptions.length === 0 && (
              <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-12 shadow-xl text-center">
                <PieChart className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No Subscriptions Yet</h3>
                <p className="text-white/70 mb-6">Add your first subscription to see the lifetime cost analysis</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subscription={editingSubscription}
        onSave={handleSaveSubscription}
      />
    </div>
  );
};

export default SubscriptionCalculator;
