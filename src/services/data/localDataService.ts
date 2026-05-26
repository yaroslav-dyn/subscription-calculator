import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { IDataService } from './types'
import type { ISubscription } from '@/lib/utils/types'
import type { IDomain } from '@/lib/utils/domain.utils'
import demoData from '../../../sql/.demo_data.json'

const DB_NAME = 'subscription-calculator-local'
const DB_VERSION = 1

interface LocalSubscription extends ISubscription {
  user_id: string
  created_at?: string
}

interface LocalDomain extends IDomain {
  user_id: string
  created_at?: string
  updated_at?: string
}

interface MyDB extends DBSchema {
  subscriptions: {
    key: string
    value: LocalSubscription
    indexes: { user_id: string }
  }
  domains: {
    key: string
    value: LocalDomain
    indexes: { user_id: string }
  }
}

let dbPromise: Promise<IDBPDatabase<MyDB>> | null = null

function getDB(): Promise<IDBPDatabase<MyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<MyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const subStore = db.createObjectStore('subscriptions', {
          keyPath: 'id',
        })
        subStore.createIndex('user_id', 'user_id')

        const domainStore = db.createObjectStore('domains', {
          keyPath: 'id',
        })
        domainStore.createIndex('user_id', 'user_id')
      },
    })
  }
  return dbPromise
}

function normalizeDomain(raw: any): LocalDomain {
  return {
    id: raw.id || crypto.randomUUID(),
    name: raw.name,
    provider: raw.provider || 'Cloudflare',
    expiry_date: raw.expiry_date,
    renewal_cost: raw.renewal_cost || '0',
    auto_renewal: raw.auto_renewal ?? raw.autoRenewal ?? false,
    user_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

function normalizeSubscription(raw: any): LocalSubscription {
  return {
    id: raw.id || crypto.randomUUID(),
    name: raw.name,
    price: raw.price,
    period: raw.period,
    currency: raw.currency,
    user_id: '',
    created_at: new Date().toISOString(),
  }
}

export async function seedLocalDB(userId: string): Promise<void> {
  const db = await getDB()
  const tx = db.transaction(['subscriptions', 'domains'], 'readwrite')
  const subStore = tx.objectStore('subscriptions')
  const domainStore = tx.objectStore('domains')

  // Check if already seeded
  const existingSubs = await subStore.index('user_id').getAll(userId)
  const existingDomains = await domainStore.index('user_id').getAll(userId)
  if (existingSubs.length > 0 || existingDomains.length > 0) {
    await tx.done
    return
  }

  // Seed subscriptions
  for (const sub of demoData.subscriptions) {
    const normalized = normalizeSubscription(sub)
    normalized.user_id = userId
    await subStore.add(normalized)
  }

  // Seed domains
  for (const domain of demoData.domains) {
    const normalized = normalizeDomain(domain)
    normalized.user_id = userId
    await domainStore.add(normalized)
  }

  await tx.done
}

export const localDataService: IDataService = {
  async fetchSubscriptions(userId: string) {
    const db = await getDB()
    const subs = await db
      .transaction('subscriptions')
      .objectStore('subscriptions')
      .index('user_id')
      .getAll(userId)
    return subs
  },

  async addSubscription(sub: ISubscription, userId: string) {
    const db = await getDB()
    const record: LocalSubscription = {
      ...sub,
      id: sub.id || crypto.randomUUID(),
      user_id: userId,
      created_at: new Date().toISOString(),
    }
    await db.add('subscriptions', record)
    return record
  },

  async removeSubscription(id: string) {
    const db = await getDB()
    await db.delete('subscriptions', id)
  },

  async updateSubscription(id: string, values: Partial<ISubscription>) {
    const db = await getDB()
    const existing = await db.get('subscriptions', id)
    if (!existing) throw new Error('Subscription not found')
    const updated = { ...existing, ...values, updated_at: new Date().toISOString() }
    await db.put('subscriptions', updated)
    return updated
  },

  async fetchDomains(userId: string) {
    const db = await getDB()
    const domains = await db
      .transaction('domains')
      .objectStore('domains')
      .index('user_id')
      .getAll(userId)
    return domains
  },

  async addDomain(domain: IDomain, userId: string) {
    const db = await getDB()
    const record: LocalDomain = {
      ...domain,
      id: domain.id || crypto.randomUUID(),
      user_id: userId,
      renewal_cost: domain.renewal_cost || '0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    await db.add('domains', record)
    return record
  },

  async removeDomain(id: string) {
    const db = await getDB()
    await db.delete('domains', id)
  },

  async updateDomain(id: string, values: Partial<IDomain>) {
    const db = await getDB()
    const existing = await db.get('domains', id)
    if (!existing) throw new Error('Domain not found')
    const updated = { ...existing, ...values, updated_at: new Date().toISOString() }
    await db.put('domains', updated)
    return updated
  },
}
