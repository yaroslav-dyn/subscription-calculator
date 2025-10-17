import { useQuery, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Store } from '@tanstack/store'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { setNotification } from '@/store/notificationStore'

interface UserStoreState {
  user: UseQueryResult<User | null, Error> | null
}

const userStoreData: UserStoreState = {
  user: null,
}

export const userStore = new Store<UserStoreState>(userStoreData)

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error.message)
    return null
  }
  return user
}

export const useUser = () => {
  const user = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity, // User data is stable, refetch on auth change
  })
  userStore.setState((state) => ({
    ...state,
    user: user,
  }))
  return user
}

export const clearUser = () => {
  userStore.setState((state) => ({
    ...state,
    user: null
  }));
}

export const useAuthListener = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ['user'] })
    })
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [queryClient])
}


export const useLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error: any) {
    setNotification({
      type: 'ERROR',
      status: true,
      message: error.error_description || error.message,
      countdown: 6,
    })
  } finally {
    clearUser()
    return true
  }
}