'use client'

import { useState } from 'react'
import FilterSidebar from '../../../components/FilterSidebar'
import ProductCard from '../../../components/ProductCard'
import AdSidebar from '../../../components/AdSidebar'
import { Card, Pagination } from '@/components/ui'
import { useListingPage } from '@/hooks/useListingPage'

export default function OtherStorePage() {
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const {
    products,
    loading,
    error,
    totalCount,
    currentPage,
    setCurrentPage,
    selectedSubTypes,
    subTypeCounts,
    sortBy,
    totalPages,
    handleSubTypesChange,
    handleSearch,
    handleSortChange,
    handleFavoriteToggle,
    setSelectedSubTypes,
    setError,
  } = useListingPage({
    route: '/san-pham/khac',
    category: 'Khác'
  })

  if (loading) {
    return (
      <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
            <p className="text-gray-800 font-semibold mb-2">Không thể tải dữ liệu</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setCurrentPage(prev => prev)
              }}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
        <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
          <div className="hidden xl:block">
            <FilterSidebar
              subTypeCounts={subTypeCounts}
              selectedSubTypes={selectedSubTypes}
              onSubTypesChange={handleSubTypesChange}
              onSearch={handleSearch}
            />
          </div>

          <main>
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng khác</h1>
                <span className="text-xs sm:text-sm text-gray-600">Tổng 0 gian hàng</span>
              </div>
            </div>

            <div className="xl:hidden mb-4">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <i className="fas fa-filter"></i>
                Bộ lọc
              </button>
            </div>

            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <i className="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
                <p className="text-gray-800 font-semibold text-lg mb-2">Không tìm thấy sản phẩm phù hợp.</p>
                <p className="text-gray-600 text-sm mb-4">Thử xóa bộ lọc để xem thêm sản phẩm</p>
                <button
                  onClick={() => {
                    setSelectedSubTypes([])
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </main>

          <div className="hidden xl:block">
            <AdSidebar />
          </div>
        </div>

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
                <FilterSidebar
                  subTypeCounts={subTypeCounts}
                  selectedSubTypes={selectedSubTypes}
                  onSubTypesChange={handleSubTypesChange}
                  onSearch={handleSearch}
                />
              </div>
            </aside>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        <div className="hidden xl:block">
          <FilterSidebar
            subTypeCounts={subTypeCounts}
            selectedSubTypes={selectedSubTypes}
            onSubTypesChange={handleSubTypesChange}
            onSearch={handleSearch}
          />
        </div>

        <main>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng khác</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng {totalCount.toLocaleString()} gian hàng</span>
            </div>
          </div>

          <div className="xl:hidden mb-4">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-filter"></i>
              Bộ lọc
            </button>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => handleSortChange('popular')}
              className={`pb-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                sortBy === 'popular'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Phổ biến
            </button>
            <button
              onClick={() => handleSortChange('price_asc')}
              className={`pb-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                sortBy === 'price_asc'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Giá tăng dần
            </button>
            <button
              onClick={() => handleSortChange('price_desc')}
              className={`pb-2 px-1 text-xs sm:text-sm font-medium whitespace-nowrap ${
                sortBy === 'price_desc'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              Giá giảm dần
            </button>
          </div>

          <Card className="bg-blue-50 border-blue-200 mb-4">
            <p className="text-xs sm:text-sm text-gray-700">
              Đối với gian hàng không trùng, chúng tôi cam kết sản phẩm được bán ra 1 lần duy nhất trên hệ thống, tránh trường hợp phần tử được bán nhiều lần.
            </p>
          </Card>

          <div className="space-y-4">
            {products[0] && (
              <ProductCard
                product={products[0]}
                featured
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.slice(1).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>

        <div className="hidden xl:block">
          <AdSidebar />
        </div>
      </div>

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
              <FilterSidebar
                subTypeCounts={subTypeCounts}
                selectedSubTypes={selectedSubTypes}
                onSubTypesChange={handleSubTypesChange}
                onSearch={handleSearch}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
