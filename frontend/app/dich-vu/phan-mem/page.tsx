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
    name: 'Dịch vụ Thiết kế Website - Chuẩn SEO, Responsive',
    rating: 4.9,
    reviews: 678,
    sold: 8901,
    complaints: '0.0%',
    seller: 'web_design_pro',
    category: 'Website',
    description: 'Dịch vụ thiết kế website chuyên nghiệp - Chuẩn SEO, tối ưu trải nghiệm người dùng',
    features: ['Thiết kế responsive trên mọi thiết bị', 'Chuẩn SEO, tốc độ tải nhanh', 'Bảo hành 12 tháng - Hỗ trợ 24/7'],
    priceRange: '3.000.000 đ - 15.000.000 đ',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Dịch vụ',
    stock: 500,
    name: 'Dịch vụ Phát triển App Mobile - iOS & Android',
    rating: 4.8,
    reviews: 456,
    sold: 5678,
    complaints: '0.1%',
    seller: 'app_dev_vn',
    category: 'Mobile App',
    description: 'Dịch vụ phát triển ứng dụng di động - iOS, Android, React Native',
    features: ['Phát triển app iOS & Android', 'UI/UX hiện đại, mượt mà', 'Bảo hành 6 tháng - Hỗ trợ kỹ thuật'],
    priceRange: '10.000.000 đ - 50.000.000 đ',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Dịch vụ',
    stock: 300,
    name: 'Dịch vụ SEO Website - Lên top Google nhanh chóng',
    rating: 4.9,
    reviews: 890,
    sold: 12345,
    complaints: '0.0%',
    seller: 'seo_master_vn',
    category: 'SEO',
    description: 'Dịch vụ SEO website chuyên nghiệp - Lên top Google, tăng traffic tự nhiên',
    features: ['SEO tổng thể: Onpage + Offpage', 'Cam kết lên top 3-5 từ khóa', 'Báo cáo chi tiết hàng tháng'],
    priceRange: '2.000.000 đ - 10.000.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Dịch vụ',
    stock: 200,
    name: 'Dịch vụ Thiết kế Logo - Chuyên nghiệp, độc đáo',
    rating: 4.7,
    reviews: 345,
    sold: 4567,
    complaints: '0.2%',
    seller: 'logo_design_pro',
    category: 'Graphic Design',
    priceRange: '500.000 đ - 2.000.000 đ',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Dịch vụ',
    stock: 400,
    name: 'Dịch vụ Quản trị Fanpage - Tăng tương tác, bán hàng',
    rating: 4.8,
    reviews: 567,
    sold: 7890,
    complaints: '0.1%',
    seller: 'fanpage_admin_vn',
    category: 'Social Media',
    priceRange: '1.500.000 đ - 5.000.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
  },
]

export default function DichVuPhanMemPage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dịch vụ phần mềm</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 734 gian hàng</span>
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

          <Card className="bg-indigo-50 border-indigo-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Dịch vụ phần mềm bao gồm thiết kế website, phát triển app, SEO, thiết kế đồ họa và các dịch vụ digital marketing khác. Tất cả đều được thực hiện bởi đội ngũ chuyên nghiệp.
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
              totalPages={7}
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
