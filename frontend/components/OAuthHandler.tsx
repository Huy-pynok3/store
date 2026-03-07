'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { dispatchAuthStateChange } from '@/lib/auth-events'

function OAuthHandlerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')
    const error = searchParams.get('error')

    if (token) {
      // Store JWT token
      localStorage.setItem('access_token', token)
      localStorage.setItem('isLoggedIn', 'true')
      
      dispatchAuthStateChange()
      
      // Remove token from URL and redirect to home
      router.replace('/')
    } else if (error) {
      // Handle OAuth error
      console.error('OAuth error:', error)
      router.replace('/dang-ky?error=' + error)
    }
  }, [searchParams, router])

  return null
}

export default function OAuthHandler() {
  return (
    <Suspense fallback={null}>
      <OAuthHandlerContent />
    </Suspense>
  )
}
