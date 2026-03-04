import Link from 'next/link'
import { Card } from './ui'

const products = [
  { id: 1, stock: 167000, price: '15.000 - 15.000đ', name: 'Tài Khoản Github Reg Tay Full 2FA - Hàng Reg New - Ngâm 1-3 Tháng', reviews: 0, sold: 0 },
  { id: 2, stock: 15, price: '5.000đ', name: 'Like,Follow giá cực rẻ', reviews: 0, sold: 0 },
  { id: 3, stock: 400, price: '35.000 - 180.000đ', name: 'TÀI KHOẢN CHATGPT PLUS, CHATGPT BUSINESS, CHATGPT GO DÙNG RIÊNG 100% BẢO HÀNH FULL', reviews: 0, sold: 0 },
  { id: 4, stock: 2262, price: '20.000đ', name: 'FACEBOOK việt cổ 2010-2025 nhiều bài đăng 500bb - 5000 bạn bè acc siêu trâu , siêu đẹp', reviews: 0, sold: 0 },
  { id: 5, stock: 0, price: '119.000đ', name: 'VidIQ-Max (Full tính năng) Theo Tháng dùng riêng', reviews: 0, sold: 0 },
  { id: 6, stock: 0, price: '3.000.000đ', name: 'Tool Hotmail', reviews: 0, sold: 0 },
  { id: 7, stock: 6, price: '40.000đ', name: 'CapCut Pro 25-39 Day Tối Đa 3 Thiết Bị', reviews: 0, sold: 0 },
  { id: 8, stock: 462, price: '249.000 - 559.000đ', name: 'NÂNG CẤP DUOLINGO SUPER, DUOLINGO MAX CHÍNH CHỦ - BẢO HÀNH FULL 24/7', reviews: 0, sold: 0 },
]

export default function ProductGrid() {
  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Sản phẩm mới nhất</h2>
        <Link href="/san-pham" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/san-pham/${product.id}`}
            className="block"
          >
            <Card padding="sm" className="hover:shadow-sm transition-shadow h-full">
              <div className="text-xs text-primary font-semibold mb-1">
                Tồn: {product.stock.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mb-2">{product.price}</div>
              <h3 className="text-xs font-medium text-gray-800 mb-2 leading-tight line-clamp-2 min-h-[32px]">
                {product.name}
              </h3>
              <div className="text-xs text-gray-500">
                {product.reviews} Reviews | Bán: {product.sold}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
