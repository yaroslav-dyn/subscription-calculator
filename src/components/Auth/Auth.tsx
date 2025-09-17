import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import CalculatorHeading from '@/components/CalculatorHeading'
import type { IMessageDrawerData } from '@/lib/utils/types'

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<IMessageDrawerData>({status: false, message: '', type: 'DEFAULT'});

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
        setLoading(false)
      },
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        console.error('Sign up successful! Please sign in.')
        setAuthError({
          type: 'SUCCESS',
          status: true,
          message: 'Sign up successful! Please sign in.'
        })
        setIsSignUp(false) // Switch to sign in form
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      console.error(error.error_description || error.message)
      setAuthError({
        type: 'ERROR',
        status: true,
        message: error.error_description || error.message
      })
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return <div className="text-white text-center p-4">Loading...</div>
  }

  if (!session) {
    return (
      <div className='min-h-[calc(100vh-118px)] flex flex-col justify-center gap-y-4'>

        <CalculatorHeading />

        <div className="flex justify-center items-center max-md:px-2">
          <div className="w-full max-w-md p-8 space-y-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-sm">
            <h1 className="text-2xl font-bold text-center text-white">
              {isSignUp ? 'Create an Account' : 'Sign In'}
            </h1>
            <form onSubmit={handleAuthAction} className="space-y-6">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-500/80 rounded-xl text-white hover:bg-purple-500 transition-colors"
                disabled={loading}
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-white/70 hover:text-white"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {children}
    </div>
  )
}
