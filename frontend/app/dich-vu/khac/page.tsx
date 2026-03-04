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
    stock: 999,
    name: 'Dịch vụ Viết Content - Bài viết chuẩn SEO, hấp dẫn',
    rating: 4.8,
    reviews: 567,
    sold: 9876,
    complaints: '0.0%',
    seller: 'content_writer_pro',
    category: 'Content Writing',
    description: 'Dịch vụ viết content chuyên nghiệp - Bài viết chuẩn SEO, thu hút người đọc',
    features: ['Viết content chuẩn SEO, độc đáo', 'Đa dạng chủ đề: review, tin tức, blog', 'Giao hàng đúng hạn - Sửa miễn phí'],
    priceRange: '50.000 đ - 200.000 đ/bài',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Dịch vụ',
    stock: 500,
    name: 'Dịch vụ Dịch thuật - Anh, Trung, Nhật, Hàn',
    rating: 4.9,
    reviews: 789,
    sold: 12345,
    complaints: '0.0%',
    seller: 'translation_expert',
    category: 'Translation',
    description: 'Dịch vụ dịch thuật chuyên nghiệp - Anh, Trung, Nhật, Hàn, Pháp, Đức',
    features: ['Dịch thuật chính xác, tự nhiên', 'Hỗ trợ đa ngôn ngữ', 'Bảo mật thông tin - Giao hàng nhanh'],
    priceRange: '100.000 đ - 500.000 đ/trang',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Dịch vụ',
    stock: 300,
    name: 'Dịch vụ Livestream bán hàng - Tăng doanh số',
    rating: 4.7,
    reviews: 345,
    sold: 5678,
    complaints: '0.1%',
    seller: 'livestream_pro',
    category: 'Livestream',
    description: 'Dịch vụ livestream bán hàng chuyên nghiệp - Tăng tương tác, doanh số',
    features: ['Livestream chuyên nghiệp, hấp dẫn', 'Hỗ trợ Facebook, TikTok, Shopee', 'Tư vấn kịch bản, kỹ thuật bán hàng'],
    priceRange: '2.000.000 đ - 10.000.000 đ/buổi',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Dịch vụ',
    stock: 200,
    name: 'Dịch vụ Chụp ảnh sản phẩm - Chuyên nghiệp, đẹp mắt',
    rating: 4.8,
    reviews: 456,
    sold: 6789,
    complaints: '0.0%',
    seller: 'product_photo_vn',
    category: 'Photography',
    priceRange: '500.000 đ - 3.000.000 đ',
    image: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Dịch vụ',
    stock: 400,
    name: 'Dịch vụ Tư vấn Marketing - Chiến lược bán hàng hiệu quả',
    rating: 4.9,
    reviews: 678,
    sold: 8901,
    complaints: '0.0%',
    seller: 'marketing_consultant',
    category: 'Marketing',
    priceRange: '3.000.000 đ - 15.000.000 đ',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  },
]

export default function DichVuKhacPage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dịch vụ khác</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 892 gian hàng</span>
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

          <Card className="bg-pink-50 border-pink-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Danh mục dịch vụ khác bao gồm các dịch vụ đa dạng như viết content, dịch thuật, livestream, chụp ảnh sản phẩm, tư vấn marketing và nhiều dịch vụ hỗ trợ kinh doanh khác.
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
              totalPages={9}
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
