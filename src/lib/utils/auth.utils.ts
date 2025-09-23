import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { Store } from '@tanstack/store'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface UserStoreState {
  currentUser: User | null
}

const userStoreData = {
  currentUser: null,
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
    user,
  }))
  return user
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
