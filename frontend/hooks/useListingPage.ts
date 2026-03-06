import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { ProductCard as APIProductCard, SubTypeCount } from '@/types/listing'
import { getProductListing, toggleFavorite } from '@/lib/api/listing'
import { getEndpointFromRoute } from '@/lib/utils/routeMapping'
import { formatPriceRange, formatPercent } from '@/lib/utils/format'

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

interface UseListingPageParams {
  route: string
  category: string
}

export function useListingPage({ route, category }: UseListingPageParams) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([])
  const [subTypeCounts, setSubTypeCounts] = useState<SubTypeCount[]>([])
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular')
  const [totalPages, setTotalPages] = useState(1)

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
      category: category,
      priceRange: formatPriceRange(apiProduct.priceMin, apiProduct.priceMax),
      image: apiProduct.image,
      features: apiProduct.features,
      isFavorite: apiProduct.isFavorite,
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 200))
        
        const endpoint = getEndpointFromRoute(route)
        
        const params: any = {
          sort: sortBy,
          page: currentPage,
          limit: 12
        }
        
        if (selectedSubTypes.length > 0) {
          params.subTypes = selectedSubTypes.join(',')
        }
        
        const response = await getProductListing(endpoint, params)
        
        const mappedProducts = response.data.map(mapAPIProductToFrontend)
        setProducts(mappedProducts)
        setTotalCount(response.meta.total)
        setTotalPages(response.meta.totalPages)
        setSubTypeCounts(response.filters.subTypeCounts)
        
        await minLoadingPromise
      } catch (err: any) {
        setError(err.message || 'Không thể tải dữ liệu')
        await new Promise(resolve => setTimeout(resolve, 200))
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [currentPage, selectedSubTypes, sortBy, route, category])

  const handleSubTypesChange = (subTypes: string[]) => {
    setSelectedSubTypes(subTypes)
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: 'popular' | 'price_asc' | 'price_desc') => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  const handleFavoriteToggle = async (productId: number) => {
    if (!isLoggedIn) {
      router.push('/dang-nhap')
      return
    }

    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/dang-nhap')
      return
    }

    const productIndex = products.findIndex(p => p.id === productId)
    if (productIndex === -1) return

    const originalFavoriteState = products[productIndex].isFavorite

    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, isFavorite: !p.isFavorite }
        : p
    ))

    try {
      const productIdString = productId.toString()
      await toggleFavorite(productIdString, token)
    } catch (error: any) {
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, isFavorite: originalFavoriteState }
          : p
      ))
      
      alert('Không thể thêm vào yêu thích. Vui lòng thử lại.')
    }
  }

  return {
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
  }
}
