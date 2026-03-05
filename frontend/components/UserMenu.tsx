'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function UserMenu({ isOpen, onClose, onLogout }: UserMenuProps) {
  const { user } = useAuth()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-[200]"
        onClick={onClose}
      />

      {/* Menu Popup */}
      <div className="fixed top-[100px] right-8 w-full max-w-[280px] bg-white rounded shadow-lg z-[201]">
        {/* User Info Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <Link
            href="/thong-tin-tai-khoan"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Thông tin tài khoản
          </Link>
          <Link
            href="/don-hang"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Đơn hàng đã mua
          </Link>
          <Link
            href="/gian-hang-yeu-thich"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Gian hàng yêu thích
          </Link>
          <Link
            href="/lich-su-thanh-toan"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Lịch sử thanh toán
          </Link>
          <Link
            href="/reseller"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Reseller
          </Link>
          <Link
            href="/quan-ly-noi-dung"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Quản lý nội dung
          </Link>
          <Link
            href="/doi-mat-khau"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Đổi mật khẩu
          </Link>
          <Link
            href="/quan-ly-cua-hang"
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Quản lý cửa hàng
          </Link>
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={() => {
              onLogout()
              onClose()
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Thoát
          </button>
        </div>
      </div>
    </>
  )
}

