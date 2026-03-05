'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OAuthHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (token) {
      // Store JWT token
      localStorage.setItem('access_token', token)
      localStorage.setItem('isLoggedIn', 'true')
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('storage'))
      
      // Remove token from URL and redirect to home
      router.replace('/')
      
      // Force reload to update all components
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } else if (error) {
      // Handle OAuth error
      console.error('OAuth error:', error)
      router.replace('/dang-ky?error=' + error)
    }
  }, [searchParams, router])

  return null
}
