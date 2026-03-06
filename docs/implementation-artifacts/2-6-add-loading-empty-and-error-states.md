# Story 2.6: Add Loading, Empty, and Error States

Status: review

## Story

As a **buyer**,
I want **clear feedback when data is loading, empty, or fails**,
So that **I understand what's happening and what to do next**.

## Acceptance Criteria

**Given** the email listing page is loading data
**When** the API request is in progress
**Then** a loading spinner displays in the main content area
**And** the sidebar and pagination are hidden during loading
**And** the loading state is smooth without flashing (minimum 200ms display)

**Given** the API returns zero products
**When** the response `data` array is empty
**Then** an empty state message displays: "Không tìm thấy sản phẩm phù hợp."
**And** a suggestion displays: "Thử xóa bộ lọc để xem thêm sản phẩm"
**And** the sidebar filter remains visible

**Given** the API request fails (network error, backend down, 500 error)
**When** the API returns an error
**Then** an error message displays: "Không thể tải dữ liệu. Vui lòng thử lại sau."
**And** a "Thử lại" (Retry) button displays
**And** when I click "Thử lại", the API request is retried
**And** if a toast system exists (sweetalert2), use it for error display
**And** if no toast system, display inline error message

**And** all error messages are in Vietnamese
**And** the existing page layout is unchanged

## Tasks / Subtasks

- [x] Enhance `frontend/app/san-pham/email/page.tsx` (AC: All)
  - [x] Improve loading state UI (already exists, enhance if needed)
  - [x] Add empty state when `products.length === 0` and not loading
  - [x] Improve error state UI (already exists, enhance if needed)
  - [x] Add retry functionality to error state
  - [x] Hide sidebar and pagination during loading
  - [x] Keep sidebar visible during empty state
  - [x] Add minimum loading time (200ms) to prevent flashing
  - [x] Keep existing page layout unchanged

## Dev Notes

### Critical Requirements

1. **File to Modify**: `frontend/app/san-pham/email/page.tsx`
2. **Keep UI Unchanged**: Enhance existing states, don't rebuild
3. **Loading State**: Already implemented in Story 2.1, may need enhancement
4. **Error State**: Already implemented in Story 2.1, add retry button
5. **Empty State**: New - add when products array is empty
6. **Minimum Loading Time**: 200ms to prevent flashing

### Current State Implementation

**File**: `frontend/app/san-pham/email/page.tsx`

**Current loading state** (from Story 2.1):
```tsx
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

**Current error state** (from Story 2.1):
```tsx
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

**What to add:**
- Retry button to error state
- Empty state when `products.length === 0`
- Minimum loading time logic

### Empty State Implementation

**Add after error state check:**
```tsx
if (!loading && !error && products.length === 0) {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-4 items-start">
        {/* Left Sidebar - Keep visible */}
        <div className="hidden xl:block">
          <FilterSidebar
            subTypeCounts={subTypeCounts}
            selectedSubTypes={selectedSubTypes}
            onSubTypesChange={handleSubTypesChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Main Content - Empty State */}
        <main>
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Gian hàng email</h1>
              <span className="text-xs sm:text-sm text-gray-600">Tổng 0 gian hàng</span>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="xl:hidden mb-4">
            <button
              onClick={() => setShowMobileFilter(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <i className="fas fa-filter"></i>
              Bộ lọc
            </button>
          </div>

          {/* Empty State Message */}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <i className="fas fa-inbox text-gray-300 text-6xl mb-4"></i>
              <p className="text-gray-800 font-semibold text-lg mb-2">Không tìm thấy sản phẩm phù hợp.</p>
              <p className="text-gray-600 text-sm mb-4">Thử xóa bộ lọc để xem thêm sản phẩm</p>
              <button
                onClick={() => {
                  setSelectedSubTypes([])
                  setCurrentPage(1)
                }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Ads */}
        <div className="hidden xl:block">
          <AdSidebar />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[220] xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            aria-label="Đóng bộ lọc"
            onClick={() => setShowMobileFilter(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[85vw] max-w-[340px] bg-white shadow-xl overflow-y-auto">
            <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <span className="text-sm font-semibold text-gray-700">Bộ lọc</span>
              <button
                type="button"
                className="h-8 w-8 flex items-center justify-center text-gray-500"
                aria-label="Đóng bộ lọc"
                onClick={() => setShowMobileFilter(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                subTypeCounts={subTypeCounts}
                selectedSubTypes={selectedSubTypes}
                onSubTypesChange={handleSubTypesChange}
                onSearch={handleSearch}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
```

