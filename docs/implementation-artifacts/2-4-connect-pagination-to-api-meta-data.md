# Story 2.4: Connect Pagination to API Meta Data

Status: review

## Story

As a **buyer**,
I want **to navigate through multiple pages of products**,
So that **I can browse all available products beyond the first page**.

## Acceptance Criteria

**Given** the email listing page has more than 12 products
**When** the API response includes `meta` with page, limit, total, totalPages
**Then** the Pagination component displays with correct total pages
**And** the current page number is highlighted
**And** when I click "Next" button, the page calls API with `page=2`
**And** when I click "Previous" button, the page calls API with `page=1`
**And** when I click a specific page number, the page calls API with that page number
**And** the page state syncs with API calls
**And** the total count displays correctly (e.g., "Tổng 816 gian hàng")
**And** the existing pagination UI layout is unchanged

## Tasks / Subtasks

- [x] Update `frontend/app/san-pham/email/page.tsx` (AC: All)
  - [x] Calculate `totalPages` from API meta
  - [x] Pass `totalPages` to Pagination component
  - [x] Verify `currentPage` state already wired to Pagination
  - [x] Verify `setCurrentPage` callback already wired to Pagination
  - [x] Verify useEffect already has `currentPage` dependency
  - [x] Update total count display to use `totalCount` state
  - [x] Keep existing pagination UI layout unchanged

## Dev Notes

### Critical Requirements

1. **File to Modify**: `frontend/app/san-pham/email/page.tsx`
2. **Keep UI Unchanged**: Pagination already exists, just wire to API data
3. **Calculate Total Pages**: Use `response.meta.totalPages` from API
4. **Current Implementation**: Most pagination logic already in place from Story 2.1

### Current Pagination Structure

**File**: `frontend/app/san-pham/email/page.tsx`

**Current implementation:**
```tsx
const [currentPage, setCurrentPage] = useState(1)

// In JSX:
<Pagination
  currentPage={currentPage}
  totalPages={3}  // HARDCODED - needs to be dynamic
  onPageChange={setCurrentPage}
/>
```

**What to change:**
- Replace hardcoded `totalPages={3}` with dynamic value from API meta
- Everything else already works correctly

### API Meta Structure

**ProductListResponse.meta** (from Story 1.1):
```typescript
{
  page: number,        // Current page (1-indexed)
  limit: number,       // Items per page (12)
  total: number,       // Total items (e.g., 816)
  totalPages: number   // Total pages (e.g., 68)
}
```

### Implementation Pattern

**Add state for totalPages:**
```typescript
const [totalPages, setTotalPages] = useState(1)
```

**Update useEffect to set totalPages:**
```typescript
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      
      const route = '/san-pham/email'
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
      setTotalPages(response.meta.totalPages)  // Add this line
      setSubTypeCounts(response.filters.subTypeCounts)
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }
  
  fetchProducts()
}, [currentPage, selectedSubTypes, sortBy])
```

**Update Pagination component:**
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}  // Use state instead of hardcoded 3
  onPageChange={setCurrentPage}
/>
```

**Total count display (already correct):**
```tsx
<span className="text-xs sm:text-sm text-gray-600">
  Tổng {totalCount.toLocaleString()} gian hàng
</span>
```

### State Flow

1. **Initial load:**
   - `currentPage` = 1
   - API called with `page=1`
   - Response includes `meta.totalPages` (e.g., 68)
   - `setTotalPages(68)` updates state
   - Pagination component shows 68 pages

2. **User clicks "Next":**
   - Pagination calls `onPageChange(2)`
   - `setCurrentPage(2)` updates state
   - useEffect triggers re-fetch with `page=2`
   - Products update to page 2

3. **User clicks page number (e.g., 5):**
   - Pagination calls `onPageChange(5)`
   - `setCurrentPage(5)` updates state
   - useEffect triggers re-fetch with `page=5`
   - Products update to page 5

4. **User clicks "Previous":**
   - Pagination calls `onPageChange(4)`
   - `setCurrentPage(4)` updates state
   - useEffect triggers re-fetch with `page=4`
   - Products update to page 4

5. **User changes filter or sort:**
   - `handleSearch()` or `handleSortChange()` calls `setCurrentPage(1)`
   - Pagination resets to page 1
   - New API call with `page=1`
   - `totalPages` may change based on filtered results

### Pagination Component Props

**Expected props** (from `frontend/components/ui/Pagination.tsx`):
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
```

**Already wired correctly:**
- `currentPage` state passed to component
- `setCurrentPage` callback passed as `onPageChange`
- `currentPage` in useEffect dependencies

**Only missing:**
- Dynamic `totalPages` from API meta

### Total Count Display

**Current implementation (already correct):**
```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng email</h1>
  <span className="text-xs sm:text-sm text-gray-600">
    Tổng {totalCount.toLocaleString()} gian hàng
  </span>
</div>
```

