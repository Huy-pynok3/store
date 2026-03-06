'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getProductDetail } from '@/lib/api/listing'
import { ProductDetail as ProductDetailType } from '@/types/listing'
import { formatPercent } from '@/lib/utils/format'
import ProductDetail from '@/components/ProductDetail'

// Transform API data to ProductDetail component format
function transformProductData(apiProduct: ProductDetailType) {
  // Get category display name
  const categoryMap: Record<string, string> = {
    'EMAIL': 'Email',
    'PRODUCT_SOFTWARE': 'Phần mềm',
    'ACCOUNT': 'Tài khoản',
    'PRODUCT_OTHER': 'Khác',
    'ENGAGEMENT': 'Tăng tương tác',
    'SERVICE_SOFTWARE': 'Dịch vụ phần mềm',
    'BLOCKCHAIN': 'Blockchain',
    'SERVICE_OTHER': 'Dịch vụ khác',
  }

  const categoryDisplay = categoryMap[apiProduct.category] || apiProduct.category

  // Transform variants from priceOptions
  const variants = apiProduct.priceOptions && apiProduct.priceOptions.length > 0
    ? apiProduct.priceOptions.map((opt, idx) => ({
        id: idx + 1,
        name: opt.label,
        price: opt.price,
        selected: idx === 0,
      }))
    : undefined

  // Get default price (first variant or fallback)
  const defaultPrice = variants && variants.length > 0 
    ? variants[0].price 
    : undefined

  return {
    id: parseInt(apiProduct.id) || 0,
    name: apiProduct.name,
    rating: apiProduct.ratingAvg,
    reviews: apiProduct.reviewCount,
    sold: apiProduct.completedOrders,
    complaints: formatPercent(apiProduct.complaintPercent),
    seller: apiProduct.shop.name,
    sellerVerified: true,
    category: categoryDisplay,
    stock: apiProduct.stock,
    price: defaultPrice,
    description: apiProduct.shortDescription || apiProduct.description,
    detailedDescription: apiProduct.description,
    variants: variants,
    features: apiProduct.features.map(f => f.content),
    image: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images[0] : undefined,
    badge: apiProduct.badgeText || undefined,
  }
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    username: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất tốt, giao hàng nhanh!',
    date: '2 ngày trước',
  },
  {
    id: 2,
    username: 'Trần Thị B',
    rating: 4,
    comment: 'Chất lượng ổn, giá hợp lý.',
    date: '5 ngày trước',
  },
]

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams()
  const isNewShopPreview = searchParams.get('preview') === 'new-shop-empty'
  const previewShopName = searchParams.get('shopName') || 'Gian hàng mới'
  const previewItemName = searchParams.get('itemName')?.trim() || ''
  const previewItemPriceRaw = Number(searchParams.get('itemPrice') || '')
  const previewItemPrice = Number.isFinite(previewItemPriceRaw) ? Math.max(0, previewItemPriceRaw) : 0
  const [product, setProduct] = useState<ProductDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNewShopPreview) {
      setLoading(false)
      setError(null)
      return
    }

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getProductDetail(params.slug)
        setProduct(data)
      } catch (err: any) {
        if (err.message === 'Product not found') {
          setError('not_found')
        } else {
          setError(err.message || 'Không thể tải dữ liệu')
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [isNewShopPreview, params.slug])

  if (isNewShopPreview) {
    const previewProduct = {
      id: 0,
      name: previewShopName,
      rating: 0,
      reviews: 0,
      sold: 0,
      complaints: '0%',
      seller: 'shop-moi',
      sellerVerified: true,
      category: 'Dịch vụ',
      stock: 0,
      description: `${previewShopName} - Vui lòng thêm mặt hàng trong quản lý kho để bắt đầu bán.`,
      variants: [],
      features: [],
      priceLabel: previewItemPrice > 0 ? `${previewItemPrice.toLocaleString('vi-VN')} VNĐ` : 'Giá cả thỏa thuận',
      emptyInventoryMessage: previewItemName || 'Chưa có mặt hàng nào được tạo, vui lòng thêm trong quản lý!',
    }

    return <ProductDetail product={previewProduct} reviews={[]} />
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

  if (error === 'not_found') {
    return (
      <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="fas fa-box-open text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-800 font-semibold text-lg mb-2">Sản phẩm không tồn tại</p>
            <p className="text-gray-600 text-sm mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link
              href="/san-pham/email"
              className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Quay lại danh sách
            </Link>
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
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const transformedProduct = transformProductData(product)

  return <ProductDetail product={transformedProduct} reviews={mockReviews} />
}
