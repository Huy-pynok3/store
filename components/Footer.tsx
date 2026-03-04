import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-8">
      <div className="max-w-[1600px] w-full mx-auto px-3 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Liên hệ */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Liên hệ</h3>
            <p className="text-sm text-gray-600 mb-4">
              Liên hệ ngay nếu bạn có khó khăn khi sử dụng dịch vụ hoặc cần hợp tác.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <i className="fas fa-comments text-gray-500"></i>
                <span>Chat với hỗ trợ viên</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fab fa-facebook text-gray-500"></i>
                <span>Tạp hóa MMO</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="far fa-envelope text-gray-500"></i>
                <span>support@taphoammo.net</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="far fa-clock text-gray-500"></i>
                <span>Mon-Sat 08:00am - 10:00pm</span>
              </li>
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Thông tin</h3>
            <p className="text-sm text-gray-600 mb-3">
              Một ứng dụng nhằm kết nối, trao đổi, mua bán trong cộng đồng kiếm tiền online.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>Thanh toán tự động, nhận hàng ngay tức thì.</li>
              <li><Link href="/faqs" className="hover:text-primary">Câu hỏi thường gặp</Link></li>
              <li><Link href="/dieu-khoan" className="hover:text-primary">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Đăng ký bán hàng */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">Đăng ký bán hàng</h3>
            <p className="text-sm text-gray-600 mb-4">
              Tạo một gian hàng của bạn trên trang của chúng tôi. Đội ngũ hỗ trợ sẽ liên lạc để giúp bạn tối ưu khả năng bán hàng.
            </p>
            <Link href="/dang-ky-ban-hang">
              <button className="bg-primary hover:bg-green-600 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                Tham gia
              </button>
            </Link>
            <p className="text-sm text-gray-600 mt-4 mb-2">Theo dõi chúng tôi trên mạng xã hội</p>
            <div className="flex gap-2">
              <a href="#" className="w-9 h-9 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors">
                <i className="fas fa-rss text-white text-sm"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-youtube text-white text-sm"></i>
              </a>
              <a href="#" className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                <i className="fab fa-facebook-f text-white text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
