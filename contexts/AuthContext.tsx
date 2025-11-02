'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-toastify'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'CLIENT'
  companyId?: string
  company?: {
    id: string
    name: string
    email: string
    phone?: string
    address?: string
    website?: string
    contactPerson?: string
  }
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isClient: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      if (response.data.success) {
        setUser(response.data.user)
      }
    } catch (error) {
      // User not authenticated, clear any stale data
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      })

      if (response.data.success) {
        setUser(response.data.user)
        toast.success('Login successful!')
        
        // Redirect based on role
        if (response.data.user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/client/dashboard')
        }
        
        return true
      }
      return false
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if API call fails, clear local state
      setUser(null)
      router.push('/login')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
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