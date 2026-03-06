# Story 2.3: Implement Sort Tabs with API Integration

Status: review

## Story

As a **buyer**,
I want **to sort products by popularity or price**,
So that **I can find the best deals or most popular items**.

## Acceptance Criteria

**Given** the email listing page is loaded
**When** I click the "Phổ biến" tab
**Then** the API is called with `sort=popular` parameter
**And** products are sorted by completed orders descending
**And** the "Phổ biến" tab shows active state (primary color, bottom border)

**When** I click the "Giá tăng dần" tab
**Then** the API is called with `sort=price_asc` parameter
**And** products are sorted by minimum price ascending
**And** pagination resets to page 1
**And** the "Giá tăng dần" tab shows active state

**When** I click the "Giá giảm dần" tab
**Then** the API is called with `sort=price_desc` parameter
**And** products are sorted by maximum price descending
**And** pagination resets to page 1
**And** the "Giá giảm dần" tab shows active state

**And** the existing tab UI layout is unchanged

## Tasks / Subtasks

- [x] Update `frontend/app/san-pham/email/page.tsx` (AC: All)
  - [x] Add state for `sortBy` (default: 'popular')
  - [x] Update useEffect to use `sortBy` state in API params
  - [x] Add `sortBy` to useEffect dependencies
  - [x] Implement `handleSortChange` function
  - [x] Reset `currentPage` to 1 when sort changes
  - [x] Wire sort tabs to `handleSortChange`
  - [x] Update active tab styling based on `sortBy` state
  - [x] Keep existing tab UI layout unchanged

## Dev Notes

### Critical Requirements

1. **File to Modify**: `frontend/app/san-pham/email/page.tsx`
2. **Keep UI Unchanged**: Only make tabs functional, not change layout
3. **Sort Values**: `popular`, `price_asc`, `price_desc`
4. **Reset Pagination**: Set page to 1 when sort changes
5. **Active State**: Primary color text + bottom border for active tab

### Current Tab Structure

**File**: `frontend/app/san-pham/email/page.tsx`

**Current implementation:**
```tsx
<div className="flex flex-wrap gap-3 sm:gap-4 mb-4 border-b border-gray-200 overflow-x-auto">
  <button className="pb-2 px-1 text-xs sm:text-sm font-medium text-primary border-b-2 border-primary whitespace-nowrap">
    Phổ biến
  </button>
  <button className="pb-2 px-1 text-xs sm:text-sm text-gray-600 hover:text-primary whitespace-nowrap">
    Giá tăng dần
  </button>
  <button className="pb-2 px-1 text-xs sm:text-sm text-gray-600 hover:text-primary whitespace-nowrap">
    Giá giảm dần
  </button>
</div>
```

**What to change:**
- Add `onClick` handlers to each button
- Dynamically apply active styles based on `sortBy` state
- Keep all other styling exactly the same

### Sort Parameter Mapping

| Tab Label | Sort Value | Backend Behavior |
|-----------|------------|------------------|
| Phổ biến | `popular` | Sort by completedOrders DESC |
| Giá tăng dần | `price_asc` | Sort by priceMin ASC |
| Giá giảm dần | `price_desc` | Sort by priceMax DESC |

### Implementation Pattern

**Add state:**
```typescript
const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular')
```

**Update useEffect:**
```typescript
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      
      const route = '/san-pham/email'
      const endpoint = getEndpointFromRoute(route)
      
      // Build query params
      const params: any = {
        sort: sortBy,  // Use sortBy state instead of hardcoded 'popular'
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
      setSubTypeCounts(response.filters.subTypeCounts)
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }
  
  fetchProducts()
}, [currentPage, selectedSubTypes, sortBy]) // Add sortBy to dependencies
```

**Add handler:**
```typescript
const handleSortChange = (newSort: 'popular' | 'price_asc' | 'price_desc') => {
  setSortBy(newSort)
  setCurrentPage(1) // Reset to page 1 when sort changes
}
```

**Update tabs:**
```tsx
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
```

### State Flow

1. **Initial load:**
   - `sortBy` defaults to 'popular'
   - API called with `sort=popular`
   - "Phổ biến" tab shows active state

2. **User clicks "Giá tăng dần":**
   - `handleSortChange('price_asc')` called
   - `setSortBy('price_asc')` updates state
   - `setCurrentPage(1)` resets pagination
   - useEffect triggers re-fetch with `sort=price_asc`
   - "Giá tăng dần" tab shows active state

3. **User clicks "Giá giảm dần":**
   - `handleSortChange('price_desc')` called
   - `setSortBy('price_desc')` updates state
   - `setCurrentPage(1)` resets pagination
   - useEffect triggers re-fetch with `sort=price_desc`
   - "Giá giảm dần" tab shows active state

4. **User clicks "Phổ biến" again:**
   - `handleSortChange('popular')` called
   - Back to default sort
   - Pagination resets to 1

### Active Tab Styling

**Active tab:**
- Text color: `text-primary`
- Border: `border-b-2 border-primary`
- Font weight: `font-medium`

**Inactive tab:**
- Text color: `text-gray-600`
- Hover: `hover:text-primary`
- No border
- Font weight: `font-medium`

