import type { ISubscription } from '@/lib/utils/types'
import type { IDomain } from '@/lib/utils/domain.utils'

export interface IDataService {
  fetchSubscriptions(userId: string): Promise<ISubscription[]>
  addSubscription(sub: ISubscription, userId: string): Promise<ISubscription>
  removeSubscription(id: string): Promise<void>
  updateSubscription(
    id: string,
    values: Partial<ISubscription>,
  ): Promise<ISubscription>
  fetchDomains(userId: string): Promise<IDomain[]>
  addDomain(domain: IDomain, userId: string): Promise<IDomain>
  removeDomain(id: string): Promise<void>
  updateDomain(id: string, values: Partial<IDomain>): Promise<IDomain>
}
