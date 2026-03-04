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
    stock: 999,
    name: 'Phần mềm nuôi Facebook tự động - Auto Farm Pro 2024',
    rating: 4.9,
    reviews: 567,
    sold: 12345,
    complaints: '0.0%',
    seller: 'autofarm_pro',
    category: 'Phần mềm Facebook',
    description: 'Phần mềm nuôi nick Facebook tự động - Tương tác, spam, seeding chuyên nghiệp',
    features: ['Tự động tương tác, like, comment, share', 'Hỗ trợ nuôi hàng loạt tài khoản', 'Bảo hành trọn đời - Cập nhật miễn phí'],
    priceRange: '1.500.000 đ - 2.500.000 đ',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Sản phẩm',
    stock: 500,
    name: 'Tool Tăng Follow TikTok - TikBoost Premium',
    rating: 4.7,
    reviews: 423,
    sold: 8976,
    complaints: '0.1%',
    seller: 'tikboost_official',
    category: 'Phần mềm TikTok',
    description: 'Phần mềm tăng follow, like, view TikTok tự động - An toàn, hiệu quả',
    features: ['Tăng follow, like, view TikTok nhanh chóng', 'Không cần mật khẩu tài khoản', 'Hỗ trợ 24/7 - Bảo hành 6 tháng'],
    priceRange: '800.000 đ - 1.200.000 đ',
    image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Sản phẩm',
    stock: 750,
    name: 'Phần mềm Spam Comment Facebook - CommentKing Pro',
    rating: 4.8,
    reviews: 312,
    sold: 6543,
    complaints: '0.0%',
    seller: 'commentking_vn',
    category: 'Phần mềm Facebook',
    description: 'Tool spam comment Facebook hàng loạt - Tốc độ cao, không bị checkpoint',
    features: ['Spam comment hàng loạt bài viết, group', 'Tự động đổi IP, tránh checkpoint', 'Bảo hành 1 năm - Hỗ trợ kỹ thuật tận tình'],
    priceRange: '1.200.000 đ - 1.800.000 đ',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Sản phẩm',
    stock: 300,
    name: 'Tool Check Live Facebook - LiveChecker Ultimate',
    rating: 4.6,
    reviews: 189,
    sold: 4321,
    complaints: '0.2%',
    seller: 'livechecker_pro',
    category: 'Phần mềm Facebook',
    priceRange: '500.000 đ - 800.000 đ',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Sản phẩm',
    stock: 450,
    name: 'Phần mềm Quét UID Facebook - UIDScanner Pro',
    rating: 4.7,
    reviews: 234,
    sold: 5678,
    complaints: '0.1%',
    seller: 'uidscanner_vn',
    category: 'Phần mềm Facebook',
    priceRange: '600.000 đ - 900.000 đ',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
  },
]

export default function PhanMemStorePage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng phần mềm</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 387 gian hàng</span>
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

          <Card className="bg-red-50 border-red-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Cảnh báo: Vui lòng sử dụng phần mềm đúng mục đích và tuân thủ chính sách của các nền tảng. Chúng tôi không chịu trách nhiệm nếu tài khoản của bạn bị khóa do vi phạm.
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
              totalPages={4}
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
