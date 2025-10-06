import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/api'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
console.log('auth provider rendered', supabase)
  useEffect(() => {
    // Only initialize if supabase is available
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Failed to get initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } }
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Sign up error:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign up failed:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    if (!supabase) return

    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
