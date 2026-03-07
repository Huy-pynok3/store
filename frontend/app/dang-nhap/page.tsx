'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, LoadingSpinner } from '@/components/ui'
import { dispatchAuthStateChange } from '@/lib/auth-events'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    localStorage.setItem('isLoggedIn', 'true')
    dispatchAuthStateChange()
    
    const timer = setTimeout(() => {
      router.push('/')
      router.refresh()
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Đăng nhập</h1>
      <p className="text-gray-600 text-sm mb-8">Đang kiểm tra đăng nhập</p>
      <Button variant="primary" size="lg" className="mb-12">
        Đăng nhập
      </Button>
      <LoadingSpinner />
    </div>
  )
}
