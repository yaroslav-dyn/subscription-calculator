import type { User } from '@supabase/supabase-js'
import { Store } from '@tanstack/store'


interface UserStoreState {
  user: User | null
}

const userStoreData: UserStoreState = {
  user: null,
}

export const userStore = new Store<UserStoreState>(userStoreData)