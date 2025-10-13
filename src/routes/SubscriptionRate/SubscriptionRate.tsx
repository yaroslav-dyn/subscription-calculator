import Preloader from '@/components/ui/Preloader'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useCalculatorUtils, useUser } from '@/lib/utils'
import {
  fetchSubscriptions,
  subscriptionStore,
} from '@/store/subscriptionStore'
import { useStore } from '@tanstack/react-store'
import { useEffect, useState } from 'react'
import CurrencySelectElement from '@/components/ui/CurrencySelect'
import { monthsArray } from '@/lib/utils/constants'
import { getAPIRatesPair, useGetFullRates } from '@/lib/utils/calculator.utils'
import { useQuery } from '@tanstack/react-query'

interface ISubRateTypes {
  classes?: string
  hidePanelHeading?: boolean
  isPage?: boolean
  isLoading?: boolean
}

const SubscriptionRate = ({ classes = '', isPage }: ISubRateTypes) => {
  const { data: user } = useUser()
  const { calculateYearlyCost, currencies } = useCalculatorUtils()
  const { subscriptions, isPendingSubscriptions, displayCurrency } = useStore(
    subscriptionStore,
    (state) => state,
  )
  const [budget, setBudget] = useState<string>('500')
  const [selectedCurrecny, setSelectedCurrecny] = useState(displayCurrency);


  // Prepare chart data: group subscriptions by month for current year
  const currentYear = new Date().getFullYear()


  useEffect(() => {
    user && fetchSubscriptions(user)
  }, [user])

  type ChartDataType = { month: string; total: number };
  type PercentDataType = { month: string; percent: number };
  const [chartData, setChartData] = useState<ChartDataType[]>([])
  const [percentData, setPercentData] = useState<PercentDataType[]>([])

  useEffect(() => {
    if (subscriptions) {
      // Reset monthlyTotals for recalculation
      const monthlyTotals = Array(12).fill(0)
      subscriptions.forEach((sub) => {
        let monthIdx = 0
        if ('created_at' in sub && sub.created_at) {
          const date = new Date(sub.created_at as string)
          if (date.getFullYear() === currentYear) {
            monthIdx = date.getMonth()
          } else {
            return // skip if not current year
          }
        }
        monthlyTotals[monthIdx] +=
          calculateYearlyCost(sub, selectedCurrecny, currencies) / 12
      })
      setChartData(monthsArray.map((m, i) => ({
        month: m,
        total: monthlyTotals[i],
      })))
      const budgetValue = Number(budget) || 0
      setPercentData(monthsArray.map((m, i) => ({
        month: m,
        percent: budgetValue > 0 ? Number(((monthlyTotals[i] / budgetValue) * 100).toFixed(2)) : 0
      })))
    }
  }, [subscriptions, selectedCurrecny, budget, currencies, calculateYearlyCost])


  return (
    <div className={`max-w-6xl mx-auto ${classes}`}>
      <Preloader
        loading={isPendingSubscriptions && !subscriptions}
        classes={`${!isPage ? 'h-48' : 'h-[42vh] md:h-[50vh'}`}
      />


      <AnaliticsInputPanel 
        selectedCurrecny={selectedCurrecny} 
        budget={budget} 
        updateBudget={(amount, currency) => {
          setBudget(amount);
          setSelectedCurrecny(currency)
        }} />

      {subscriptions && (
        <>
          <div className="w-full h-64 md:h-96 mt-8">
            <div className="text-xl font-semibold mb-2 text-center text-white">
              Subscriptions cost by month.
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number | string) =>
                    `${Number(value).toFixed(2)} ${selectedCurrecny}`
                  }
                />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <br />
          <div className="w-full h-64 md:h-96 mt-8">
            <div className="text-xl font-semibold mb-2 text-center text-white">
              % of budget spent by subscriptions per month
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={percentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value: number | string) => `${value}%`} />
                <Bar dataKey="percent" fill="#82ca9d" name="% of budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
export default SubscriptionRate


const AnaliticsInputPanel = ({ selectedCurrecny, updateBudget, budget } : {
  selectedCurrecny: string,
  budget: string,
  updateBudget: (amount: string, currencyL: string) => void
}) => {

  const [currency, setCurrency] = useState(selectedCurrecny);
  const {
    data: curentRate,
  } = useGetFullRates(selectedCurrecny)

  useEffect(() => {
    const settedBudget = localStorage.getItem('sbc_budget')
    settedBudget && updateBudget(settedBudget, currency);
  }, []);

 
  const calculateBudgetByCurrency = async (currency: string) => {

    if (!curentRate) {
      console.log('Rate is undefined', curentRate)
      return 
    }

    const calcBudget: number | undefined = curentRate && parseFloat(budget) * curentRate?.rates[currency]
    if (!curentRate) {
      console.error('We have problem with getting current rate for selected currency')
    }
    if (curentRate && currency === 'USD') {
      updateBudget(localStorage.getItem('sbc_budget')!, currency)
    } else {
      updateBudget(calcBudget!.toFixed(2).toString(), currency)
    }
    setCurrency(currency)
  }

  useEffect(() => {
    curentRate && calculateBudgetByCurrency(currency)
  }, [currency]);

  return (
    <div className="flex items-center gap-x-4">
      <div>
        <label className="mr-2 mb-1 inline-block text-white">
          Currency
        </label>
        <CurrencySelectElement
          selectedCurrecny={currency}
          extEvent={(curr: string) => setCurrency(curr)}
          classes="max-w-40" />
      </div>
      <div>
        <label htmlFor="montlyBudget" className="mr-2 mb-1 inline-block text-white">
          Montly budget
        </label>
        <input
          id="montlyBudget"
          className="block border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm md:basis-24"
          type="number"
          value={budget}
          onInput={(e) => {
            const budgetValue = (e.target as HTMLInputElement).value
            updateBudget(budgetValue, currency)
          }}
          placeholder="You montly budget ..." />
      </div>
    </div>
  )
}