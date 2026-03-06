'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const validateToken = useCallback(async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data)
      setIsLoading(false)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
      setIsLoading(false)
      router.push('/login')
    }
  }, [router])

    useEffect(() => {
    const initAuth = async () => {
        const storedToken = localStorage.getItem('token')

        if (!storedToken) {
        setIsLoading(false)
        return
        }

        try {
        setToken(storedToken)

        const response = await api.get('/auth/me')
        setUser(response.data)
        } catch {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
        router.push('/login')
        } finally {
        setIsLoading(false)
        }
    }

    initAuth()
    }, [router])

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { token: newToken, ...userData } = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated: !!token && !!user,
      }}
    >
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
