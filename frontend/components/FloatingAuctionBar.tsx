'use client'

import { useEffect, useState } from 'react'

const INITIAL_SECONDS = 1 * 24 * 60 * 60 + 8 * 60 * 60 + 22 * 60 + 16

function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const days = Math.floor(safe / 86400)
  const hours = Math.floor((safe % 86400) / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export default function FloatingAuctionBar() {
  const [countdown, setCountdown] = useState(INITIAL_SECONDS)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="fixed bottom-2 left-2 right-16 z-[210] sm:bottom-4 sm:left-4 sm:right-auto sm:w-[360px]">
      <div className="grid grid-cols-[24px_1fr] items-center rounded-sm border border-[#24a56d] bg-[#28bf76] px-2 py-1 shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
        <div className="relative flex h-6 w-6 items-center justify-center text-white">
          <i className="far fa-bell text-[13px]"></i>
          <span className="absolute -right-1 -top-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold leading-none text-[#1d9f5f]">
            1
          </span>
        </div>

        <div className="min-w-0 text-center">
          <p className="truncate text-[12px] font-semibold leading-none text-white">Đấu giá gian hàng top 1</p>
          <p className="mt-0.5 inline-block max-w-full truncate bg-[#f3c942] px-1.5 py-[2px] text-[10px] font-bold leading-none text-[#3d3d3d]">
            Sắp diễn ra: {formatCountdown(countdown)}
          </p>
        </div>
      </div>
    </div>
  )
}
