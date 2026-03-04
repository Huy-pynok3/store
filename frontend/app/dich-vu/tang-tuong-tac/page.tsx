'use client'

import { useState } from 'react'
import FilterSidebar from '../../../components/FilterSidebar'
import ProductCard from '../../../components/ProductCard'
import AdSidebar from '../../../components/AdSidebar'
import { Card, Pagination } from '@/components/ui'

const products = [
  {
    id: 1,
    badge: 'Dịch vụ',
    stock: 99999,
    name: 'Tăng Like Facebook - Like thật, tương tác cao',
    rating: 4.9,
    reviews: 1234,
    sold: 156789,
    complaints: '0.0%',
    seller: 'like_facebook_pro',
    category: 'Facebook',
    description: 'Dịch vụ tăng like Facebook giá rẻ - Like thật từ người dùng Việt Nam',
    features: ['Like thật 100% từ user Việt Nam', 'Tốc độ nhanh 500-1000 like/ngày', 'Bảo hành giảm trong 30 ngày'],
    priceRange: '50 đ - 150 đ/like',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Dịch vụ',
    stock: 99999,
    name: 'Tăng Follow Instagram - Follow thật, không rớt',
    rating: 4.8,
    reviews: 987,
    sold: 98765,
    complaints: '0.1%',
    seller: 'insta_follow_vn',
    category: 'Instagram',
    description: 'Dịch vụ tăng follow Instagram chất lượng cao - Follow thật, tương tác tốt',
    features: ['Follow thật từ user nước ngoài', 'Tốc độ 200-500 follow/ngày', 'Bảo hành 60 ngày - Không rớt'],
    priceRange: '30 đ - 100 đ/follow',
    image: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Dịch vụ',
    stock: 99999,
    name: 'Tăng View TikTok - View thật, tăng reach',
    rating: 4.9,
    reviews: 1567,
    sold: 234567,
    complaints: '0.0%',
    seller: 'tiktok_view_master',
    category: 'TikTok',
    description: 'Dịch vụ tăng view TikTok giá rẻ - View thật, tăng tỷ lệ lên FYP',
    features: ['View thật 100% từ user TikTok', 'Tốc độ cực nhanh 10K-50K view/ngày', 'Giúp video lên FYP dễ dàng'],
    priceRange: '5 đ - 20 đ/view',
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Dịch vụ',
    stock: 99999,
    name: 'Tăng Sub YouTube - Sub thật, giữ kênh',
    rating: 4.7,
    reviews: 678,
    sold: 45678,
    complaints: '0.2%',
    seller: 'youtube_sub_vn',
    category: 'YouTube',
    priceRange: '100 đ - 300 đ/sub',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Dịch vụ',
    stock: 99999,
    name: 'Tăng Comment Facebook - Comment có nội dung',
    rating: 4.8,
    reviews: 890,
    sold: 67890,
    complaints: '0.1%',
    seller: 'comment_fb_pro',
    category: 'Facebook',
    priceRange: '200 đ - 500 đ/comment',
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400&h=300&fit=crop',
  },
]

export default function TangTuongTacPage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dịch vụ tăng tương tác</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 1.245 gian hàng</span>
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

          <Card className="bg-purple-50 border-purple-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Dịch vụ tăng tương tác giúp tăng độ phủ sóng, uy tín và khả năng tiếp cận khách hàng trên các nền tảng mạng xã hội. Tất cả dịch vụ đều sử dụng tương tác thật từ người dùng thực.
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
              totalPages={12}
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