**What it does:**
- Uses `totalCount` state (set from `response.meta.total`)
- Formats with `toLocaleString()` for thousand separators
- Displays "Tổng 816 gian hàng" (example)

**No changes needed** - already implemented in Story 2.1

### Edge Cases to Handle

1. **Empty results:**
   - `totalPages` = 0 or 1
   - Pagination component should handle gracefully
   - May hide pagination if only 1 page

2. **Filter reduces pages:**
   - User on page 5, applies filter
   - Filtered results only have 2 pages
   - Should reset to page 1 (already handled by `handleSearch`)

3. **Last page:**
   - User on last page (e.g., page 68)
   - "Next" button should be disabled
   - Pagination component handles this

4. **First page:**
   - User on page 1
   - "Previous" button should be disabled
   - Pagination component handles this

### Testing Checklist

After implementation:

1. **Visual check:**
   - Pagination displays at bottom of page
   - Current page highlighted
   - Total pages shown correctly

2. **Interaction check:**
   - Clicking "Next" loads next page
   - Clicking "Previous" loads previous page
   - Clicking page number loads that page
   - Current page updates in UI

3. **Data check:**
   - API called with correct `page` param
   - Products update for each page
   - Total count displays correctly
   - Total pages calculated correctly

4. **State check:**
   - `currentPage` syncs with API calls
   - `totalPages` updates from API meta
   - Pagination resets to 1 on filter/sort change

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Pagination already exists
2. **Don't forget to set totalPages** - Add to useEffect
3. **Don't hardcode totalPages** - Use API meta value
4. **Don't forget state initialization** - Default to 1
5. **Don't break existing pagination logic** - Only add totalPages

### Previous Story Context

**Story 2.3 completed:**
- Sort tabs functional with API integration
- Pagination resets to 1 on sort change
- Status: review

**Story 2.2 completed:**
- FilterSidebar accepts dynamic subtype counts
- Pagination resets to 1 on search
- Status: review

**Story 2.1 completed:**
- Email listing page fetches from `/products/email`
- `currentPage` state and `setCurrentPage` already implemented
- `totalCount` state already implemented
- useEffect already has `currentPage` dependency
- Status: review

### Next Steps After This Story

Once Story 2.4 is complete:
- **Story 2.5** will implement favorite toggle with auth
- **Story 2.6** will enhance loading/empty/error states

### References

- [Email Listing Page]: `frontend/app/san-pham/email/page.tsx`
- [Pagination Component]: `frontend/components/ui/Pagination.tsx`
- [Story 2.1]: `docs/implementation-artifacts/2-1-integrate-email-listing-page-with-backend-api.md`
- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.4

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- Pagination now fully connected to API meta data
- Dynamic totalPages from API response

### Completion Notes List

**Implementation Summary:**

1. **Email Listing Page Updated** (`frontend/app/san-pham/email/page.tsx`):
   - Added state: `totalPages` with default value 1
   - Updated useEffect to set `totalPages` from `response.meta.totalPages`
   - Updated Pagination component to use `totalPages` state instead of hardcoded 3
   - Verified existing pagination logic already correct:
     * `currentPage` state already exists (from Story 2.1)
     * `setCurrentPage` already wired to Pagination as `onPageChange`
     * `currentPage` already in useEffect dependencies
     * Total count display already using `totalCount` state
   - UI layout completely preserved

2. **Pagination Flow:**
   - Initial load: API returns `meta.totalPages` → `setTotalPages()` → Pagination shows correct total
   - User clicks page: Pagination calls `onPageChange(n)` → `setCurrentPage(n)` → useEffect re-fetches
   - Filter/sort change: `setCurrentPage(1)` resets → Pagination updates → New `totalPages` from API

3. **Integration with Existing Features:**
   - Works with filters: Filtered results may have different `totalPages`
   - Works with sort: Sorted results maintain same `totalPages`
   - Resets correctly: Filter/sort changes reset to page 1, then get new `totalPages`

**Key Decisions:**

- Default `totalPages` to 1 (safe default for empty/error states)
- Set `totalPages` from `response.meta.totalPages` directly (no calculation needed)
- Kept all existing pagination logic unchanged (already working from Story 2.1)
- Total count display already correct (using `totalCount.toLocaleString()`)

**Verification:**

- ✅ `currentPage` state exists and wired to Pagination
- ✅ `setCurrentPage` callback wired as `onPageChange`
- ✅ `currentPage` in useEffect dependencies
- ✅ Total count display using `totalCount` state with formatting
- ✅ Only change needed: Add `totalPages` state and wire to Pagination

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- State management implemented correctly
- Pagination component receives dynamic totalPages
- All existing pagination logic preserved

**Next Steps:**

- Story 2.5: Implement favorite toggle with authentication
- Story 2.6: Enhanced loading/empty/error states

### File List

- [x] `frontend/app/san-pham/email/page.tsx` - Added totalPages state and wired to Pagination
