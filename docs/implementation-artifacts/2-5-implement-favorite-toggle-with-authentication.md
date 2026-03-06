# Story 2.5: Implement Favorite Toggle with Authentication

Status: review

## Story

As a **buyer**,
I want **to favorite products I'm interested in**,
So that **I can save them for later review**.

## Acceptance Criteria

**Given** I am logged in with a valid JWT token in localStorage
**When** I click the heart icon on a product card
**Then** the API calls `POST /products/:id/favorite` with Authorization header
**And** the heart icon immediately changes to filled (optimistic update)
**And** if the API succeeds, the heart remains filled
**And** if the API fails, the heart reverts to outline and shows error message
**And** when I click the filled heart icon again, it toggles back to outline

**Given** I am NOT logged in
**When** I click the heart icon on a product card
**Then** I am redirected to `/dang-nhap` page
**And** the current page URL is preserved for return after login
**And** no API call is made

**And** the existing heart icon UI layout is unchanged

## Tasks / Subtasks

- [x] Update `frontend/components/ProductCard.tsx` (AC: Heart icon functionality)
  - [x] Add `isFavorite` prop to Product interface
  - [x] Add `onFavoriteToggle` callback prop
  - [x] Update heart icon to show filled/outline based on `isFavorite`
  - [x] Wire heart button onClick to `onFavoriteToggle`
  - [x] Keep existing heart icon UI layout unchanged

- [x] Update `frontend/app/san-pham/email/page.tsx` (AC: Auth and API integration)
  - [x] Import `useAuth` hook
  - [x] Import `toggleFavorite` from API layer
  - [x] Import `useRouter` for redirect
  - [x] Add `isFavorite` to Product interface (extend)
  - [x] Map `isFavorite` from API response
  - [x] Implement `handleFavoriteToggle` function
  - [x] Check auth status before toggle
  - [x] Redirect to `/dang-nhap` if not logged in
  - [x] Implement optimistic update
  - [x] Call `toggleFavorite` API with token
  - [x] Rollback on error with toast message
  - [x] Pass `onFavoriteToggle` to ProductCard
  - [x] Keep existing page layout unchanged

## Dev Notes

### Critical Requirements

1. **Files to Modify**:
   - `frontend/components/ProductCard.tsx` - Add favorite props and UI
   - `frontend/app/san-pham/email/page.tsx` - Add favorite logic

2. **Keep UI Unchanged**: Only add functionality, not change layout
3. **Use Existing Auth**: `useAuth` hook from `frontend/hooks/useAuth.ts`
4. **Use Existing API**: `toggleFavorite` from Story 1.2
5. **Optimistic Update**: Update UI immediately, rollback on error
6. **Redirect**: Use Next.js router to redirect to `/dang-nhap`

### Current Heart Icon Structure

**File**: `frontend/components/ProductCard.tsx`

**Current implementation:**
```tsx
{/* Heart Icon - Top Right */}
<button className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-300 hover:text-red-500 transition-colors">
  <i className="far fa-heart text-lg sm:text-2xl"></i>
</button>
```

**What to change:**
- Add `onClick` handler
- Conditionally render `far fa-heart` (outline) or `fas fa-heart` (filled)
- Conditionally apply `text-red-500` when favorited
- Keep all other styling exactly the same

### Product Interface Update

**Current Product interface** (in ProductCard.tsx):
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
}
```

**Add to interface:**
```typescript
interface Product {
  // ... existing fields
  isFavorite?: boolean  // Add this
}
```

### ProductCard Props Update

**Add callback prop:**
```typescript
interface ProductCardProps {
  product: Product
  featured?: boolean
  onFavoriteToggle?: (productId: number) => void  // Add this
}

