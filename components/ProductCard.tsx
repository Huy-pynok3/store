import Link from 'next/link'
import { StarRating, ProductBadge } from './ui'

interface Product {
  id: number
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
}

export default function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  if (featured) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow relative">
        <div className="flex gap-4 p-4">
          {/* Product Image - Larger for featured */}
          <div className="relative flex-shrink-0">
            <div className="w-[200px] h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 rounded flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-5xl mb-2">
                  <i className="fab fa-tiktok"></i>
                </div>
                <div className="text-white text-xl font-bold">TikTok</div>
                <div className="text-white text-base">Shop</div>
                <i className="fas fa-shopping-cart text-primary text-2xl mt-2"></i>
              </div>
            </div>
            <div className="absolute top-1 left-1 flex gap-1">
              <ProductBadge type="no-duplicate" size="xs" />
              <div className="bg-yellow-400 text-white text-xs font-medium w-7 h-7 rounded flex items-center justify-center">
                <i className="fas fa-star text-xs"></i>
              </div>
            </div>
            <div className="text-center mt-3">
              <div className="text-sm text-gray-500 mb-1">Tồn kho: {product.stock.toLocaleString()}</div>
              <div className="text-lg font-bold text-gray-800">{product.priceRange}</div>
            </div>
          </div>

          {/* Product Info - More space for featured */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Badge and Product Name on same line */}
            <div className="flex items-start gap-2 mb-3">
              <ProductBadge type="product" size="xs" className="flex-shrink-0" />
              <Link href={`/san-pham/${product.id}`} className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-800 hover:text-primary leading-tight">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-gray-600">
                {product.reviews} Reviews | Đơn hoàn thành: {product.sold.toLocaleString()} | Khiếu nại: {product.complaints}
              </span>
            </div>

            {/* Seller */}
            <div className="text-sm text-gray-700 mb-2">
              Người bán: <Link href={`/seller/${product.seller}`} className="text-primary hover:underline font-medium">{product.seller}</Link>
            </div>

            {/* Category */}
            <div className="text-sm text-gray-700 mb-4">
              Sản phẩm: <Link href={`/san-pham/${product.category.toLowerCase()}`} className="text-primary hover:underline font-medium">{product.category}</Link>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-700 mb-3">◦ {product.description}</p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <ul className="text-sm text-gray-700 space-y-2 flex-1">
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
          <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
            <i className="far fa-heart text-2xl"></i>
          </button>

          {/* Partner/Reseller Icon - Bottom Right */}
          <div className="absolute bottom-4 right-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <i className="fas fa-handshake text-white text-sm"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow relative">
      <div className="flex gap-3 p-3">
        {/* Product Image */}
        <div className="relative flex-shrink-0">
          <div className="w-[140px] h-[140px] bg-gradient-to-br from-red-400 to-pink-500 rounded flex items-center justify-center">
            <i className="fas fa-envelope text-white text-5xl"></i>
          </div>
          <div className="absolute top-1 left-1 flex gap-1">
            <ProductBadge type="no-duplicate" />
            <div className="bg-yellow-400 text-white text-[10px] font-medium w-6 h-6 rounded flex items-center justify-center">
              <i className="fas fa-star text-[10px]"></i>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-gray-500 mb-1">Tồn kho: {product.stock.toLocaleString()}</div>
            <div className="text-sm font-bold text-gray-800">{product.priceRange}</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Badge and Product Name on same line */}
          <div className="flex items-start gap-2 mb-2">
            <ProductBadge type="product" className="flex-shrink-0" />
            <Link href={`/san-pham/${product.id}`} className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-800 hover:text-primary line-clamp-2 leading-tight">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Rating & Stats */}
          <div className="mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-500">
              {product.reviews} Reviews | Đơn hoàn thành: {product.sold.toLocaleString()} | Khiếu nại: {product.complaints}
            </span>
          </div>

          {/* Seller */}
          <div className="text-sm text-gray-700 mb-2">
            Người bán: <Link href={`/seller/${product.seller}`} className="text-primary hover:underline font-medium">{product.seller}</Link>
          </div>

          {/* Category */}
          <div className="text-sm text-gray-700 mb-3">
            Sản phẩm: <Link href={`/san-pham/${product.category.toLowerCase()}`} className="text-primary hover:underline font-medium">{product.category}</Link>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-700 mb-2">◦ {product.description}</p>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <ul className="text-sm text-gray-700 space-y-1 flex-1">
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
        <button className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors">
          <i className="far fa-heart text-xl"></i>
        </button>

        {/* Partner/Reseller Icon - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
            <i className="fas fa-handshake text-white text-xs"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
