import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { userStore } from '@/store/user.store'
import type { AppUser } from '@/services/auth'
import { authService } from '@/services/auth'
import { setNotification } from '@/store/notificationStore'

export const getUser = async () => {
  return authService.getUser()
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

export const setUser = (user: AppUser | null) => {
  userStore.setState((state) => ({
    ...state,
    user
  }));
}

export const useAuthListener = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: ['user'] })
    })
    return () => {
      unsubscribe()
    }
  }, [queryClient])
}


export const useLogout = async () => {
  try {
    await authService.signOut()
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
