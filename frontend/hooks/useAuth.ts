import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/lib/api'

interface User {
  id: string
  email: string
  username: string
  role: string
  balance: number
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setIsLoggedIn(false)
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.USERS.ME, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setIsLoggedIn(true)
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('access_token')
        localStorage.removeItem('isLoggedIn')
        setIsLoggedIn(false)
        setUser(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setIsLoggedIn(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
      setIsLoggedIn(loggedIn)
      
      if (loggedIn) {
        fetchUser()
      } else {
        setLoading(false)
      }
    }

    checkLoginStatus()

    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus)

    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setUser(null)
    window.dispatchEvent(new Event('storage'))
  }

  return { isLoggedIn, user, loading, logout, refetch: fetchUser }
}
