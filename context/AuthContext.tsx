'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '@/services/api'

interface User {
  _id: string
  fullname: string
  email: string
  phone?: string
  role: 'customer' | 'admin'
  isVerified: boolean
  address?: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (creds: any) => Promise<any>
  logout: () => void
  updateUser: (u: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('pasam_token')
    const storedUser  = localStorage.getItem('pasam_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      try { setUser(JSON.parse(storedUser)) } catch {}
    }
    if (storedToken) {
      authAPI.getMe()
        .then(({ data }) => { setUser(data.user); localStorage.setItem('pasam_user', JSON.stringify(data.user)) })
        .catch(() => { localStorage.removeItem('pasam_token'); localStorage.removeItem('pasam_user'); setToken(null); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (creds: any) => {
    const { data } = await authAPI.login(creds)
    localStorage.setItem('pasam_token', data.token)
    localStorage.setItem('pasam_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = useCallback(() => {
    localStorage.removeItem('pasam_token')
    localStorage.removeItem('pasam_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = (u: User) => {
    setUser(u)
    localStorage.setItem('pasam_user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'admin',
      login, logout, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
