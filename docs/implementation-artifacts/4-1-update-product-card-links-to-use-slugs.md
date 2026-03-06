# Story 4.1: Update Product Card Links to Use Slugs

Status: review

## Story

As a **buyer**,
I want **product cards to link to detail pages using slugs**,
So that **I can view product details with SEO-friendly URLs**.

## Acceptance Criteria

**Given** product cards display on listing pages
**When** the API response includes `slug` field for each product
**Then** product card links use `/san-pham/[slug]` format instead of `/san-pham/[id]`
**And** clicking a product card navigates to the slug-based URL
**And** the slug is extracted from the API response
**And** the existing ProductCard component layout is unchanged

## Tasks / Subtasks

- [x] Update `frontend/components/ProductCard.tsx` (AC: All)
  - [x] Add `slug` field to Product interface
  - [x] Update product name link to use slug instead of id
  - [x] Keep existing ProductCard layout unchanged

- [x] Update `frontend/hooks/useListingPage.ts` (AC: Slug mapping)
  - [x] Add `slug` to Product interface
  - [x] Map `slug` from API response in `mapAPIProductToFrontend`

## Dev Notes

### Critical Requirements

1. **Files to Modify**:
   - `frontend/components/ProductCard.tsx` - Add slug to interface, update links
   - `frontend/hooks/useListingPage.ts` - Add slug to interface, map from API

2. **Keep UI Unchanged**: Only change href, not layout
3. **Slug from API**: Already available in `APIProductCard.slug`
4. **URL Format**: `/san-pham/[slug]` instead of `/san-pham/[id]`

### Current Link Implementation

**File**: `frontend/components/ProductCard.tsx`

**Current links** (2 places - featured and regular):
```tsx
<Link href={`/san-pham/${product.id}`} className="inline">
  <h3 className="inline text-base sm:text-xl font-bold text-gray-800 hover:text-primary leading-tight">
    {product.name}
  </h3>
</Link>
```

**What to change:**
```tsx
<Link href={`/san-pham/${product.slug}`} className="inline">
  <h3 className="inline text-base sm:text-xl font-bold text-gray-800 hover:text-primary leading-tight">
    {product.name}
  </h3>
</Link>
```

### Product Interface Update

**Current interface** (in ProductCard.tsx):
```typescript
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
  isFavorite?: boolean
}
```

**Add slug field:**
```typescript
interface Product {
  id: number
  slug: string  // Add this
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
```

### useListingPage Hook Update

**File**: `frontend/hooks/useListingPage.ts`

**Current Product interface:**
```typescript
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
  isFavorite?: boolean
}
```

**Add slug field:**
```typescript
interface Product {
  id: number
  slug: string  // Add this
  // ... rest of fields
}
```

**Current mapping function:**
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
    category: category,
    priceRange: formatPriceRange(apiProduct.priceMin, apiProduct.priceMax),
    image: apiProduct.image,
    features: apiProduct.features,
    isFavorite: apiProduct.isFavorite,
  }
}
```

**Add slug mapping:**
```typescript
function mapAPIProductToFrontend(apiProduct: APIProductCard): Product {
  return {
    id: parseInt(apiProduct.id) || 0,
    slug: apiProduct.slug,  // Add this
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
```

### API Response Structure

**APIProductCard** (from Story 1.1):
```typescript
{
  id: string,
  slug: string,  // Already available
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

The `slug` field is already available in the API response, we just need to map it.

### Implementation Steps

1. **Update ProductCard.tsx:**
   - Add `slug: string` to Product interface
   - Change `href={`/san-pham/${product.id}`}` to `href={`/san-pham/${product.slug}`}` (2 places)

2. **Update useListingPage.ts:**
   - Add `slug: string` to Product interface
   - Add `slug: apiProduct.slug` to mapping function

3. **Verify:**
   - TypeScript compilation
   - Links now use slugs
   - Clicking product navigates to slug-based URL

### Testing Checklist

After implementation:

1. **Visual check:**
   - ProductCard looks identical
   - No layout changes

2. **Link check:**
   - Hover over product name shows slug-based URL
   - Example: `/san-pham/gmail-new-usa-reg-ios` instead of `/san-pham/123`

3. **Navigation check:**
   - Clicking product navigates to slug URL
   - URL in browser shows slug

4. **TypeScript check:**
   - 0 compilation errors
   - slug field properly typed

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Only update href
2. **Don't forget both places** - Featured and regular cards
3. **Don't forget hook interface** - Update Product interface in hook too
4. **Don't forget mapping** - Add slug to mapAPIProductToFrontend
5. **Don't use id** - Use slug for links

### Previous Story Context

**Story 3.1 completed:**
- useListingPage hook created
- All listing pages use hook
- Product interface defined in hook

**Story 1.1 completed:**
- APIProductCard includes slug field
- Types available for use

### Next Steps After This Story

Once Story 4.1 is complete:
- **Story 4.2** will implement slug-based product detail page
- Then Epic 4 will be complete

### References

- [ProductCard Component]: `frontend/components/ProductCard.tsx`
- [useListingPage Hook]: `frontend/hooks/useListingPage.ts`
- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 4, Story 4.1

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors on ProductCard
- TypeScript diagnostics: 0 errors on useListingPage hook
- Links now use slugs instead of IDs

### Completion Notes List

**Implementation Summary:**

1. **ProductCard Component Updated** (`frontend/components/ProductCard.tsx`):
   - Added `slug: string` to Product interface
   - Updated featured card link: `href={`/san-pham/${product.slug}`}`
   - Updated regular card link: `href={`/san-pham/${product.slug}`}`
   - UI layout completely unchanged
   - 0 TypeScript errors

2. **useListingPage Hook Updated** (`frontend/hooks/useListingPage.ts`):
   - Added `slug: string` to Product interface
   - Added `slug: apiProduct.slug` to mapAPIProductToFrontend function
   - Slug now mapped from API response
   - 0 TypeScript errors

3. **URL Format Change:**
   - Before: `/san-pham/123` (ID-based)
   - After: `/san-pham/gmail-new-usa-reg-ios` (slug-based)
   - SEO-friendly URLs
   - More readable and descriptive

**Key Decisions:**

- Used slug from APIProductCard (already available from backend)
- Updated both featured and regular card links
- Kept all other ProductCard functionality unchanged
- Product interface updated in both files for consistency

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- Links updated in 2 places (featured + regular cards)
- Slug field properly typed as string
- Mapping function includes slug

**Next Steps:**

- Story 4.2: Implement slug-based product detail page
- Create `/san-pham/[slug]/page.tsx` dynamic route
- Fetch product data using slug
- Display complete product details

### File List

- [x] `frontend/components/ProductCard.tsx` - Added slug to interface, updated links
- [x] `frontend/hooks/useListingPage.ts` - Added slug to interface and mapping