### Edge Cases to Handle

1. **Sort + Filter combination:**
   - Both `sortBy` and `selectedSubTypes` in useEffect dependencies
   - API receives both `sort` and `subTypes` params
   - Works correctly together

2. **Sort + Pagination:**
   - When sort changes, reset to page 1
   - When page changes, keep current sort
   - Both in useEffect dependencies

3. **Multiple rapid clicks:**
   - State updates handle this naturally
   - Each click triggers re-fetch
   - Loading state prevents UI issues

### Testing Checklist

After implementation:

1. **Visual check:**
   - Tabs look identical to before
   - Active tab has primary color and bottom border
   - Inactive tabs are gray with hover effect

2. **Interaction check:**
   - Clicking each tab triggers API call
   - Active state updates correctly
   - Only one tab active at a time

3. **Data check:**
   - API called with correct `sort` param
   - Products re-order based on sort
   - Popular: High sold count first
   - Price asc: Low prices first
   - Price desc: High prices first

4. **State check:**
   - Pagination resets to 1 on sort change
   - Sort persists during pagination
   - Sort + filter work together

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Only add functionality
2. **Don't forget to reset pagination** - Always set page to 1 on sort change
3. **Don't forget useEffect dependency** - Add `sortBy` to dependency array
4. **Don't hardcode sort value** - Use `sortBy` state in API params
5. **Don't forget active styling** - Use conditional classes based on state
6. **Don't break existing filters** - Sort should work with filters

### Previous Story Context

**Story 2.2 completed:**
- FilterSidebar accepts dynamic subtype counts
- Email page has filter state management
- API called with `subTypes` param
- Status: review

**Story 2.1 completed:**
- Email listing page fetches from `/products/email`
- Products display with real data
- Loading and error states implemented
- Status: review

### Next Steps After This Story

Once Story 2.3 is complete:
- **Story 2.4** will connect pagination to API meta
- **Story 2.5** will implement favorite toggle with auth
- **Story 2.6** will enhance loading/empty/error states

### References

- [Email Listing Page]: `frontend/app/san-pham/email/page.tsx`
- [Story 2.1]: `docs/implementation-artifacts/2-1-integrate-email-listing-page-with-backend-api.md`
- [Story 2.2]: `docs/implementation-artifacts/2-2-connect-sidebar-filter-with-dynamic-subtype-counts.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.3
- [Backend API]: `backend/API_REFERENCE.md` - Sort parameters section

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- Sort tabs now functional with API integration
- Active state styling working correctly

### Completion Notes List

**Implementation Summary:**

1. **Email Listing Page Updated** (`frontend/app/san-pham/email/page.tsx`):
   - Added state: `sortBy` with type `'popular' | 'price_asc' | 'price_desc'`
   - Default value: `'popular'`
   - Updated useEffect to use `sortBy` state in API params
   - Changed from hardcoded `sort: 'popular'` to `sort: sortBy`
   - Added `sortBy` to useEffect dependencies array
   - Implemented `handleSortChange` function
   - Function accepts new sort value
   - Updates `sortBy` state
   - Resets `currentPage` to 1 when sort changes
   - Wired all 3 tabs to `handleSortChange` with onClick handlers
   - Updated tab styling with conditional classes based on `sortBy` state
   - Active tab: `text-primary border-b-2 border-primary`
   - Inactive tab: `text-gray-600 hover:text-primary`
   - UI layout completely preserved

2. **Sort Tab Mapping:**
   - "Phổ biến" → `handleSortChange('popular')` → API `sort=popular`
   - "Giá tăng dần" → `handleSortChange('price_asc')` → API `sort=price_asc`
   - "Giá giảm dần" → `handleSortChange('price_desc')` → API `sort=price_desc`

3. **State Flow:**
   - Initial: `sortBy='popular'`, "Phổ biến" tab active
   - User clicks "Giá tăng dần": `setSortBy('price_asc')`, `setCurrentPage(1)`, re-fetch
   - User clicks "Giá giảm dần": `setSortBy('price_desc')`, `setCurrentPage(1)`, re-fetch
   - User clicks "Phổ biến": `setSortBy('popular')`, `setCurrentPage(1)`, re-fetch

4. **Integration with Existing Features:**
   - Sort works with filters: Both `sortBy` and `selectedSubTypes` in useEffect deps
   - Sort works with pagination: Page resets to 1 on sort change, sort persists during pagination
   - API receives both `sort` and `subTypes` params when both active

**Key Decisions:**

- Used TypeScript union type for `sortBy` state for type safety
- Reset pagination to page 1 on every sort change (UX best practice)
- Used conditional template literals for dynamic class names
- Preserved all existing styling (font size, spacing, borders)
- Added `sortBy` to useEffect dependencies to trigger re-fetch

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- State management implemented correctly
- Conditional styling working
- onClick handlers wired correctly
- Pagination reset logic in place

**Next Steps:**

- Story 2.4: Connect pagination to API meta data
- Story 2.5: Implement favorite toggle with auth
- Story 2.6: Enhanced loading/empty/error states

### File List

- [x] `frontend/app/san-pham/email/page.tsx` - Added sort state and tab functionality
