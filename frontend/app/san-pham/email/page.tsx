'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FilterSidebar from '../../../components/FilterSidebar'
import ProductCard from '../../../components/ProductCard'
import AdSidebar from '../../../components/AdSidebar'
import { Card, Pagination } from '@/components/ui'
import { ProductCard as APIProductCard, SubTypeCount } from '@/types/listing'
import { getProductListing, toggleFavorite } from '@/lib/api/listing'
import { getEndpointFromRoute } from '@/lib/utils/routeMapping'
import { formatPriceRange, formatPercent } from '@/lib/utils/format'
import { useAuth } from '@/hooks/useAuth'

interface Product {
  id: number
  slug: string
  badge: string
  stock: number
  name: string
  rating: number
  reviews: number
  sold: number
  complaints: string
  seller: string
  category: string
  description?: string
  features?: string[]
  priceRange: string
  image?: string
  isFavorite?: boolean
}

function mapAPIProductToFrontend(apiProduct: APIProductCard): Product {
  return {
    id: parseInt(apiProduct.id) || 0,
    slug: apiProduct.slug,
    badge: apiProduct.badgeText || 'Sản phẩm',
    stock: apiProduct.stock,
    name: apiProduct.title,
    rating: apiProduct.rating,
    reviews: apiProduct.reviewCount,
    sold: apiProduct.completedOrders,
    complaints: formatPercent(apiProduct.complaintPercent),
    seller: apiProduct.sellerName,
    category: 'Gmail',
    priceRange: formatPriceRange(apiProduct.priceMin, apiProduct.priceMax),
    image: apiProduct.image,
    features: apiProduct.features,
    isFavorite: apiProduct.isFavorite,
  }
}

export default function EmailStorePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([])
  const [subTypeCounts, setSubTypeCounts] = useState<SubTypeCount[]>([])
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular')
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        
        // Start minimum loading timer to prevent flashing
        const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 200))
        
        const route = '/san-pham/email'
        const endpoint = getEndpointFromRoute(route)
        
        // Build query params
        const params: any = {
          sort: sortBy,
          page: currentPage,
          limit: 12
        }
        
        // Add subTypes if selected
        if (selectedSubTypes.length > 0) {
          params.subTypes = selectedSubTypes.join(',')
        }
        
        const response = await getProductListing(endpoint, params)
        
        const mappedProducts = response.data.map(mapAPIProductToFrontend)
        setProducts(mappedProducts)
        setTotalCount(response.meta.total)
        setTotalPages(response.meta.totalPages)
        
        // Update subtype counts from response
        setSubTypeCounts(response.filters.subTypeCounts)
        
        // Wait for minimum loading time to prevent flashing
        await minLoadingPromise
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu')
        // Also wait minimum time on error
        await new Promise(resolve => setTimeout(resolve, 200))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [currentPage, selectedSubTypes, sortBy])

  const handleSubTypesChange = (subTypes: string[]) => {
    setSelectedSubTypes(subTypes)
  }

  const handleSearch = () => {
    // Reset to page 1 when searching
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: 'popular' | 'price_asc' | 'price_desc') => {
    setSortBy(newSort)
    setCurrentPage(1) // Reset to page 1 when sort changes
  }

  const handleFavoriteToggle = async (productId: number) => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to login page
      router.push('/dang-nhap')
      return
    }

    // Get token from localStorage
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/dang-nhap')
      return
    }

    // Find product and store original state
    const productIndex = products.findIndex(p => p.id === productId)
    if (productIndex === -1) return

    const originalFavoriteState = products[productIndex].isFavorite

    // Optimistic update
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, isFavorite: !p.isFavorite }
        : p
    ))

    try {
      // Call API
      const productIdString = productId.toString()
      await toggleFavorite(productIdString, token)
      
      // Success - optimistic update already applied
    } catch (error: any) {
      // Rollback on error
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, isFavorite: originalFavoriteState }
          : p
      ))
      
      // Show error message
      alert('Không thể thêm vào yêu thích. Vui lòng thử lại.')
    }
  }

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
          {/* Left Sidebar - Keep visible */}
          <div className="hidden xl:block">
            <FilterSidebar
              subTypeCounts={subTypeCounts}
              selectedSubTypes={selectedSubTypes}
              onSubTypesChange={handleSubTypesChange}
              onSearch={handleSearch}
            />
          </div>

          {/* Main Content - Empty State */}
          <main>
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng email</h1>
                <span className="text-xs sm:text-sm text-gray-600">Tổng 0 gian hàng</span>
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

            {/* Empty State Message */}
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
        {/* Left Sidebar - Filters */}
        <div className="hidden xl:block">
          <FilterSidebar
            subTypeCounts={subTypeCounts}
            selectedSubTypes={selectedSubTypes}
            onSubTypesChange={handleSubTypesChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Main Content */}
        <main>
          {/* Breadcrumb & Title */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng email</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng {totalCount.toLocaleString()} gian hàng</span>
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

          {/* Product Grid */}
          <div className="space-y-4">
            {/* Featured Product - Full Width */}
            {products[0] && (
              <ProductCard 
                product={products[0]} 
                featured 
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}

            {/* Regular Products - 1 Column on Mobile, 2 on Desktop */}
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
