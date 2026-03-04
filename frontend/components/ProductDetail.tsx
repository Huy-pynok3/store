'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StarRating, ProductBadge } from './ui'

interface Variant {
  id: number
  name: string
  price: number
  selected?: boolean
}

interface Product {
  id: number
  name: string
  rating: number
  reviews: number
  sold: number
  complaints: string
  seller: string
  sellerVerified?: boolean
  category: string
  stock: number
  price?: number
  description: string
  variants?: Variant[]
  features: string[]
  image?: string
  priceRange?: string
  detailedDescription?: string
  badge?: string
}

interface Review {
  id: number
  username: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export default function ProductDetail({ product, reviews }: { product: Product; reviews: Review[] }) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'api'>('reviews')
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find(v => v.selected) || product.variants[0]
  )
  const [showOrderModal, setShowOrderModal] = useState(false)

  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        {/* Left Sidebar - Empty or Filters */}
        <aside className="hidden xl:block sticky top-[110px]">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Danh mục</h3>
            <div className="text-sm text-gray-600">
              <Link href="/san-pham/email" className="block py-2 hover:text-primary">
                Email
              </Link>
              <Link href="/san-pham/phan-mem" className="block py-2 hover:text-primary">
                Phần mềm
              </Link>
              <Link href="/san-pham/tai-khoan" className="block py-2 hover:text-primary">
                Tài khoản
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-4">
            {/* Product Image */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="relative">
                {/* Product Image */}
                <div className="w-full h-[280px] sm:h-[360px] lg:h-[400px] bg-gradient-to-br from-red-400 to-pink-500 rounded flex items-center justify-center border-4 border-primary">
                  <div className="text-center">
                    <div className="text-white text-5xl mb-3">
                      <i className="fab fa-google"></i>
                    </div>
                    <div className="text-white text-2xl font-bold">Gmail</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  <ProductBadge type="no-duplicate" />
                  <ProductBadge type="warehouse" variant="info" />
                  <ProductBadge type="refund" variant="warning" />
                </div>

                {/* Heart Icon */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors shadow">
                  <i className="far fa-heart text-base"></i>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
              {/* Badge + Product Title */}
              <div>
                <ProductBadge type="product" className="mb-2" />
                <h1 className="text-lg font-bold text-primary leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <StarRating rating={product.rating} />
                <span className="text-gray-600">
                  {product.reviews} Reviews | Đã bán: {product.sold.toLocaleString()} | Khiếu nại: {product.complaints}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Seller */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-700">Người bán:</span>
                <Link href={`/seller/${product.seller}`} className="text-primary hover:underline font-medium">
                  {product.seller}
                </Link>
                {product.sellerVerified && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                    Đã xác thực
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="text-sm">
                <span className="text-gray-700">Sản phẩm: </span>
                <Link href={`/san-pham/${product.category.toLowerCase()}`} className="text-primary hover:underline font-medium">
                  {product.category}
                </Link>
              </div>

              {/* Stock */}
              <div className="text-sm text-gray-700">
                Kho: <span className="font-medium">{product.stock}</span>
              </div>

              {/* Price */}
              <div className="text-2xl font-bold text-gray-800">
                {selectedVariant.price.toLocaleString()} VNĐ
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Sản phẩm</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full text-left px-4 py-3 rounded text-sm transition-colors ${
                        selectedVariant.id === variant.id
                          ? 'bg-green-500 text-white font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Số lượng</h3>
                <div className="inline-flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500 text-xl"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center text-gray-800 font-medium border-x border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-12 flex items-center justify-center hover:bg-gray-50 text-gray-500 text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Discount Code */}
              <div className="inline-flex items-center border border-gray-300 rounded w-full max-w-sm">
                <input
                  type="text"
                  placeholder="NHẬP MÃ GIẢM GIÁ"
                  className="flex-1 px-4 py-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
                />
                <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 border-l border-gray-300">
                  <i className="fas fa-search text-sm"></i>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowOrderModal(true)}
                  className="min-w-[140px] flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded text-sm font-medium transition-colors"
                >
                  Mua hàng
                </button>
                <button className="min-w-[140px] flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded text-sm font-medium transition-colors">
                  Đặt trước
                </button>
                <button className="px-6 py-3 border-2 border-green-500 text-green-600 rounded text-sm hover:bg-green-50 transition-colors font-medium">
                  Nhắn tin
                </button>
                <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-sm hover:bg-green-600 transition-colors">
                  <i className="fas fa-handshake text-white text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-4 bg-white border border-gray-200 rounded-sm">
            {/* Tab Headers */}
            <div className="flex items-center justify-start sm:justify-center border-b border-gray-200 overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'description'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mô tả
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab('api')}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === 'api'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                API
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'description' && (
                <div className="text-sm text-gray-700 space-y-3">
                  <p>{product.description}</p>
                  {product.features.length > 0 && (
                    <ul className="list-disc list-inside space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-user text-gray-400 text-xl"></i>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-800">{review.username}</span>
                          <StarRating rating={review.rating} size="xs" />
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'api' && (
                <div className="text-sm text-gray-700">
                  <p>API documentation will be displayed here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="mt-4 bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Sản phẩm tương tự</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fas fa-chevron-left text-gray-600 text-xs"></i>
                </button>
                <button className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {/* Product 1 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-black flex items-center justify-center">
                  <i className="fab fa-tiktok text-white text-6xl"></i>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    TÀI KHOẢN TIK TOK VIỆT 1K TỚI 100K FOLLOW
                  </h3>
                  <StarRating rating={5} size="xs" className="mb-1" />
                  <span className="text-xs text-gray-500">2 Reviews</span>
                  <div className="text-xs text-gray-600 mb-2">
                    Sản phẩm: <span className="text-primary">Tài khoản TikTok</span>
                  </div>
                </div>
              </div>

              {/* Product 2 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-white flex items-center justify-center border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-1">FANPAGE</div>
                    <div className="text-xs text-gray-600">CÓ KHÁNG ADS</div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    Fanpage CÓ KHÁNG ADS
                  </h3>
                  <StarRating rating={0} size="xs" className="mb-1" />
                  <span className="text-xs text-gray-500">0 Reviews</span>
                  <div className="text-xs text-gray-600 mb-2">
                    Sản phẩm: <span className="text-primary">Tài khoản FB</span>
                  </div>
                </div>
              </div>

              {/* Product 3 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-white flex items-center justify-center border-b border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-2">SELLER TIKTOK</div>
                    <div className="text-xs text-gray-600 mb-2">ĐÃ XÁC MINH</div>
                    <div className="flex gap-1 justify-center flex-wrap">
                      <span className="text-xl">🇻🇳</span>
                      <span className="text-xl">🇲🇾</span>
                      <span className="text-xl">🇮🇩</span>
                      <span className="text-xl">🇵🇭</span>
                      <span className="text-xl">🇹🇭</span>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    Seller Tiktok TIKTOK NƯỚC NGOÀI ĐÔNG NAM Á
                  </h3>
                  <StarRating rating={5} size="xs" className="mb-1" />
                  <span className="text-xs text-gray-500">6 Reviews</span>
                  <div className="text-xs text-gray-600 mb-2">
                    Sản phẩm: <span className="text-primary">Tài khoản TikTok</span>
                  </div>
                </div>
              </div>

              {/* Product 4 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-black flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">P</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    PAGE SIÊU CŨ TỪ 2010 ĐẾN 2015 CỰC TRÂU BỐ
                  </h3>
                  <StarRating rating={0} size="xs" className="mb-1" />
                  <span className="text-xs text-gray-500">0 Reviews</span>
                  <div className="text-xs text-gray-600 mb-2">
                    Sản phẩm: <span className="text-primary">Tài khoản FB</span>
                  </div>
                </div>
              </div>

              {/* Product 5 */}
              <div className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center relative">
                  <div className="text-white text-center">
                    <i className="fas fa-shield-alt text-6xl mb-2"></i>
                    <div className="text-sm font-bold">VPN</div>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded transform rotate-12">
                    2023
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    I HMA VPN | VPN 1 tháng sử dụng cho iphone
                  </h3>
                  <StarRating rating={4} size="xs" className="mb-1" />
                  <span className="text-xs text-gray-500">2 Reviews</span>
                  <div className="text-xs text-gray-600 mb-2">
                    Sản phẩm: <span className="text-primary">Tài Khoản Khác</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Ads */}
        <aside className="hidden xl:block sticky top-[110px]">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-sm p-6 text-white text-center">
            <i className="fas fa-bullhorn text-4xl mb-3"></i>
            <h3 className="text-lg font-bold mb-2">Quảng cáo tại đây</h3>
            <p className="text-sm mb-4">Tiếp cận hàng ngàn khách hàng</p>
            <button className="bg-white text-orange-500 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors">
              Liên hệ ngay
            </button>
          </div>
        </aside>
      </div>

      {/* Order Confirmation Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-800">Xác nhận đơn hàng</h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-green-600 font-medium">
                Vui lòng xác nhận các thông tin sau:
              </p>

              {/* Product Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mặt hàng:</label>
                <div className="bg-yellow-400 text-gray-900 px-4 py-3 rounded font-medium text-sm">
                  {selectedVariant.name}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Số lượng:</span>
                <span className="font-bold text-gray-900">{quantity}</span>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Tổng tiền:</span>
                <span className="font-bold text-gray-900">
                  {(selectedVariant.price * quantity).toLocaleString()} VNĐ
                </span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Giảm giá:</span>
                <span className="font-bold text-gray-900">-</span>
              </div>

              {/* Final Total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Tổng thanh toán:</span>
                <span className="text-xl font-bold text-gray-900">
                  {(selectedVariant.price * quantity).toLocaleString()} VNĐ
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  // Handle order confirmation
                  setShowOrderModal(false)
                  // Redirect to success page
                  window.location.href = '/don-hang/thanh-cong'
                }}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors font-medium text-sm"
              >
                Mua hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
