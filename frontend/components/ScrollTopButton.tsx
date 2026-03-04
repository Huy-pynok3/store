'use client'

import { useEffect, useState } from 'react'

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 180)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      aria-label="Len dau trang"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-2 right-2 z-[220] flex h-10 w-10 items-center justify-center rounded-full bg-[#23bb73] text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] sm:bottom-4 sm:right-4"
    >
      <i className="fas fa-chevron-up text-[14px]"></i>
    </button>
  )
}
