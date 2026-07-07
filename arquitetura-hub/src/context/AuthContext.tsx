import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User, UserRole } from '@/types'
import { supabase, useMocks } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'demo@admin.com': {
    password: 'demo',
    user: { id: 'admin-1', email: 'demo@admin.com', full_name: 'Wladson Sidney', role: 'admin' },
  },
  'demo@membro.com': {
    password: 'demo',
    user: { id: 'member-1', email: 'demo@membro.com', full_name: 'Ana Lima', role: 'membro' },
  },
  'wladsonsidney@gmail.com': {
    password: '12345678',
    user: { id: 'member-2', email: 'wladsonsidney@gmail.com', full_name: 'Wladson Sidney', role: 'membro' },
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (useMocks) {
      const stored = localStorage.getItem('mock_user')
      if (stored) {
        try { setUser(JSON.parse(stored) as User) } catch {}
      }
      setLoading(false)
      return
    }

    supabase!.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        fetchProfile(data.session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: listener } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => { listener.subscription.unsubscribe() }
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) {
      setUser({ id: data.id, email: data.email, full_name: data.full_name, role: data.role as UserRole })
    }
    setLoading(false)
  }

  async function login(email: string, password: string) {
    if (useMocks) {
      const entry = MOCK_USERS[email]
      if (!entry || entry.password !== password) throw new Error('Credenciais inválidas')
      setUser(entry.user)
      localStorage.setItem('mock_user', JSON.stringify(entry.user))
      return
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }

  async function logout() {
    if (useMocks) {
      setUser(null)
      localStorage.removeItem('mock_user')
      return
    }
    await supabase!.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
