import axios from 'axios'
import { toast } from 'react-toastify'

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Show success message if provided
    if (response.data?.message) {
      toast.success(response.data.message)
    }
    return response
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          toast.error('Authentication required. Please login.')
          // Redirect to login if needed
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
          break
        case 403:
          toast.error('Access denied. Insufficient permissions.')
          break
        case 404:
          toast.error('Resource not found.')
          break
        case 422:
          // Validation errors
          if (data?.errors) {
            Object.values(data.errors).forEach((error: any) => {
              toast.error(error)
            })
          } else {
            toast.error(data?.message || 'Validation error occurred.')
          }
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data?.message || 'An unexpected error occurred.')
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.')
    } else {
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

export default api