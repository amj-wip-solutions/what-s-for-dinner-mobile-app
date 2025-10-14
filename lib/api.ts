// API client for making authenticated requests
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with proper error handling
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment variables:', {
  supabaseUrl: supabaseUrl ? 'Set' : 'Not set',
  supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Not set'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables')
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null


// API client using axios
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.197:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
    async (config) => {
      if (supabase) {
        try {
          // Get the current session from Supabase
          const { data } = await supabase.auth.getSession()

          if (data.session?.access_token) {
            // If a token exists, add it to the Authorization header
            config.headers['Authorization'] = `Bearer ${data.session.access_token}`
          }
        } catch (error) {
          console.warn('Failed to get Supabase session:', error)
        }
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

// Response interceptor for better error handling
apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response) {
        // Server responded with error status
        console.error('API Error:', error.response.status, error.response.data)
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network Error:', error.request)
      } else {
        // Something else happened
        console.error('Error:', error.message)
      }
      return Promise.reject(error)
    }
)

export default apiClient
