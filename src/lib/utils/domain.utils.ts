export interface IDomain {
  id?: string
  name: string
  provider: string
  expiry_date: string
  renewal_cost: string
  auto_renewal: boolean
}

const getExpiringDomains = (domains: Array<IDomain>) => {
  return domains
    .filter((domain) => {
      const daysLeft = getDaysUntilExpiry(domain.expiry_date)
      return daysLeft <= 30 && daysLeft >= 0
    })
    .sort(
      (a, b) =>
        getDaysUntilExpiry(a.expiry_date) - getDaysUntilExpiry(b.expiry_date),
    )
}

const getDaysUntilExpiry = (expiry_date: string) => {
  const today = new Date()
  const expiry = new Date(expiry_date)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const getStatusColor = (daysLeft: number) => {
  if (daysLeft < 0) return 'text-gray-400' // Expired
  if (daysLeft <= 1) return 'text-red-400' // Critical
  if (daysLeft <= 7) return 'text-orange-400' // Warning
  if (daysLeft <= 30) return 'text-yellow-400' // Attention
  return 'text-green-400' // Safe
}

const getStatusBg = (daysLeft: number) => {
  if (daysLeft < 0) return 'bg-gray-500/20'
  if (daysLeft <= 1) return 'bg-red-500/20'
  if (daysLeft <= 7) return 'bg-orange-500/20'
  if (daysLeft <= 30) return 'bg-yellow-500/20'
  return 'bg-green-500/20'
}

export const useDomainUtils = () => {
  return {
    getDaysUntilExpiry,
    getExpiringDomains,
    getStatusColor,
    getStatusBg,
  }
}
