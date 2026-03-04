'use client'

import { Card } from '@/components/ui'

export default function TwoFAPage() {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-3 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Công cụ 2FA</h1>
        <p className="text-sm text-gray-600">
          Công cụ kiểm tra và lấy mã xác thực hai yếu tố (2FA) cho tài khoản của bạn
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
          <h2 className="text-lg font-semibold mb-1">Kiểm tra mã 2FA</h2>
          <p className="text-sm text-white/90">
            Nhập mã bí mật hoặc quét QR code để lấy mã xác thực
          </p>
        </div>

        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-20 h-20 mx-auto mb-4 text-primary/20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Truy cập công cụ 2FA</h3>
            <p className="text-sm text-gray-600 mb-6">
              Nhấn vào nút bên dưới để mở công cụ kiểm tra mã 2FA trong tab mới
            </p>
            <a
              href="https://2fa.live/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Mở công cụ 2FA
            </a>
          </div>
        </div>
      </Card>

      <Card className="mt-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Lưu ý khi sử dụng:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Mã 2FA thay đổi mỗi 30 giây</li>
              <li>Không chia sẻ mã bí mật với người khác</li>
              <li>Lưu trữ mã backup ở nơi an toàn</li>
              <li>Công cụ sẽ mở trong tab mới để đảm bảo bảo mật</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
