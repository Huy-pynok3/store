'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from './ui'

export default function InitialPageLoader() {
  const [visible, setVisible] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchKey = searchParams.toString()

  useEffect(() => {
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), 550)
    return () => window.clearTimeout(timer)
  }, [pathname, searchKey])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#f2f2f2]">
      <LoadingSpinner size="md" color="primary" />
    </div>
  )
}
