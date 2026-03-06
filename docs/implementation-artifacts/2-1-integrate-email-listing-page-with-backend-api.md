# Story 2.1: Integrate Email Listing Page with Backend API

Status: review

## Story

As a **buyer**,
I want **to see real email products from the backend**,
So that **I can browse actual available products with accurate stock and pricing**.

## Acceptance Criteria

**Given** the API service layer from Epic 1 exists
**When** I navigate to `/san-pham/email`
**Then** the page fetches data from `/products/email` endpoint
**And** product cards display real data (title, image, price, stock, seller, rating, reviews, sold, complaints, features)
**And** backend `title` field maps to frontend `name` prop
**And** backend `priceMin`/`priceMax` map to frontend `priceRange` using `formatPriceRange()`
**And** backend `reviewCount` maps to frontend `reviews`
**And** backend `completedOrders` maps to frontend `sold`
**And** backend `complaintPercent` maps to frontend `complaints` using `formatPercent()`
**And** the existing ProductCard component layout is unchanged
**And** the featured product (first item) displays correctly
**And** regular products display in 2-column grid on desktop, 1-column on mobile

## Tasks / Subtasks

- [x] Update `frontend/app/san-pham/email/page.tsx` (AC: All)
  - [x] Import Epic 1 utilities (types, API, route mapping, format)
  - [x] Add state for products, loading, error
  - [x] Implement useEffect to fetch data on mount
  - [x] Map backend ProductCard to frontend Product interface
  - [x] Update product grid to use API data
  - [x] Update total count from API meta
  - [x] Keep existing UI layout unchanged
  - [x] Handle loading and error states

## Dev Notes

### Critical Requirements

1. **File to Modify**: `frontend/app/san-pham/email/page.tsx`
2. **Keep UI Unchanged**: Only replace data source, not layout
3. **Use Epic 1 Utilities**: Import from all 4 Epic 1 stories
4. **Data Mapping**: Backend fields → Frontend props (see mapping below)
5. **Loading States**: Show spinner during fetch
6. **Error Handling**: Display error message if API fails

### Current Page Structure

**File**: `frontend/app/san-pham/email/page.tsx`

**Current implementation:**
- Uses mock data from `emailProducts` array
- Displays featured product (first item) full-width
- Shows remaining products in 2-column grid
- Has pagination (currently static)
- Has sort tabs (currently non-functional)
- Has mobile filter drawer

**What to change:**
- Replace `emailProducts` with API data
- Add loading/error states
- Keep all UI exactly the same

### Epic 1 Utilities to Import

```typescript
// Types from Story 1.1
import { ProductCard as APIProductCard, ProductListResponse } from '@/types/listing';

// API functions from Story 1.2
import { getProductListing } from '@/lib/api/listing';

// Route mapping from Story 1.3
import { getEndpointFromRoute } from '@/lib/utils/routeMapping';

// Format utilities from Story 1.4
import { formatPriceRange, formatPercent, formatNumber } from '@/lib/utils/format';
```

### Data Mapping Requirements

**Backend API Response** (`ProductCard` from Story 1.1):
```typescript
{
  id: string,
  slug: string,
  title: string,
  image: string,
  badgeText: string | null,
  sellerName: string,
  stock: number,
  priceMin: number,
  priceMax: number,
  rating: number,
  reviewCount: number,
  completedOrders: number,
  complaintPercent: number,
  features: string[],
  isFavorite: boolean
}
```

**Frontend ProductCard Props** (from `ProductCard.tsx`):
```typescript
{
  id: number,           // Convert from string
  badge: string,        // Use badgeText or default
  stock: number,        // Direct mapping
  name: string,         // Map from title
  rating: number,       // Direct mapping
  reviews: number,      // Map from reviewCount
  sold: number,         // Map from completedOrders
  complaints: string,   // Format complaintPercent with formatPercent()
  seller: string,       // Map from sellerName
  category: string,     // Use "Gmail" or extract from context
  priceRange: string,   // Format priceMin/priceMax with formatPriceRange()
  image: string,        // Direct mapping
  features: string[]    // Direct mapping (optional)
}
```

### Mapping Function Example

```typescript
function mapAPIProductToFrontend(apiProduct: APIProductCard): Product {
  return {
    id: parseInt(apiProduct.id) || 0,
    badge: apiProduct.badgeText || 'Sản phẩm',
    stock: apiProduct.stock,
    name: apiProduct.title,
    rating: apiProduct.rating,
    reviews: apiProduct.reviewCount,
    sold: apiProduct.completedOrders,
    complaints: formatPercent(apiProduct.complaintPercent),
    seller: apiProduct.sellerName,
    category: 'Gmail', // Or extract from route/context
    priceRange: formatPriceRange(apiProduct.priceMin, apiProduct.priceMax),
    image: apiProduct.image,
    features: apiProduct.features,
  };
}
```

### Implementation Pattern

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ProductCard as APIProductCard } from '@/types/listing'
import { getProductListing } from '@/lib/api/listing'
import { getEndpointFromRoute } from '@/lib/utils/routeMapping'
import { formatPriceRange, formatPercent } from '@/lib/utils/format'
// ... other imports

