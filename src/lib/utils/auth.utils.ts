import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { userStore } from '@/store/user.store'
console.log("🚀 ~ userStore:", userStore)
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { setNotification } from '@/store/notificationStore'


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

//TODO: excessive functionality
export const useUser = () => {
  const user = useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity, // User data is stable, refetch on auth change
  })
  return user
}

export const clearUser = () => {
  userStore.setState((state) => ({
    ...state,
    user: null
  }));
}

export const setUser = (user: User) => {
  userStore.setState((state) => ({
    ...state,
    user
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