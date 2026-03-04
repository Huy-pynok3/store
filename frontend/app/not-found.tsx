import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-600 mb-6">
          Vui lòng liên hệ hỗ nhận viên để được hỗ trợ.
        </p>
        <Link 
          href="/"
          className="inline-block bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded transition-colors"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  )
}
