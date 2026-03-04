'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import FilterSidebar from '../../../components/FilterSidebar'
import ProductCard from '../../../components/ProductCard'
import AdSidebar from '../../../components/AdSidebar'
import { Card, Pagination } from '@/components/ui'

const products = [
  {
    id: 1,
    badge: 'Sản phẩm',
    stock: 8261,
    name: 'Gmail New USA, hàng ngon, Reg IOS đã nghỉ >15 ngày',
    rating: 4.5,
    reviews: 128,
    sold: 108851,
    complaints: '0.0%',
    seller: 'leelangymail',
    category: 'Gmail',
    description: 'Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English',
    features: ['Kính chuyển GMAIL USA 2023 | LOGIN DOC MỚI TÁ | Gmail tạo 24h đến 48h ( hàng không lỗi, tỉ lệ mua nhìn rõ )'],
    priceRange: '3.000 đ - 17.000 đ',
    image: '/products/gmail-usa.png',
  },
  {
    id: 2,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail Random/US IP - Live trâu',
    rating: 4.8,
    reviews: 1731,
    sold: 3027593,
    complaints: '0.0%',
    seller: 'mailanpmail',
    category: 'Gmail',
    description: 'Gmail Live trâu',
    features: ['Kính chuyển: Gmail Live tạo 24h đến 48h thi | Gmail Live] >x12 month EOC MỚ', 'Tỉ lệ sống: 99% ( Vui lòi coi ).'],
    priceRange: '2.400 đ - 6.684 đ',
    image: '/products/gmail-random.png',
  },
  {
    id: 3,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'GMAIL VIỆT 2015-2019 - NGƯỜI DÙNG THẬT - CHƯA QUA DỊCH VỤ - HÀNG TRUST',
    rating: 4.9,
    reviews: 826,
    sold: 18273,
    complaints: '0.0%',
    seller: 'lanPhuong',
    category: 'Gmail',
    description: 'Shop chuyên cung cấp các loại Gmail Việt, Uy tín - Chất lượng',
    features: ['1. Việt Nam', '2. Tạo từ 2015 đến 2019 - Chưa qua dịch vụ - Hàng Việt | Gmail Việt 2018-2019 - Chưa qua dịch vụ - Hàng Việt | Gmail Việt 2015-2019 - Chưa qua dịch vụ - Hàng Việt'],
    priceRange: '19.000 đ - 23.000 đ',
    image: '/products/gmail-viet.png',
  },
  {
    id: 4,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail đã qua Dịch Vụ - Live Trâu',
    rating: 4.7,
    reviews: 932,
    sold: 815985,
    complaints: '0.0%',
    seller: 'mailanpmail',
    category: 'Gmail',
    priceRange: '2.400 đ - 6.684 đ',
    image: '/products/gmail-dich-vu.png',
  },
  {
    id: 5,
    badge: 'Sản phẩm',
    stock: 0,
    name: 'Gmail Trust Good',
    rating: 4.6,
    reviews: 74,
    sold: 51148,
    complaints: '0.0%',
    seller: 'leemail_myfbfan',
    category: 'Gmail',
    priceRange: '5.000 đ - 15.000 đ',
    image: '/products/gmail-trust.png',
  },
]

export default function EmailStorePage() {
  const [currentPage, setCurrentPage] = useState(1)

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
              <h1 className="text-2xl font-bold text-gray-800">Gian hàng email</h1>
              <span className="text-sm text-gray-600">Tổng 816 gian hàng</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Tiếng Việt gian hàng</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-4 border-b border-gray-200">
            <button className="pb-2 px-1 text-sm font-medium text-primary border-b-2 border-primary">
              Phổ biến
            </button>
            <button className="pb-2 px-1 text-sm text-gray-600 hover:text-primary">
              Giá tăng dần
            </button>
            <button className="pb-2 px-1 text-sm text-gray-600 hover:text-primary">
              Giá giảm dần
            </button>
          </div>

          <Card className="bg-blue-50 border-blue-200 mb-4">
            <p className="text-sm text-gray-700">
              Đối với gian hàng không trùng, chúng tôi cam kết sản phẩm được bán ra 1 lần duy nhất trên hệ thống, tránh trường hợp phần tử được bán nhiều lần.
            </p>
          </Card>

          {/* Product Grid */}
          <div className="space-y-4">
            {/* Featured Product - Full Width */}
            <ProductCard product={products[0]} featured />
            
            {/* Regular Products - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(1).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>

        {/* Right Sidebar - Ads */}
        <div className="hidden xl:block">
          <AdSidebar />
        </div>
      </div>
    </div>
  )
}
