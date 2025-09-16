import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useEffect } from 'react'

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
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity, // User data is stable, refetch on auth change
  })
}

export const useAuthListener = () => {
  const queryClient = useQueryClient()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Invalidate user query to refetch
        queryClient.invalidateQueries({ queryKey: ['user'] })
      },
    )

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [queryClient])
}