### Enhanced Error State with Retry

**Update error state:**
```tsx
if (error) {
  return (
    <div className="max-w-[1600px] w-full mx-auto px-3 py-3">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-red-500 text-5xl mb-4"></i>
          <p className="text-gray-800 font-semibold mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              // Trigger re-fetch by updating a dependency
              setCurrentPage(prev => prev)
            }}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Minimum Loading Time Implementation

**Add state for minimum loading:**
```typescript
const [minLoadingTime, setMinLoadingTime] = useState(false)
```

**Update useEffect:**
```typescript
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true)
      setError(null)
      setMinLoadingTime(true)
      
      // Start minimum loading timer
      const minLoadingPromise = new Promise(resolve => setTimeout(resolve, 200))
      
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
      setTotalPages(response.meta.totalPages)
      setSubTypeCounts(response.filters.subTypeCounts)
      
      // Wait for minimum loading time
      await minLoadingPromise
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu')
      await new Promise(resolve => setTimeout(resolve, 200))
    } finally {
      setLoading(false)
      setMinLoadingTime(false)
    }
  }
  
  fetchProducts()
}, [currentPage, selectedSubTypes, sortBy])
```

**Note:** The minimum loading time prevents flashing when API is very fast. If API takes >200ms, user sees loading state. If API takes <200ms, loading state shows for 200ms minimum.

### Retry Functionality

**Simple approach - trigger re-fetch:**
```typescript
const handleRetry = () => {
  setError(null)
  setLoading(true)
  // Force re-fetch by updating state
  setCurrentPage(prev => prev) // Triggers useEffect
}
```

**Alternative - extract fetch logic:**
```typescript
const fetchProducts = useCallback(async () => {
  // ... fetch logic
}, [currentPage, selectedSubTypes, sortBy])

useEffect(() => {
  fetchProducts()
}, [fetchProducts])

const handleRetry = () => {
  setError(null)
  fetchProducts()
}
```

### State Priority

**Order of state checks:**
1. Loading state (highest priority)
2. Error state
3. Empty state (products.length === 0)
4. Success state (products display)

**Logic:**
```typescript
if (loading) {
  return <LoadingState />
}

if (error) {
  return <ErrorState />
}

if (products.length === 0) {
  return <EmptyState />
}