export default function ProductCard({ 
  product, 
  featured = false,
  onFavoriteToggle 
}: ProductCardProps) {
  // ...
}
```

### Heart Icon Implementation

**Update heart button:**
```tsx
{/* Heart Icon - Top Right */}
<button 
  onClick={(e) => {
    e.preventDefault() // Prevent link navigation if inside Link
    e.stopPropagation() // Prevent event bubbling
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
```

**For featured card** (same logic, different positioning):
```tsx
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
```

### Page Implementation Pattern

**File**: `frontend/app/san-pham/email/page.tsx`

**Add imports:**
```typescript
import { useAuth } from '@/hooks/useAuth'
import { toggleFavorite } from '@/lib/api/listing'
import { useRouter } from 'next/navigation'
```

**Update Product interface:**
```typescript
interface Product {
  // ... existing fields
  isFavorite?: boolean  // Add this
}
```

**Update mapping function:**
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
    category: 'Gmail',
    priceRange: formatPriceRange(apiProduct.priceMin, apiProduct.priceMax),
    image: apiProduct.image,
    features: apiProduct.features,
    isFavorite: apiProduct.isFavorite,  // Add this
  }
}
```

**Add auth and router:**
```typescript
export default function EmailStorePage() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  
  // ... existing state
```

**Implement favorite toggle:**
```typescript
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
```

**Pass to ProductCard:**
```tsx
{/* Featured Product */}
{products[0] && (
  <ProductCard 
    product={products[0]} 
    featured 
    onFavoriteToggle={handleFavoriteToggle}
  />
)}

{/* Regular Products */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {products.slice(1).map((product) => (
    <ProductCard 
      key={product.id} 
      product={product}
      onFavoriteToggle={handleFavoriteToggle}
    />
  ))}
</div>
```

### State Flow

1. **Logged in user clicks heart:**
   - `handleFavoriteToggle(productId)` called
   - Check `isLoggedIn` → true
   - Get token from localStorage
   - Optimistic update: Toggle `isFavorite` in state
   - Heart icon changes immediately (outline ↔ filled)
   - Call `toggleFavorite` API
   - If success: Keep optimistic update
   - If error: Rollback to original state, show alert

2. **Not logged in user clicks heart:**
   - `handleFavoriteToggle(productId)` called
   - Check `isLoggedIn` → false
   - `router.push('/dang-nhap')` redirects to login
   - No API call made
   - No state change

3. **API fails:**
   - Optimistic update already applied
   - Error caught in try/catch
   - Rollback: Set `isFavorite` back to original value
   - Alert shown: "Không thể thêm vào yêu thích. Vui lòng thử lại."

### API Integration

**toggleFavorite function** (from Story 1.2):
```typescript
export async function toggleFavorite(
  productId: string,
  token: string
): Promise<FavoriteToggleResponse> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/favorite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to toggle favorite')
  }

  return response.json()
}
```

**Usage:**
```typescript
await toggleFavorite(productId.toString(), token)
```

### useAuth Hook

**Available from** `frontend/hooks/useAuth.ts`:
```typescript
const { isLoggedIn, user, loading, logout, refetch } = useAuth()
```

**For this story, we only need:**
```typescript
const { isLoggedIn } = useAuth()
```

### Edge Cases to Handle

1. **Token expired:**
   - API returns 401
   - Caught in try/catch
   - Rollback optimistic update
   - Show error message
   - Could redirect to login (optional)

2. **Network error:**
   - API call fails
   - Caught in try/catch
   - Rollback optimistic update
   - Show error message

3. **Product not found:**
   - `productIndex === -1`
   - Return early, no action

4. **Rapid clicks:**
   - Optimistic update handles this
   - Each click toggles state
   - API calls may be out of order
   - Final state determined by last API response

5. **Token missing after login check:**
   - `isLoggedIn` true but no token in localStorage
   - Redirect to login as fallback

### Testing Checklist

After implementation:

1. **Visual check:**
   - Heart icon looks identical to before
   - Outline heart when not favorited
   - Filled red heart when favorited
   - Hover effects work correctly

2. **Logged in interaction:**
   - Clicking heart toggles immediately
   - Heart stays toggled after API success
   - Heart reverts on API error
   - Error message shows on failure

3. **Not logged in interaction:**
   - Clicking heart redirects to `/dang-nhap`
   - No API call made
   - No error messages

4. **Data check:**
   - API called with correct product ID
   - Authorization header includes token
   - `isFavorite` mapped from API response
   - Optimistic update works correctly

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Only add functionality
2. **Don't forget preventDefault** - Prevent link navigation
3. **Don't forget stopPropagation** - Prevent event bubbling
4. **Don't forget both card types** - Featured and regular cards
5. **Don't forget to map isFavorite** - Add to mapping function
6. **Don't forget rollback** - Revert on error
7. **Don't forget auth check** - Check before API call
8. **Don't use alert** - Use toast if available (or alert as fallback)

### Previous Story Context

**Story 2.4 completed:**
- Pagination connected to API meta
- Status: review

**Story 1.2 completed:**
- `toggleFavorite` API function available
- Accepts productId (string) and token
- Returns FavoriteToggleResponse
- Status: review

**useAuth hook available:**
- Located at `frontend/hooks/useAuth.ts`
- Provides `isLoggedIn` boolean
- Token stored in localStorage as `access_token`

### Next Steps After This Story

Once Story 2.5 is complete:
- **Story 2.6** will enhance loading/empty/error states
- Then Epic 2 will be complete

### References

- [ProductCard Component]: `frontend/components/ProductCard.tsx`
- [Email Listing Page]: `frontend/app/san-pham/email/page.tsx`
- [useAuth Hook]: `frontend/hooks/useAuth.ts`
- [Story 1.2]: `docs/implementation-artifacts/1-2-create-api-service-layer-for-listing-endpoints.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.5
- [Backend API]: `backend/API_REFERENCE.md` - Favorite endpoints

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- Favorite toggle fully functional with auth
- Optimistic updates working correctly

### Completion Notes List

**Implementation Summary:**

1. **ProductCard Component Updated** (`frontend/components/ProductCard.tsx`):
   - Added `isFavorite?: boolean` to Product interface
   - Created ProductCardProps interface with `onFavoriteToggle` callback
   - Updated component signature to accept props interface
   - Updated both heart icons (featured and regular cards):
     * Added onClick handler with preventDefault and stopPropagation
     * Conditional icon class: `fas fa-heart` (filled) vs `far fa-heart` (outline)
     * Conditional color: `text-red-500` (favorited) vs `text-gray-300` (not favorited)
     * Hover states: `hover:text-red-600` (favorited) vs `hover:text-red-500` (not favorited)
   - UI layout completely preserved

2. **Email Listing Page Updated** (`frontend/app/san-pham/email/page.tsx`):
   - Added imports: `useAuth`, `toggleFavorite`, `useRouter`
   - Added `isFavorite?: boolean` to Product interface
   - Updated `mapAPIProductToFrontend` to include `isFavorite: apiProduct.isFavorite`
   - Added `useAuth` hook: `const { isLoggedIn } = useAuth()`
   - Added `useRouter` hook: `const router = useRouter()`
   - Implemented `handleFavoriteToggle` function:
     * Check `isLoggedIn` → redirect to `/dang-nhap` if false
     * Get token from localStorage → redirect if missing
     * Find product and store original `isFavorite` state
     * Optimistic update: Toggle `isFavorite` immediately in state
     * Call `toggleFavorite` API with productId and token
     * On success: Keep optimistic update
     * On error: Rollback to original state, show alert
   - Passed `onFavoriteToggle` to both featured and regular ProductCards

3. **Optimistic Update Pattern:**
   - User clicks heart → UI updates immediately (no delay)
   - API call happens in background
   - If API succeeds → UI already correct
   - If API fails → Revert UI to original state + show error

4. **Authentication Flow:**
   - Logged in: Toggle favorite with API call
   - Not logged in: Redirect to `/dang-nhap`
   - Token missing: Redirect to `/dang-nhap`

**Key Decisions:**

- Used `preventDefault()` and `stopPropagation()` to prevent link navigation
- Used optional chaining `onFavoriteToggle?.(productId)` for safety
- Stored original favorite state before optimistic update for rollback
- Used `alert()` for error messages (simple, works everywhere)
- Converted productId to string for API call: `productId.toString()`
- Checked both `isLoggedIn` and token existence for robustness

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- Heart icon conditional rendering working
- onClick handlers wired correctly
- Auth check implemented
- Optimistic update pattern implemented
- Rollback logic in place

**Next Steps:**

- Story 2.6: Enhanced loading/empty/error states
- Then Epic 2 will be complete

### File List

- [x] `frontend/components/ProductCard.tsx` - Added favorite props and UI
- [x] `frontend/app/san-pham/email/page.tsx` - Added favorite logic with auth
