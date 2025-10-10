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

  // Prepare chart data: group subscriptions by month for current year
  const currentYear = new Date().getFullYear()
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

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
          calculateYearlyCost(sub, displayCurrency, currencies) / 12
      })
      setChartData(months.map((m, i) => ({
        month: m,
        total: monthlyTotals[i],
      })))
      const budgetValue = Number(budget) || 0
      setPercentData(months.map((m, i) => ({
        month: m,
        percent: budgetValue > 0 ? Number(((monthlyTotals[i] / budgetValue) * 100).toFixed(2)) : 0
      })))
    }
  }, [subscriptions, displayCurrency, budget, currencies, calculateYearlyCost])



  return (
    <div className={`max-w-6xl mx-auto ${classes}`}>
      <Preloader
        loading={isPendingSubscriptions && !subscriptions}
        classes={`${!isPage ? 'h-48' : 'h-[42vh] md:h-[50vh'}`}
      />

      <div className="flex items-center gap-x-4">
        <CurrencySelectElement classes="max-w-40" />
        <div>
          <label htmlFor="montlyBudget" className="mr-2 inline-block text-white">
            Montly budget
          </label>
          <input
            id="montlyBudget"
            className="border border-white rounded-2xl text-white p-2 bg-white/10 backdrop-blur-sm md:basis-24"
            type="number"
            value={budget}
            onInput={(e) => setBudget((e.target as HTMLInputElement).value)}
            placeholder="You montly budget ..."
          />
        </div>
      </div>

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
                    `${Number(value).toFixed(2)} ${displayCurrency}`
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
