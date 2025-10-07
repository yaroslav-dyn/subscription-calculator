import { useEffect, useState } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import CalculatorHeading from '@/components/CalculatorHeading'
import { setNotification } from '@/store/notificationStore'
import Preloader from '@/components/ui/Preloader'
import VectorIconsUI from '../ui/VectorIcons'

export const Auth = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

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
        setNotification({
          type: 'SUCCESS',
          status: true,
          message: 'Sign up successful! Please sign in.',
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
      setNotification({
        type: 'ERROR',
        status: true,
        message: error.error_description || error.message,
        countdown: 6,
      })
    } finally {
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: import.meta.env.VITE_APP_SUPPABASE_REDIRECT_URL
        },
      })
      if (error) throw error
    } catch (error: any) {
      setNotification({
        type: 'ERROR',
        status: true,
        message: error.error_description || error.message,
        countdown: 6,
      })
    } finally {
      setLoading(false)
    }
  }

  // if (loading) {
  //   return <div className="text-white text-center p-4 min-h-screen">Loading...</div>
  // }

  if (!session) {
    return (
      <div className="min-h-[calc(100vh-118px)] flex flex-col justify-center gap-y-4">
        {/* Background Elements */}
        <div className={`fixed min-h-screen md:inset-0 hidden xl:block`}>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <CalculatorHeading />

        <div className="flex justify-center items-center max-md:px-2">
          <div className="w-full max-w-md p-8 space-y-6 bg-white/10 rounded-2xl shadow-xl backdrop-blur-sm relative">
            <>
              <h1 className="text-2xl font-bold text-center text-white">
                {isSignUp ? 'Create an Account' : 'Sign In'}
              </h1>
              <form onSubmit={handleAuthAction} className="space-y-6">
                <input
                  name='input-email'
                  id='inputEmail'
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <input
                  name='input-password'
                  id='inputPassword'
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
                <button
                  type="button"
                  onClick={() => signInWithGoogle()}
                  className="w-full px-4 py-2 bg-blue-500/80 rounded-xl text-white hover:bg-blue-500 transition-colors flex items-center justify-center"
                  disabled={loading}
                >
                  {VectorIconsUI.googleAuthIcon()}
                  Sign In with Google
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
            </>
            <Preloader loading={loading} classes="bg-indigo-400/30" />
          </div>
        </div>
      </div>
    )
  }

  return <div>{children}</div>
}
