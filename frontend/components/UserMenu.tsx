'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

const menuItems = [
  { href: '/thong-tin-tai-khoan', label: 'Thông tin tài khoản' },
  { href: '/don-hang', label: 'Đơn hàng đã mua' },
  { href: '/gian-hang-yeu-thich', label: 'Gian hàng yêu thích' },
  { href: '/lich-su-thanh-toan', label: 'Lịch sử thanh toán' },
  { href: '/reseller', label: 'Reseller' },
  { href: '/quan-ly-noi-dung', label: 'Quản lý nội dung' },
  { href: '/doi-mat-khau', label: 'Đổi mật khẩu' },
]

export default function UserMenu({ isOpen, onClose, onLogout }: UserMenuProps) {
  const { user } = useAuth()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[200] animate-fadeIn"
        onClick={onClose}
      />

      {/* Menu Popup */}
      <div className="fixed top-[100px] right-8 w-full max-w-[280px] bg-white rounded shadow-lg z-[201] animate-slideDown">
        {/* User Info Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img 
              src="https://mimity-admin896.netlify.app/dist/img/user.svg" 
              alt={user?.username || 'User'} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-0.5">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Shop Management - Separated */}
        <div className="border-t border-b border-gray-200 py-0.5">
          <Link
            href="/quan-ly-cua-hang"
            className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={onClose}
          >
            Quản lý cửa hàng
          </Link>
        </div>

        {/* Logout Button */}
        <div className="py-0.5">
          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="w-full text-left px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Thoát
          </button>
        </div>
      </div>
    </>
  )
}

