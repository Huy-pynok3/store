'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DropdownItem {
  name: string
  href: string
}

interface DropdownMenuProps {
  title: string
  items: DropdownItem[]
}

export default function DropdownMenu({ title, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-[13px] text-white/90 hover:opacity-80">
        <span>{title}</span>
        <i className="fas fa-chevron-down text-xs"></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-[1000]">
          <div className="bg-white border border-gray-200 rounded shadow-lg w-[280px] p-4">
            <div className={`${items.length > 2 ? 'grid grid-cols-2 gap-x-4' : 'flex gap-x-8'} gap-y-0`}>
              {items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-800 hover:text-primary py-0.5 whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
