'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        if (user.role === 'ADMIN') {
          router.push('/admin/dashboard')
        } else {
          router.push('/client/dashboard')
        }
      } else {
        // Redirect to login
        router.push('/login')
      }
    }
  }, [isAuthenticated, user, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}
