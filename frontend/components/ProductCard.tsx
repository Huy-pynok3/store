import Link from 'next/link'
import { StarRating, ProductBadge } from './ui'

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

interface ProductCardProps {
  product: Product
  featured?: boolean
  onFavoriteToggle?: (productId: number) => void
}

export default function ProductCard({ product, featured = false, onFavoriteToggle }: ProductCardProps) {
  if (featured) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow relative">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4">
          {/* Product Image - Larger for featured */}
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] bg-gray-100 rounded overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <i className="fas fa-image text-white text-4xl"></i>
                </div>
              )}
            </div>
            <div className="absolute top-1 left-1 flex gap-1">
              <ProductBadge type="no-duplicate" size="xs" />
              <div className="bg-yellow-400 text-white text-xs font-medium w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center">
                <i className="fas fa-star text-[10px] sm:text-xs"></i>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 w-[160px] sm:w-[200px] text-center sm:text-left">
              <div className="text-xs sm:text-sm text-gray-500 mb-1 break-words text-center">Tồn kho: {product.stock.toLocaleString()}</div>
              <div className="text-base sm:text-lg font-bold text-gray-800 text-center whitespace-nowrap sm:whitespace-normal break-words leading-tight">{product.priceRange}</div>
            </div>
          </div>

          {/* Product Info - More space for featured */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Badge and Product Name on same line */}
            <div className="mb-2 sm:mb-3 min-w-0">
              <ProductBadge type="product" size="xs" className="align-middle mr-2" />
              <Link href={`/san-pham/${product.slug}`} className="inline">
                <h3 className="inline text-base sm:text-xl font-bold text-gray-800 hover:text-primary leading-tight">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2 sm:mb-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-xs sm:text-sm text-gray-600">
                {product.reviews} Reviews | Đơn hoàn thành: {product.sold.toLocaleString()} | Khiếu nại: {product.complaints}
              </span>
            </div>

            {/* Seller */}
            <div className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">
              Người bán: <Link href={`/seller/${product.seller}`} className="text-primary hover:underline font-medium">{product.seller}</Link>
            </div>

            {/* Category */}
            <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-4">
              Sản phẩm: <Link href={`/san-pham/${product.category.toLowerCase()}`} className="text-primary hover:underline font-medium">{product.category}</Link>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">◦ {product.description}</p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2 flex-1">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">◦</span>
                    <span className="flex-1">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Heart Icon - Top Right */}
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onFavoriteToggle?.(product.id)
            }}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 transition-colors ${
              product.isFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-300 hover:text-red-500'
            }`}
          >
            <i className={`${product.isFavorite ? 'fas' : 'far'} fa-heart text-lg sm:text-2xl`}></i>
          </button>

          {/* Partner/Reseller Icon - Bottom Right */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <i className="fas fa-handshake text-white text-xs sm:text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* Product Image */}
        <div className="relative flex-shrink-0 mx-auto sm:mx-0">
          <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] bg-gray-100 rounded overflow-hidden">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <i className="fas fa-image text-white text-3xl"></i>
              </div>
            )}
          </div>
          <div className="absolute top-1 left-1 flex gap-1">
            <ProductBadge type="no-duplicate" />
            <div className="bg-yellow-400 text-white text-[10px] font-medium w-6 h-6 rounded flex items-center justify-center">
              <i className="fas fa-star text-[10px]"></i>
            </div>
          </div>
          <div className="mt-2 w-[120px] sm:w-[140px] text-center sm:text-left">
            <div className="text-xs text-gray-500 mb-1 break-words text-center">Tồn kho: {product.stock.toLocaleString()}</div>
            <div className="text-sm font-bold text-gray-800 text-center whitespace-nowrap sm:whitespace-normal break-words leading-tight">{product.priceRange}</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Badge and Product Name on same line */}
          <div className="mb-2 min-w-0">
            <ProductBadge type="product" className="align-middle mr-2" />
            <Link href={`/san-pham/${product.slug}`} className="inline">
              <h3 className="inline text-sm sm:text-base font-semibold text-gray-800 hover:text-primary leading-tight">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Rating & Stats */}
          <div className="mb-2">
            <StarRating rating={product.rating} />
            <span className="text-[11px] sm:text-xs text-gray-500 block sm:inline">
              {product.reviews} Reviews | Đơn hoàn thành: {product.sold.toLocaleString()} | Khiếu nại: {product.complaints}
            </span>
          </div>

          {/* Seller */}
          <div className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2">
            Người bán: <Link href={`/seller/${product.seller}`} className="text-primary hover:underline font-medium">{product.seller}</Link>
          </div>

          {/* Category */}
          <div className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
            Sản phẩm: <Link href={`/san-pham/${product.category.toLowerCase()}`} className="text-primary hover:underline font-medium">{product.category}</Link>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-700 mb-2 hidden sm:block">◦ {product.description}</p>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1 flex-1 hidden sm:block">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">◦</span>
                  <span className="flex-1 line-clamp-2">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Heart Icon - Top Right */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onFavoriteToggle?.(product.id)
          }}
          className={`absolute top-3 right-3 transition-colors ${
            product.isFavorite 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-gray-300 hover:text-red-500'
          }`}
        >
          <i className={`${product.isFavorite ? 'fas' : 'far'} fa-heart text-lg sm:text-xl`}></i>
        </button>

        {/* Partner/Reseller Icon - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
            <i className="fas fa-handshake text-white text-[10px] sm:text-xs"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
