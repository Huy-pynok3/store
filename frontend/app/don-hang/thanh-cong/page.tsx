import Link from 'next/link'

export default function OrderSuccessPage() {
  // Mock order data
  const order = {
    id: 'ZMLFSNUO4T',
    date: '10/08/2024 12:30',
    total: 800,
    discount: 0,
    payment: 800,
    status: 'Tạm giữ tiền',
    items: [
      {
        id: 1,
        name: 'TIKTOK VIỆT GIÁ RẺ SIÊU TRÂU',
        quantity: 1,
        price: 800
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center">
            <i className="fas fa-check text-green-500 text-4xl"></i>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cảm ơn</h1>
          <p className="text-gray-600">Đơn hàng đã được xử lý thành công</p>
        </div>

        {/* View Orders Button */}
        <div className="flex justify-center mb-8">
          <Link
            href="/don-hang"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded text-sm font-medium transition-colors"
          >
            Đơn hàng đã mua
          </Link>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-6">
            <div>
              <div className="text-gray-600 mb-1">Mã đơn hàng</div>
              <div className="font-bold text-green-600">{order.id}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Ngày mua</div>
              <div className="font-medium text-gray-800">{order.date}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Tổng</div>
              <div className="font-medium text-gray-800">{order.total}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Giảm giá</div>
              <div className="font-medium text-gray-800">{order.discount}</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Thanh toán</div>
              <div className="font-bold text-red-600">{order.payment} VNĐ</div>
            </div>
            <div>
              <div className="text-gray-600 mb-1">Trạng thái</div>
              <div className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded">
                {order.status}
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-800 mb-3 uppercase text-sm">Sản phẩm</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Sản phẩm</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Số lượng</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-black rounded flex items-center justify-center flex-shrink-0">
                            <i className="fab fa-tiktok text-white text-xl"></i>
                          </div>
                          <span className="font-medium text-gray-800">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-800">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-800">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-bold text-gray-800 mb-2">Lưu ý:</h4>
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            <li>Để tự hàng đã mua: Bấm vào <span className="font-medium">MÃ ĐƠN HÀNG</span> để xem chi tiết sản phẩm đã mua.</li>
            <li>Tạp Hóa MMO là nơi MUA VÀ BÁN, vui lòng không gian hàng sản phẩm không nào rõ bằng người bán hàng, nếu có bất cứ thắc mắc gì về mặt hàng, xin liên hệ chỉ shop để được giải quyết hoặc bảo hành.</li>
            <li>Nếu có vấn đề gì về đơn hàng, vui lòng nhấn cho <span className="font-medium">người bán</span>, nếu không được giải quyết hãy vào liên hệ đơn hàng chọn Khiếu nại. Chúng tôi sẽ xem xét và xử lý đơn hàng chọn Khiếu nại.</li>
            <li>Bên mình sẽ giữ tiền 2 ngày, trong trường hợp đơn hàng không có khiếu nại gì, tiền sẽ được chuyển cho người bán, tỉ lệ vận hành KIỂM TRA KỸ SẢN PHẨM sau khi mua.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
