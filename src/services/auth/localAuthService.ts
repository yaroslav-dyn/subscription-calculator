import type { IAuthService } from './types'

const GUEST_USER_KEY = 'sbc_guest_user_id'

function getOrCreateGuestId(): string {
  const existing = localStorage.getItem(GUEST_USER_KEY)
  if (existing) return existing
  const id = crypto.randomUUID()
  localStorage.setItem(GUEST_USER_KEY, id)
  return id
}

export const localAuthService: IAuthService = {
  async getUser() {
    const id = getOrCreateGuestId()
    return {
      id,
      email: undefined,
      app_metadata: { provider: 'local' },
    }
  },

  async signOut() {
    localStorage.removeItem(GUEST_USER_KEY)
    // Clear IndexedDB data on sign out
    try {
      const dbs = await window.indexedDB.databases()
      for (const db of dbs) {
        if (db.name) {
          window.indexedDB.deleteDatabase(db.name)
        }
      }
    } catch {
      // Some browsers don't support indexedDB.databases()
    }
    // Regenerate guest user
    getOrCreateGuestId()
  },

  onAuthStateChange(callback) {
    // Local auth state never changes after initial guest creation
    // Fire once with the current user
    localAuthService.getUser().then((user) => callback(user))
    return () => {}
  },

  async signInWithPassword() {
    // No-op: user is always "logged in" as guest
    return {}
  },

  async signInWithOAuth() {
    return {}
  },

  async signUp() {
    return {}
  },
}
