'use client'

import { Card } from '@/components/ui'

export default function CheckLiveFBPage() {
  return (
    <div className="max-w-[1200px] w-full mx-auto px-3 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Check Live Facebook</h1>
        <p className="text-sm text-gray-600">
          Công cụ kiểm tra tài khoản Facebook còn sống hay đã bị khóa/checkpoint
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
          <h2 className="text-lg font-semibold mb-1">Kiểm tra tài khoản Facebook</h2>
          <p className="text-sm text-white/90">
            Nhập UID hoặc cookie để kiểm tra trạng thái tài khoản
          </p>
        </div>

        <div className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-20 h-20 mx-auto mb-4 text-blue-100" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Truy cập công cụ Check Live FB</h3>
            <p className="text-sm text-gray-600 mb-6">
              Nhấn vào nút bên dưới để mở công cụ kiểm tra tài khoản Facebook trong tab mới
            </p>
            <a
              href="https://www.facebook.com/checkpoint/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Mở công cụ Check Live FB
            </a>
          </div>
        </div>
      </Card>

      <Card className="mt-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Cảnh báo bảo mật:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Chỉ kiểm tra tài khoản của bạn hoặc có sự cho phép</li>
              <li>Không nhập thông tin tài khoản vào các trang không tin cậy</li>
              <li>Cookie có thể bị đánh cắp nếu sử dụng trên mạng công cộng</li>
              <li>Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</li>
              <li>Công cụ sẽ mở trong tab mới để đảm bảo bảo mật</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
