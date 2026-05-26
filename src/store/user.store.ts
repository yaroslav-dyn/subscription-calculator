import { Store } from '@tanstack/store'
import type { AppUser } from '@/services/auth'

interface UserStoreState {
  user: AppUser | null
}

const userStoreData: UserStoreState = {
  user: null,
}

export const userStore = new Store<UserStoreState>(userStoreData)
