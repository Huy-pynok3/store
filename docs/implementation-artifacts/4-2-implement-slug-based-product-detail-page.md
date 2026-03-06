# Story 4.2: Implement Slug-Based Product Detail Page

Status: review

## Story

As a **buyer**,
I want **to view complete product details when I click a product**,
So that **I can see all information before making a purchase decision**.

## Acceptance Criteria

**Given** I click a product card with slug "gmail-new-usa-reg-ios"
**When** I navigate to `/san-pham/gmail-new-usa-reg-ios`
**Then** the page fetches data from `GET /products/slug/gmail-new-usa-reg-ios`
**And** the page displays all product details:
- Product name, description, short description
- Badge text
- Images
- Stock, sold count
- Rating, review count, completed orders, complaint percent
- Seller information (name, rating, total sales)
- Features list
- Price options with labels and stock
- Favorite status

**And** if the product exists, all data displays correctly
**And** if the slug is invalid, a 404 page displays
**And** the 404 page shows "Sản phẩm không tồn tại" message
**And** the 404 page provides a link back to listing page
**And** the existing detail page layout is unchanged (if it exists)
**And** the page works on desktop and mobile

## Tasks / Subtasks

- [ ] Add `getProductDetail` API function to Story 1.2 (if not exists)
  - [ ] Check if function exists in `frontend/lib/api/listing.ts`
  - [ ] If not, add function to fetch product by slug
  - [ ] Return ProductDetail type from Story 1.1

- [ ] Create or update `/san-pham/[slug]/page.tsx`
  - [ ] Create dynamic route with slug parameter
  - [ ] Fetch product data using slug
  - [ ] Display all product details
  - [ ] Handle loading state
  - [ ] Handle 404 for invalid slug
  - [ ] Keep existing layout if page exists

## Dev Notes

### Critical Requirements

1. **Files to Create/Modify**:
   - `frontend/lib/api/listing.ts` - Add getProductDetail if missing
   - `frontend/app/san-pham/[slug]/page.tsx` - Create/update detail page

2. **API Endpoint**: `GET /products/slug/:slug`
3. **404 Handling**: Show error page for invalid slugs
4. **Keep UI**: If detail page exists, keep layout

### Check Existing Implementation

First, check if `getProductDetail` exists in Story 1.2:

```typescript
// From Story 1.2 - frontend/lib/api/listing.ts
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found')
    }
    throw new Error('Failed to fetch product detail')
  }
  
  return response.json()
}
```

If this function doesn't exist, add it.

### ProductDetail Type

**From Story 1.1** (`frontend/types/listing.ts`):
```typescript
export interface ProductDetail {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string | null
  badgeText: string | null
  images: string[]
  stock: number
  priceMin: number
  priceMax: number
  rating: number
  reviewCount: number
  completedOrders: number
  complaintPercent: number
  features: string[]
  priceOptions: PriceOption[]
  seller: {
    name: string
    rating: number
    totalSales: number
  }
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface PriceOption {
  id: string
  label: string
  price: number
  stock: number
}
```

### Dynamic Route Implementation