export default function EmailStorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        
        const route = '/san-pham/email'
        const endpoint = getEndpointFromRoute(route)
        const response = await getProductListing(endpoint, {
          sort: 'popular',
          page: 1,
          limit: 12
        })
        
        const mappedProducts = response.data.map(mapAPIProductToFrontend)
        setProducts(mappedProducts)
        setTotalCount(response.meta.total)
      } catch (err: any) {
        setError(err.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Rest of existing UI code...
}
```

### Loading State

**Simple approach:**
```typescript
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
```

### Error State

```typescript
if (error) {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <p className="text-gray-800 font-semibold mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    </div>
  )
}
```

### Previous Story Context

**Epic 1 completed:**
- Story 1.1: Types at `frontend/types/listing.ts`
- Story 1.2: API functions at `frontend/lib/api/listing.ts`
- Story 1.3: Route mapping at `frontend/lib/utils/routeMapping.ts`
- Story 1.4: Format utilities at `frontend/lib/utils/format.ts`

**All utilities tested and working** - TypeScript compilation verified

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Only replace data source
2. **Don't modify ProductCard component** - It already works
3. **Don't forget data mapping** - Backend fields ≠ Frontend props
4. **Don't skip loading states** - Users need feedback
5. **Don't hardcode category** - Use "Gmail" for email products
6. **Don't forget to format** - Use formatPriceRange() and formatPercent()

### Testing Checklist

After implementation:

1. **Visual check:**
   - Page looks identical to before
   - Featured product displays full-width
   - Regular products in 2-column grid
   - All data displays correctly

2. **Data check:**
   - Product names from API
   - Prices formatted with dots (3.000đ)
   - Stock numbers formatted (8.261)
   - Complaints formatted (0.0%)
   - Features display correctly

3. **States check:**
   - Loading spinner shows on mount
   - Error message if backend down
   - Products display after load

### Next Steps After This Story

Once Story 2.1 is complete:
- **Story 2.2** will add dynamic filter integration
- **Story 2.3** will make sort tabs functional
- **Story 2.4** will connect pagination to API
- **Story 2.5** will implement favorite toggle
- **Story 2.6** will add loading/empty/error states (enhanced)

### References

- [Current Page]: `frontend/app/san-pham/email/page.tsx`
- [ProductCard Component]: `frontend/components/ProductCard.tsx`
- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Story 1.2]: `docs/implementation-artifacts/1-2-create-api-service-layer-for-listing-endpoints.md`
- [Story 1.3]: `docs/implementation-artifacts/1-3-create-route-to-endpoint-mapping-utility.md`
- [Story 1.4]: `docs/implementation-artifacts/1-4-create-format-utilities-for-vietnamese-currency-and-numbers.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.1

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- All imports resolved correctly
- State management implemented with proper typing

### Completion Notes List

**Implementation Summary:**

1. **Imports Added** - All Epic 1 utilities imported:
   - Types: `ProductCard as APIProductCard` from `@/types/listing`
   - API: `getProductListing` from `@/lib/api/listing`
   - Route mapping: `getEndpointFromRoute` from `@/lib/utils/routeMapping`
   - Format: `formatPriceRange`, `formatPercent` from `@/lib/utils/format`

2. **State Management** - Added 4 state variables:
   - `products`: Product[] - Stores mapped product data
   - `loading`: boolean - Tracks fetch state
   - `error`: string | null - Stores error messages
   - `totalCount`: number - Stores total from API meta

3. **Data Fetching** - useEffect implementation:
   - Fetches on mount and when `currentPage` changes
   - Uses route mapping to get endpoint: `/san-pham/email` → `/products/email`
   - Passes sort, page, limit params to API
   - Maps API response using `mapAPIProductToFrontend()`
   - Updates products and totalCount state

4. **Data Mapping Function** - `mapAPIProductToFrontend()`:
   - Converts backend `ProductCard` to frontend `Product`
   - Maps: title→name, priceMin/Max→priceRange, reviewCount→reviews, completedOrders→sold
   - Formats: priceRange with `formatPriceRange()`, complaints with `formatPercent()`
   - Sets category to "Gmail" for email products

5. **Loading State** - Displays centered spinner:
   - Shows "Đang tải sản phẩm..." message
   - Uses Tailwind animate-spin for spinner
   - Maintains page layout structure

6. **Error State** - Displays error message:
   - Shows red exclamation icon
   - Displays "Không thể tải dữ liệu" header
   - Shows specific error message from catch block

7. **UI Preserved** - All existing layout unchanged:
   - Featured product (first item) full-width
   - Regular products in 2-column grid (1-column mobile)
   - Breadcrumb, tabs, pagination, filter drawer all intact
   - Total count displays formatted number

**Key Decisions:**

- Used `parseInt(apiProduct.id)` to convert string ID to number for frontend
- Default badge to "Sản phẩm" if `badgeText` is null
- Category hardcoded to "Gmail" (appropriate for email products)
- Error messages in Vietnamese for consistency
- Loading/error states maintain page container structure

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- All imports resolve correctly
- State types match component requirements
- Data mapping covers all required fields
- UI layout structure preserved

**Next Steps:**

- Story 2.2: Connect sidebar filters with dynamic subtype counts
- Story 2.3: Make sort tabs functional with API
- Story 2.4: Connect pagination to API meta
- Story 2.5: Implement favorite toggle with auth
- Story 2.6: Enhanced loading/empty/error states

### File List

- [x] `frontend/app/san-pham/email/page.tsx` - Updated with API integration
