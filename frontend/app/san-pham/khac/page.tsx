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
    stock: 2500,
    name: 'Proxy IPv4 Private - Tốc độ cao, ổn định',
    rating: 4.8,
    reviews: 456,
    sold: 23456,
    complaints: '0.0%',
    seller: 'proxy_master',
    category: 'Proxy',
    description: 'Proxy IPv4 Private chất lượng cao - Tốc độ nhanh, băng thông không giới hạn',
    features: ['Proxy IPv4 Private - Không chia sẻ', 'Băng thông không giới hạn', 'Hỗ trợ HTTP, HTTPS, SOCKS5'],
    priceRange: '50.000 đ - 150.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Sản phẩm',
    stock: 5000,
    name: 'VPS Windows - RAM 8GB, SSD 100GB',
    rating: 4.9,
    reviews: 678,
    sold: 34567,
    complaints: '0.0%',
    seller: 'vps_vietnam',
    category: 'VPS',
    description: 'VPS Windows giá rẻ - Cấu hình mạnh, tốc độ cao',
    features: ['RAM 8GB, SSD 100GB, CPU 4 Core', 'Băng thông 100Mbps không giới hạn', 'Hỗ trợ 24/7 - Bảo hành 30 ngày'],
    priceRange: '300.000 đ - 500.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Sản phẩm',
    stock: 1500,
    name: 'Sim số đẹp - Đầu số 09x, 08x',
    rating: 4.7,
    reviews: 234,
    sold: 12345,
    complaints: '0.1%',
    seller: 'sim_dep_vn',
    category: 'Sim',
    description: 'Sim số đẹp giá rẻ - Đầu số đẹp, phong thủy',
    features: ['Sim đầu số 09x, 08x - Số đẹp', 'Chưa kích hoạt - Mới 100%', 'Bảo hành đổi trả trong 7 ngày'],
    priceRange: '100.000 đ - 500.000 đ',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Sản phẩm',
    stock: 3000,
    name: 'Key Windows 10 Pro - Bản quyền vĩnh viễn',
    rating: 4.8,
    reviews: 890,
    sold: 45678,
    complaints: '0.0%',
    seller: 'key_windows_vn',
    category: 'Key',
    priceRange: '150.000 đ - 250.000 đ',
    image: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Sản phẩm',
    stock: 800,
    name: 'Hosting WordPress - SSD 10GB, Bandwidth không giới hạn',
    rating: 4.6,
    reviews: 345,
    sold: 18765,
    complaints: '0.2%',
    seller: 'hosting_pro',
    category: 'Hosting',
    priceRange: '80.000 đ - 200.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400&h=300&fit=crop',
  },
]

export default function KhacStorePage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng sản phẩm khác</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 642 gian hàng</span>
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

          <Card className="bg-green-50 border-green-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Danh mục này bao gồm các sản phẩm đa dạng như Proxy, VPS, Sim, Key bản quyền, Hosting và nhiều sản phẩm khác phục vụ nhu cầu kinh doanh online.
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
              totalPages={6}
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