**File**: `frontend/app/san-pham/[slug]/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProductDetail } from '@/lib/api/listing'
import { ProductDetail } from '@/types/listing'
import { formatVND, formatPercent } from '@/lib/utils/format'
import { StarRating, ProductBadge } from '@/components/ui'

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
  }, [params.slug])

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
            <button
              onClick={() => router.push('/san-pham/email')}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Quay lại danh sách
            </button>
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

  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        {/* Product Header */}
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-2">
            {product.badgeText && <ProductBadge type="product" />}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{product.title}</h1>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <StarRating rating={product.rating} />
              <span>({product.reviewCount} đánh giá)</span>
            </div>
            <span>Đã bán: {product.completedOrders.toLocaleString()}</span>
            <span>Khiếu nại: {formatPercent(product.complaintPercent)}</span>
          </div>
        </div>

        {/* Product Images */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} - ${index + 1}`}
                className="w-full h-64 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Product Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h2>
          {product.shortDescription && (
            <p className="text-gray-700 mb-2">{product.shortDescription}</p>
          )}
          <p className="text-gray-700">{product.description}</p>
        </div>

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tính năng</h2>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-primary mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price Options */}
        {product.priceOptions.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tùy chọn giá</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.priceOptions.map((option) => (
                <div key={option.id} className="border border-gray-200 rounded p-4">
                  <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                  <div className="text-primary font-bold text-lg mb-1">{formatVND(option.price)}</div>
                  <div className="text-sm text-gray-600">Tồn kho: {option.stock.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seller Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Thông tin người bán</h2>
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-gray-800">{product.seller.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarRating rating={product.seller.rating} size="sm" />
                <span>Đã bán: {product.seller.totalSales.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Info */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-600">
            Tồn kho: <span className="font-semibold text-gray-800">{product.stock.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### API Function (if missing)

**File**: `frontend/lib/api/listing.ts`

Add this function if it doesn't exist:

```typescript
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`)
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found')
    }
    throw new Error('Failed to fetch product detail')
  }
  
  return response.json()
}
```

### Testing Checklist

After implementation:

1. **Navigation:**
   - Click product card navigates to slug URL
   - URL shows `/san-pham/gmail-new-usa-reg-ios`

2. **Data display:**
   - All product details show correctly
   - Images display
   - Features list shows
   - Price options display
   - Seller info shows

3. **404 handling:**
   - Invalid slug shows 404 page
   - "Quay lại danh sách" button works

4. **States:**
   - Loading spinner shows
   - Error state with retry
   - Success state with data

### Common Pitfalls to Avoid

1. **Don't forget 404 handling** - Invalid slugs must show error
2. **Don't forget loading state** - Show spinner during fetch
3. **Don't forget error state** - Handle API failures
4. **Don't hardcode API URL** - Use environment variable
5. **Don't forget TypeScript types** - Use ProductDetail type

### Previous Story Context

**Story 4.1 completed:**
- Product cards link to slug URLs
- Slug available in product data
- Status: review

**Story 1.1 completed:**
- ProductDetail type defined
- All types available

**Story 1.2 completed:**
- API functions available
- May need to add getProductDetail

### Next Steps After This Story

Once Story 4.2 is complete:
- **Epic 4 will be complete** - Product detail pages working
- All major features implemented
- Ready for testing and deployment

### References

- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Story 1.2]: `docs/implementation-artifacts/1-2-create-api-service-layer-for-listing-endpoints.md`
- [Story 4.1]: `docs/implementation-artifacts/4-1-update-product-card-links-to-use-slugs.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 4, Story 4.2
- [Backend API]: `backend/API_REFERENCE.md` - Product detail endpoint

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript compilation: 0 errors
- Fixed ProductFeature field name: `feature.name` → `feature.content`
- Removed unused `router` import and variable

### Completion Notes List

1. **Product Detail Page Created**: `frontend/app/san-pham/[slug]/page.tsx`
   - Dynamic route with slug parameter
   - Fetches product data using `getProductDetail(slug)`
   - Displays all product details: name, description, images, features, price options, seller info
   - Loading state with spinner
   - 404 state for invalid slugs with "Quay lại danh sách" link
   - Error state with retry button

2. **Field Mapping Verified**:
   - `product.name` (not title)
   - `product.ratingAvg` (not rating)
   - `product.shop` (not seller)
   - `feature.content` (not name)

3. **API Function Verified**: `getProductDetail` already exists in `frontend/lib/api/listing.ts`

4. **TypeScript Compilation**: 0 errors

5. **Ready for Testing**:
   - Navigate from product card to detail page
   - Test with valid slug (e.g., `/san-pham/gmail-new-usa-reg-ios`)
   - Test with invalid slug for 404 handling
   - Verify all data displays correctly

### File List

- [x] `frontend/app/san-pham/[slug]/page.tsx` - Created slug-based detail page
- [x] `frontend/lib/api/listing.ts` - getProductDetail function already exists (Story 1.2)