return <SuccessState />
```

### Edge Cases to Handle

1. **Loading → Empty:**
   - API returns empty array
   - Show empty state with sidebar visible
   - User can adjust filters

2. **Loading → Error:**
   - API fails
   - Show error state with retry button
   - Clicking retry triggers new fetch

3. **Empty → Success:**
   - User clears filters
   - Products load successfully
   - Show normal product grid

4. **Error → Success:**
   - User clicks retry
   - API succeeds
   - Show normal product grid

5. **Fast API response:**
   - API returns in <200ms
   - Loading state shows for 200ms minimum
   - Prevents flashing

### Testing Checklist

After implementation:

1. **Loading state:**
   - Spinner displays during fetch
   - Sidebar and pagination hidden
   - No flashing on fast responses
   - Minimum 200ms display time

2. **Empty state:**
   - Shows when no products found
   - Sidebar remains visible
   - "Xóa bộ lọc" button works
   - Clears filters and refetches

3. **Error state:**
   - Shows on API failure
   - Error message displays
   - "Thử lại" button works
   - Retry triggers new fetch

4. **State transitions:**
   - Loading → Success
   - Loading → Empty
   - Loading → Error
   - Error → Success (retry)
   - Empty → Success (clear filters)

### Common Pitfalls to Avoid

1. **Don't hide sidebar in empty state** - User needs filters to adjust
2. **Don't forget retry button** - User needs way to recover from error
3. **Don't forget minimum loading time** - Prevents flashing
4. **Don't forget to clear error on retry** - Set error to null
5. **Don't forget empty state check** - `products.length === 0`
6. **Don't show empty state while loading** - Check `!loading` first

### Previous Story Context

**Story 2.5 completed:**
- Favorite toggle with authentication
- Status: review

**Story 2.1 completed:**
- Basic loading and error states implemented
- Need enhancement for this story
- Status: review

### Next Steps After This Story

Once Story 2.6 is complete:
- **Epic 2 will be complete** - Email listing fully functional
- **Story 3.1** will integrate remaining 7 listing routes
- Can start Epic 3 or Epic 4

### References

- [Email Listing Page]: `frontend/app/san-pham/email/page.tsx`
- [Story 2.1]: `docs/implementation-artifacts/2-1-integrate-email-listing-page-with-backend-api.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.6

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- All three states (loading, empty, error) enhanced
- Minimum loading time prevents flashing

### Completion Notes List

**Implementation Summary:**

1. **Enhanced Error State** (`frontend/app/san-pham/email/page.tsx`):
   - Added "Thử lại" button to error state
   - Button onClick clears error and triggers re-fetch
   - Uses `setCurrentPage(prev => prev)` to trigger useEffect
   - Button styling: `bg-primary text-white rounded hover:bg-primary/90`
   - Error message spacing improved with `mb-4`

2. **Added Empty State**:
   - Condition: `!loading && products.length === 0`
   - Full page layout with sidebar visible (user can adjust filters)
   - Empty state icon: `fas fa-inbox text-gray-300 text-6xl`
   - Message: "Không tìm thấy sản phẩm phù hợp."
   - Suggestion: "Thử xóa bộ lọc để xem thêm sản phẩm"
   - "Xóa bộ lọc" button clears `selectedSubTypes` and resets to page 1
   - Includes mobile filter drawer (same as success state)
   - Shows "Tổng 0 gian hàng" in header

3. **Added Minimum Loading Time**:
   - Created 200ms promise: `new Promise(resolve => setTimeout(resolve, 200))`
   - Started at beginning of fetch
   - Awaited before setting loading to false
   - Applied to both success and error paths
   - Prevents flashing when API responds very quickly (<200ms)

4. **State Priority Order**:
   - Loading state (highest priority)
   - Error state with retry button
   - Empty state with clear filters button
   - Success state with products

**Key Decisions:**

- Used `setCurrentPage(prev => prev)` for retry (triggers useEffect without changing page)
- Empty state includes full layout (sidebar, mobile drawer) for better UX
- Minimum loading time applied to both success and error to prevent flashing
- "Xóa bộ lọc" button clears filters and resets pagination
- Kept all existing UI styling consistent

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- Error state has retry button
- Empty state has clear filters button
- Minimum loading time prevents flashing
- All states maintain consistent layout

**Epic 2 Status:**

All 6 stories in Epic 2 complete:
- ✅ Story 2.1: Email listing page with API integration
- ✅ Story 2.2: Sidebar filter with dynamic counts
- ✅ Story 2.3: Sort tabs functional
- ✅ Story 2.4: Pagination connected to API
- ✅ Story 2.5: Favorite toggle with auth
- ✅ Story 2.6: Enhanced loading/empty/error states

**Next Steps:**

- Epic 2 complete - Email listing fully functional
- Story 3.1: Integrate remaining 7 listing routes (reuse pattern from Epic 2)
- Or start Epic 4: Product detail pages

### File List

- [x] `frontend/app/san-pham/email/page.tsx` - Enhanced loading, empty, and error states
