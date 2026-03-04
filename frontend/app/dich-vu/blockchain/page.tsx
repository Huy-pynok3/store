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
    stock: 500,
    name: 'Dịch vụ Airdrop Hunter - Săn airdrop crypto tự động',
    rating: 4.9,
    reviews: 234,
    sold: 3456,
    complaints: '0.0%',
    seller: 'airdrop_hunter_pro',
    category: 'Airdrop',
    description: 'Dịch vụ săn airdrop crypto chuyên nghiệp - Tự động claim, tối ưu lợi nhuận',
    features: ['Săn airdrop tự động 24/7', 'Hỗ trợ đa nền tảng: Ethereum, BSC, Polygon', 'Chia sẻ chiến lược airdrop hiệu quả'],
    priceRange: '500.000 đ - 2.000.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    badge: 'Dịch vụ',
    stock: 300,
    name: 'Dịch vụ Staking Crypto - Lãi suất cao, an toàn',
    rating: 4.8,
    reviews: 456,
    sold: 5678,
    complaints: '0.1%',
    seller: 'crypto_staking_vn',
    category: 'Staking',
    description: 'Dịch vụ staking crypto uy tín - Lãi suất hấp dẫn, bảo mật tối đa',
    features: ['Lãi suất 8-15% APY', 'Hỗ trợ ETH, BNB, ADA, SOL', 'Rút tiền linh hoạt - Bảo mật đa lớp'],
    priceRange: 'Từ 1.000.000 đ',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    badge: 'Dịch vụ',
    stock: 200,
    name: 'Dịch vụ NFT Minting - Tạo và bán NFT dễ dàng',
    rating: 4.7,
    reviews: 189,
    sold: 2345,
    complaints: '0.2%',
    seller: 'nft_creator_pro',
    category: 'NFT',
    description: 'Dịch vụ tạo và phát hành NFT chuyên nghiệp - Hỗ trợ toàn diện',
    features: ['Tạo NFT collection chuyên nghiệp', 'Hỗ trợ OpenSea, Rarible, Magic Eden', 'Tư vấn chiến lược marketing NFT'],
    priceRange: '2.000.000 đ - 10.000.000 đ',
    image: 'https://images.unsplash.com/photo-1645731947730-22868c0c7e0e?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    badge: 'Dịch vụ',
    stock: 150,
    name: 'Dịch vụ Smart Contract Audit - Kiểm tra bảo mật',
    rating: 4.9,
    reviews: 123,
    sold: 1234,
    complaints: '0.0%',
    seller: 'smart_contract_audit',
    category: 'Smart Contract',
    priceRange: '5.000.000 đ - 20.000.000 đ',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    badge: 'Dịch vụ',
    stock: 400,
    name: 'Dịch vụ Trading Bot - Bot giao dịch crypto tự động',
    rating: 4.8,
    reviews: 567,
    sold: 6789,
    complaints: '0.1%',
    seller: 'trading_bot_pro',
    category: 'Trading',
    priceRange: '1.000.000 đ - 5.000.000 đ/tháng',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop',
  },
]

export default function BlockchainPage() {
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dịch vụ Blockchain</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 156 gian hàng</span>
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

          <Card className="bg-cyan-50 border-cyan-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Dịch vụ Blockchain bao gồm các giải pháp liên quan đến crypto, NFT, DeFi, smart contract và các công nghệ blockchain khác. Vui lòng nghiên cứu kỹ trước khi sử dụng dịch vụ.
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
