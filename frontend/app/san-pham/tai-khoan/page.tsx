'use client'

import { useState } from 'react'
import FilterSidebar from '../../../components/FilterSidebar'
import ProductCard from '../../../components/ProductCard'
import AdSidebar from '../../../components/AdSidebar'
import { Card, Pagination } from '@/components/ui'

const products = [
  {
    id: 1,
    badge: 'Sản phẩm',
    stock: 15420,
    name: 'Tài khoản Facebook Ads - BM 250$ - Chạy quảng cáo ổn định',
    rating: 4.8,
    reviews: 342,
    sold: 45231,
    complaints: '0.0%',
    seller: 'fbads_pro',
    category: 'Facebook',
    description: 'Business Manager Facebook 250$ - Tài khoản quảng cáo chất lượng cao',
    features: ['BM 250$ limit - Chạy ads ổn định', 'Bảo hành 7 ngày - Đổi mới nếu lỗi', 'Hỗ trợ kỹ thuật 24/7'],
    priceRange: '450.000 đ - 550.000 đ',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Sản phẩm',
    stock: 8932,
    name: 'Tài khoản TikTok Ads - Chạy quảng cáo không giới hạn',
    rating: 4.7,
    reviews: 218,
    sold: 32145,
    complaints: '0.1%',
    seller: 'tiktok_master',
    category: 'TikTok',
    description: 'Tài khoản TikTok Ads chính chủ - Chạy quảng cáo mượt mà',
    features: ['Tài khoản TikTok Ads không limit', 'Đã verify đầy đủ', 'Bảo hành 5 ngày'],
    priceRange: '350.000 đ - 450.000 đ',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Sản phẩm',
    stock: 12567,
    name: 'Tài khoản Google Ads - Threshold 350$ - Chạy ads Google',
    rating: 4.9,
    reviews: 456,
    sold: 67890,
    complaints: '0.0%',
    seller: 'google_ads_vn',
    category: 'Google',
    description: 'Google Ads Threshold 350$ - Tài khoản chạy quảng cáo Google chất lượng',
    features: ['Threshold 350$ - Thanh toán sau', 'Tài khoản US/UK/EU', 'Bảo hành 10 ngày - Hỗ trợ tận tình'],
    priceRange: '280.000 đ - 380.000 đ',
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Sản phẩm',
    stock: 5234,
    name: 'Tài khoản Instagram Business - Verified Badge',
    rating: 4.6,
    reviews: 189,
    sold: 23456,
    complaints: '0.2%',
    seller: 'insta_verified',
    category: 'Instagram',
    priceRange: '1.200.000 đ - 1.800.000 đ',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Sản phẩm',
    stock: 9876,
    name: 'Tài khoản Shopee Mall - Gian hàng chính hãng',
    rating: 4.8,
    reviews: 312,
    sold: 18765,
    complaints: '0.0%',
    seller: 'shopee_official',
    category: 'Shopee',
    priceRange: '2.500.000 đ - 3.500.000 đ',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  },
]

export default function TaiKhoanStorePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        {/* Left Sidebar - Filters */}
        <div className="hidden xl:block">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <main>
          {/* Breadcrumb & Title */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng tài khoản</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 523 gian hàng</span>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="xl:hidden mb-4">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-filter"></i>
              Bộ lọc
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 border-b border-gray-200 overflow-x-auto">
            <button className="pb-2 px-1 text-xs sm:text-sm font-medium text-primary border-b-2 border-primary whitespace-nowrap">
              Phổ biến
            </button>
            <button className="pb-2 px-1 text-xs sm:text-sm text-gray-600 hover:text-primary whitespace-nowrap">
              Giá tăng dần
            </button>
            <button className="pb-2 px-1 text-xs sm:text-sm text-gray-600 hover:text-primary whitespace-nowrap">
              Giá giảm dần
            </button>
          </div>

          <Card className="bg-amber-50 border-amber-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Lưu ý: Tài khoản quảng cáo cần tuân thủ chính sách của từng nền tảng. Vui lòng đọc kỹ hướng dẫn sử dụng để tránh bị khóa tài khoản.
            </p>
          </Card>

          {/* Product Grid */}
          <div className="space-y-4">
            {/* Featured Product - Full Width */}
            <ProductCard product={products[0]} featured />

            {/* Regular Products - 1 Column on Mobile, 2 on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(1).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>

        {/* Right Sidebar - Ads */}
        <div className="hidden xl:block">
          <AdSidebar />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[220] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Đóng bộ lọc"
            onClick={() => setShowMobileFilter(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[85vw] max-w-[340px] bg-white shadow-xl overflow-y-auto">
            <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <span className="text-sm font-semibold text-gray-700">Bộ lọc</span>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center text-gray-500"
                aria-label="Đóng bộ lọc"
                onClick={() => setShowMobileFilter(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
