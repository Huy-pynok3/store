'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import LoginPopup from './LoginPopup'
import UserMenu from './UserMenu'
import { DropdownMenu, NotificationBadge } from './ui'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const router = useRouter()
  const { isLoggedIn, user, logout } = useAuth()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileGroups, setOpenMobileGroups] = useState<Record<string, boolean>>({
    product: false,
    service: false,
    tool: false,
    language: false,
    account: false,
  })

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleUserIconClick = () => {
    const isMobile = window.innerWidth < 640
    
    if (isLoggedIn) {
      // On mobile: navigate to account page
      // On desktop: show user menu popup
      if (isMobile) {
        router.push('/thong-tin-tai-khoan')
      } else {
        setShowUserMenu(true)
      }
    } else {
      // Not logged in
      if (isMobile) {
        router.push('/dang-ky')
      } else {
        setShowLoginPopup(true)
      }
    }
  }

  const handleLogout = () => {
    logout()
  }

  const toggleMobileGroup = (key: keyof typeof openMobileGroups) => {
    setOpenMobileGroups((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Top Bar */}
      <div className="hidden sm:flex bg-[#f7f7f7] border-b border-gray-200 h-[30px] items-center sticky top-0 z-[100]">
        <div className="max-w-[1600px] w-full mx-auto px-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600 min-w-0">
            <span className="truncate">Hỗ trợ trực tuyến</span>
            <span className="hidden md:inline text-primary"><i className="fab fa-facebook mr-1"></i>Tạp Hóa MMO</span>
            <span className="hidden lg:inline"><i className="far fa-envelope mr-1"></i>support@taphoammo.net</span>
            <span className="hidden xl:inline"><i className="far fa-clock mr-1"></i>08:00am - 10:00pm</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/dang-ky-ban-hang" className="text-red-600 hover:text-red-700">
              Đăng ký bán hàng
            </Link>
            <span className="text-gray-600 hidden sm:inline">
              Ngôn ngữ: VI <i className="fas fa-chevron-down ml-1 text-[9px]"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="bg-primary text-white sticky top-0 sm:top-[30px] z-[100]">
        <div className="max-w-[1600px] w-full mx-auto px-3 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="sm:hidden h-9 w-9 flex items-center justify-center text-white/90"
                aria-label="Mở menu"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <i className="fas fa-bars text-base"></i>
              </button>
              <Link href="/" className="font-serif text-[25px] sm:text-[31px] font-semibold leading-tight">
                <span className="text-white">TapHoa</span>
                <span className="text-red-500">MMO</span>
              </Link>
              <nav className="hidden lg:flex items-center gap-5 ml-6">
                <DropdownMenu title="Sản phẩm" items={productItems} />
                <DropdownMenu title="Dịch vụ" items={serviceItems} />
                <Link href="/ho-tro" className="text-[13px] text-white/90 hover:opacity-80">Hỗ trợ</Link>
                <Link href="/chia-se" className="relative text-[13px] text-white/90 hover:opacity-80">
                  Chia sẻ
                  <NotificationBadge count="99+" position="custom" size="xs" className="absolute -top-3 -right-2" />
                </Link>
                <DropdownMenu title="Công cụ" items={toolItems} />
                <Link href="/faqs" className="text-[13px] text-white/90 hover:opacity-80">FAQs</Link>
                {isLoggedIn && (
                  <Link href="/nap-tien" className="text-[13px] text-white/90 hover:opacity-80">Nạp tiền</Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-3 sm:gap-[18px]">
              {isLoggedIn && (
                <span className="text-xs font-normal hidden md:inline">
                  {user ? `${user.balance.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
                </span>
              )}
              {isLoggedIn && (
                <Link href="/chat-box" className="relative cursor-pointer hover:opacity-80 transition-opacity leading-none" aria-label="Tin nhắn">
                  <i className="far fa-comment-dots text-[20px] sm:text-[18px]"></i>
                  <NotificationBadge count={0} />
                </Link>
              )}
              <button
                onClick={handleUserIconClick}
                className="relative h-9 w-9 flex items-center justify-center sm:h-auto sm:w-auto cursor-pointer hover:opacity-80 transition-opacity leading-none"
              >
                <svg className="w-[24px] h-[24px] sm:w-[20px] sm:h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" strokeWidth="2.5" />
                  <path d="M4 20a8 8 0 0 1 16 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
                <NotificationBadge count={0} className="hidden sm:flex" />
              </button>
            </div>
          </div>
          <nav className="mt-2 hidden sm:flex lg:hidden gap-4 overflow-x-auto whitespace-nowrap text-[13px] text-white/90 pb-1">
            <Link href="/san-pham/email" className="hover:opacity-80">Sản phẩm</Link>
            <Link href="/dich-vu/tang-tuong-tac" className="hover:opacity-80">Dịch vụ</Link>
            <Link href="/ho-tro" className="hover:opacity-80">Hỗ trợ</Link>
            <Link href="/chia-se" className="hover:opacity-80">Chia sẻ</Link>
            <Link href="/cong-cu/2fa" className="hover:opacity-80">Công cụ</Link>
            <Link href="/faqs" className="hover:opacity-80">FAQs</Link>
            {isLoggedIn && (
              <Link href="/nap-tien" className="hover:opacity-80">Nạp tiền</Link>
            )}
          </nav>
        </div>
      </header>

      {/* Marquee Bar */}
      <div className="bg-white border-b border-gray-200 h-6 sm:h-[30px] overflow-hidden sticky top-[44px] sm:top-[60px] z-[99]">
        <div className="whitespace-nowrap pl-full animate-marquee">
          <span className="text-red-500 text-[11px] sm:text-[13px] font-medium">
            Tạp Hóa MMO - Sàn thương mại điện tử sản phẩm số phục vụ Kiếm tiền online. Mọi giao dịch trên trang đều hoàn toàn tự động và được giữ tiền 3 ngày, thay thế cho hình thức trung gian, các
          </span>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[220] sm:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Đóng menu"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-[340px] bg-white shadow-xl">
            <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Menu</span>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center text-gray-500"
                aria-label="Đóng menu"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-48px)] text-[14px]">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block h-11 px-4 leading-[44px] border-b border-gray-100 text-gray-700">Trang chủ</Link>
              <button type="button" onClick={() => toggleMobileGroup('product')} className="w-full h-11 px-4 border-b border-gray-100 text-left flex items-center justify-between text-gray-700">
                <span>Sản phẩm</span><i className={`fas ${openMobileGroups.product ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] text-gray-500`}></i>
              </button>
              {openMobileGroups.product && (
                <div className="bg-gray-50 border-b border-gray-100">
                  {productItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">{item.name}</Link>
                  ))}
                </div>
              )}
              <button type="button" onClick={() => toggleMobileGroup('service')} className="w-full h-11 px-4 border-b border-gray-100 text-left flex items-center justify-between text-gray-700">
                <span>Dịch vụ</span><i className={`fas ${openMobileGroups.service ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] text-gray-500`}></i>
              </button>
              {openMobileGroups.service && (
                <div className="bg-gray-50 border-b border-gray-100">
                  {serviceItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">{item.name}</Link>
                  ))}
                </div>
              )}
              <Link href="/ho-tro" onClick={() => setIsMobileMenuOpen(false)} className="block h-11 px-4 leading-[44px] border-b border-gray-100 text-gray-700">Hỗ trợ</Link>
              <button type="button" onClick={() => toggleMobileGroup('tool')} className="w-full h-11 px-4 border-b border-gray-100 text-left flex items-center justify-between text-gray-700">
                <span>Công cụ</span><i className={`fas ${openMobileGroups.tool ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] text-gray-500`}></i>
              </button>
              {openMobileGroups.tool && (
                <div className="bg-gray-50 border-b border-gray-100">
                  {toolItems.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">{item.name}</Link>
                  ))}
                </div>
              )}
              {isLoggedIn && (
                <Link href="/nap-tien" onClick={() => setIsMobileMenuOpen(false)} className="block h-11 px-4 leading-[44px] border-b border-gray-100 text-gray-700">Nạp tiền</Link>
              )}
              <Link href="/chia-se" onClick={() => setIsMobileMenuOpen(false)} className="block h-11 px-4 leading-[44px] border-b border-gray-100 text-gray-700">Chia sẻ kinh nghiệm MMO</Link>
              <button type="button" onClick={() => toggleMobileGroup('account')} className="w-full h-11 px-4 border-b border-gray-100 text-left flex items-center justify-between text-gray-700">
                <span>Thông tin tài khoản</span><i className={`fas ${openMobileGroups.account ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] text-gray-500`}></i>
              </button>
              {openMobileGroups.account && (
                <div className="bg-gray-50 border-b border-gray-100">
                  <Link href="/thong-tin-tai-khoan" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Thông tin tài khoản</Link>
                  <Link href="/don-hang" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Đơn hàng đã mua</Link>
                  <Link href="/gian-hang-yeu-thich" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Gian hàng yêu thích</Link>
                  <Link href="/lich-su-thanh-toan" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Lịch sử thanh toán</Link>
                  <Link href="/reseller" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Reseller</Link>
                  <Link href="/doi-mat-khau" onClick={() => setIsMobileMenuOpen(false)} className="block h-10 px-6 leading-[40px] text-gray-600">Đổi mật khẩu</Link>
                </div>
              )}
              <button type="button" onClick={() => toggleMobileGroup('language')} className="w-full h-11 px-4 border-b border-gray-100 text-left flex items-center justify-between text-gray-700">
                <span>Ngôn ngữ</span><i className={`fas ${openMobileGroups.language ? 'fa-chevron-up' : 'fa-chevron-down'} text-[11px] text-gray-500`}></i>
              </button>
              {openMobileGroups.language && (
                <div className="bg-gray-50 border-b border-gray-100">
                  <button type="button" className="block h-10 px-6 leading-[40px] text-gray-600 w-full text-left">Tiếng Việt</button>
                  <button type="button" className="block h-10 px-6 leading-[40px] text-gray-600 w-full text-left">English</button>
                </div>
              )}
              <button
                type="button"
                className="block w-full h-11 px-4 text-left text-gray-700"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleLogout()
                }}
              >
                Thoát
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Login Popup */}
      <LoginPopup isOpen={showLoginPopup} onClose={() => setShowLoginPopup(false)} />

      {/* User Menu */}
      <UserMenu
        isOpen={showUserMenu}
        onClose={() => setShowUserMenu(false)}
        onLogout={handleLogout}
      />
    </>
  )
}

const productItems = [
  { name: 'Email', href: '/san-pham/email' },
  { name: 'Phần mềm', href: '/san-pham/phan-mem' },
  { name: 'Tài khoản', href: '/san-pham/tai-khoan' },
  { name: 'Khác', href: '/san-pham/khac' },
]

const serviceItems = [
  { name: 'Tăng tương tác', href: '/dich-vu/tang-tuong-tac' },
  { name: 'Dịch vụ phần mềm', href: '/dich-vu/phan-mem' },
  { name: 'Blockchain', href: '/dich-vu/blockchain' },
  { name: 'Dịch vụ khác', href: '/dich-vu/khac' },
]

const toolItems = [
  { name: '2FA', href: '/cong-cu/2fa' },
  { name: 'Check Live FB', href: '/cong-cu/check-live-fb' },
]
