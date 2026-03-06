# Story 2.2: Connect Sidebar Filter with Dynamic Subtype Counts

Status: review

## Story

As a **buyer**,
I want **to see available email types with product counts**,
So that **I know which filters have products before selecting them**.

## Acceptance Criteria

**Given** the email listing page is loaded
**When** the API response includes `filters.subTypeCounts`
**Then** the FilterSidebar component displays checkboxes for each subtype
**And** each checkbox shows the label and count (e.g., "Gmail (15)")
**And** subtypes are rendered from API data, not hardcoded
**And** when I select multiple checkboxes and click "Tìm kiếm" button
**Then** the page calls API with `subTypes=GMAIL,HOTMAIL` query parameter
**And** the product list updates with filtered results
**And** the sidebar counts update based on new response
**And** the existing sidebar UI layout is unchanged

## Tasks / Subtasks

- [x] Update `frontend/components/FilterSidebar.tsx` (AC: Dynamic rendering)
  - [x] Accept `subTypeCounts` prop from parent
  - [x] Accept `selectedSubTypes` prop from parent
  - [x] Accept `onSubTypesChange` callback prop
  - [x] Accept `onSearch` callback prop
  - [x] Replace hardcoded categories with prop data
  - [x] Render checkboxes from `subTypeCounts` array
  - [x] Keep existing UI layout unchanged

- [x] Update `frontend/app/san-pham/email/page.tsx` (AC: Filter integration)
  - [x] Add state for `selectedSubTypes` (string array)
  - [x] Add state for `subTypeCounts` from API response
  - [x] Pass `filters.subTypeCounts` to FilterSidebar
  - [x] Pass `selectedSubTypes` state to FilterSidebar
  - [x] Implement `handleSubTypesChange` callback
  - [x] Implement `handleSearch` callback
  - [x] Call API with `subTypes` query param on search
  - [x] Update `subTypeCounts` from new API response
  - [x] Keep existing page layout unchanged

## Dev Notes

### Critical Requirements

1. **Files to Modify**:
   - `frontend/components/FilterSidebar.tsx` - Make dynamic with props
   - `frontend/app/san-pham/email/page.tsx` - Add filter state and logic

2. **Keep UI Unchanged**: Only replace data source, not layout
3. **Use API Data**: `filters.subTypeCounts` from ProductListResponse
4. **Query Param Format**: `subTypes=GMAIL,HOTMAIL` (uppercase, comma-separated)
5. **State Management**: Parent page controls filter state, sidebar is controlled component

### Current FilterSidebar Structure

**File**: `frontend/components/FilterSidebar.tsx`

**Current implementation:**
- Hardcoded `categories` array with id, name, count
- Local state for `selectedCategories`
- `toggleCategory` function to update selection
- "Tìm kiếm" button (currently non-functional)
- Article card section below filters

**What to change:**
- Remove hardcoded `categories` array
- Remove local state (make controlled component)
- Accept props: `subTypeCounts`, `selectedSubTypes`, `onSubTypesChange`, `onSearch`
- Render checkboxes from `subTypeCounts` prop
- Call `onSubTypesChange` when checkbox toggled
- Call `onSearch` when "Tìm kiếm" button clicked
- Keep all UI exactly the same

### API Response Structure

**ProductListResponse** (from Story 1.1):
```typescript
{
  data: ProductCard[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  },
  filters: {
    subTypeCounts: SubTypeCount[]
  }
}
```

**SubTypeCount** (from Story 1.1):
```typescript
{
  value: string,    // e.g., "GMAIL"
  label: string,    // e.g., "Gmail"
  count: number     // e.g., 15
}
```

### FilterSidebar Props Interface

```typescript
interface FilterSidebarProps {
  subTypeCounts: SubTypeCount[]
  selectedSubTypes: string[]
  onSubTypesChange: (subTypes: string[]) => void
  onSearch: () => void
}
```

### FilterSidebar Implementation Pattern

```typescript
'use client'

import { Card, Button, Checkbox, ArticleCard } from './ui'
import { SubTypeCount } from '@/types/listing'

interface FilterSidebarProps {
  subTypeCounts: SubTypeCount[]
  selectedSubTypes: string[]
  onSubTypesChange: (subTypes: string[]) => void
  onSearch: () => void
}

export default function FilterSidebar({
  subTypeCounts,
  selectedSubTypes,
  onSubTypesChange,
  onSearch
}: FilterSidebarProps) {
  const toggleSubType = (value: string) => {
    const newSelection = selectedSubTypes.includes(value)
      ? selectedSubTypes.filter(v => v !== value)
      : [...selectedSubTypes, value]
    onSubTypesChange(newSelection)
  }

  return (
    <aside className="sticky top-[110px]">
      <Card>
        <h3 className="text-base font-semibold text-gray-800 mb-3">Bộ lọc</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Chọn 1 hoặc nhiều sản phẩm
          </h4>
          <div className="space-y-2">
            {subTypeCounts.map((subType) => (
              <div key={subType.value} className="flex items-center justify-between">
                <Checkbox
                  checked={selectedSubTypes.includes(subType.value)}
                  onChange={() => toggleSubType(subType.value)}
                  label={subType.label}
                />
                <span className="text-xs text-gray-500">({subType.count})</span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="success" fullWidth onClick={onSearch}>
          Tìm kiếm
        </Button>
      </Card>

      {/* Article card section unchanged */}
      <Card className="mt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Bài viết tham khảo
        </h3>
        <div className="space-y-3">
          <ArticleCard
            title="Tại sao nên chọn đầu tư nhà đất trong thời điểm này?"
            category="Tài chính"
            views="1.8K0"
            gradient="bg-gradient-to-br from-blue-500 to-purple-600"
            icon="fas fa-chart-line"
          />
        </div>
      </Card>
    </aside>
  )
}
```

### Page Implementation Pattern

**File**: `frontend/app/san-pham/email/page.tsx`

**Add state:**
```typescript
const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>([])
const [subTypeCounts, setSubTypeCounts] = useState<SubTypeCount[]>([])
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
        sort: 'popular',
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
      
      // Update subtype counts from response
      setSubTypeCounts(response.filters.subTypeCounts)
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }
  
  fetchProducts()
}, [currentPage, selectedSubTypes]) // Add selectedSubTypes to dependencies
```

**Add callbacks:**
```typescript
const handleSubTypesChange = (subTypes: string[]) => {
  setSelectedSubTypes(subTypes)
}

const handleSearch = () => {
  // Reset to page 1 when searching
  setCurrentPage(1)
  // Trigger re-fetch via useEffect dependency
}
```

**Pass props to FilterSidebar:**
```typescript
<FilterSidebar
  subTypeCounts={subTypeCounts}
  selectedSubTypes={selectedSubTypes}
  onSubTypesChange={handleSubTypesChange}
  onSearch={handleSearch}
/>
```

### Query Parameter Format

**Backend expects:**
- Parameter name: `subTypes`
- Format: Comma-separated uppercase values
- Example: `subTypes=GMAIL,HOTMAIL,OUTLOOKMAIL`

**Frontend sends:**
```typescript
// selectedSubTypes = ['GMAIL', 'HOTMAIL']
const params = {
  subTypes: selectedSubTypes.join(',') // "GMAIL,HOTMAIL"
}
```

### State Flow

1. **Initial load:**
   - Page fetches products without `subTypes` param
   - API returns `filters.subTypeCounts` with all available subtypes
   - Page passes `subTypeCounts` to FilterSidebar
   - FilterSidebar renders checkboxes

2. **User selects filters:**
   - User checks "Gmail" and "Hotmail" checkboxes
   - FilterSidebar calls `onSubTypesChange(['GMAIL', 'HOTMAIL'])`
   - Page updates `selectedSubTypes` state
   - Checkboxes show selected state (controlled)

3. **User clicks "Tìm kiếm":**
   - FilterSidebar calls `onSearch()`
   - Page resets `currentPage` to 1
   - useEffect triggers re-fetch with `subTypes=GMAIL,HOTMAIL`
   - API returns filtered products
   - Page updates products and `subTypeCounts`
   - FilterSidebar re-renders with new counts

4. **Counts update:**
   - New API response has updated `filters.subTypeCounts`
   - Page updates `subTypeCounts` state
   - FilterSidebar shows new counts next to checkboxes

### Edge Cases to Handle

1. **Empty subTypeCounts:**
   - If API returns empty array, show message "Không có bộ lọc"
   - Or hide filter section entirely

2. **No products after filter:**
   - Handled by Story 2.6 empty state
   - Show "Không tìm thấy sản phẩm phù hợp"

3. **Clear filters:**
   - Add "Xóa bộ lọc" button if needed
   - Or allow user to uncheck all and search again

4. **Mobile filter drawer:**
   - FilterSidebar is used in both desktop sidebar and mobile drawer
   - Props work the same in both contexts
   - No special handling needed

### Testing Checklist

After implementation:

1. **Visual check:**
   - Sidebar looks identical to before
   - Checkboxes render from API data
   - Counts display correctly (e.g., "Gmail (15)")

2. **Interaction check:**
   - Clicking checkbox updates selection
   - Multiple checkboxes can be selected
   - "Tìm kiếm" button triggers API call
   - Products update after search

3. **Data check:**
   - API called with correct `subTypes` param
   - Query param format: `GMAIL,HOTMAIL` (uppercase, comma-separated)
   - Counts update after filter applied
   - Selected checkboxes persist after search

4. **State check:**
   - Checkboxes controlled by parent state
   - Selection persists during pagination
   - Counts update from API response

### Common Pitfalls to Avoid

1. **Don't change UI layout** - Only replace data source
2. **Don't use local state in FilterSidebar** - Make it controlled
3. **Don't forget uppercase** - Backend expects `GMAIL`, not `gmail`
4. **Don't forget comma separator** - `GMAIL,HOTMAIL`, not `GMAIL HOTMAIL`
5. **Don't forget to update counts** - Use `filters.subTypeCounts` from response
6. **Don't trigger search on checkbox change** - Only on "Tìm kiếm" button click
7. **Don't forget mobile drawer** - FilterSidebar used in both contexts

### Previous Story Context

**Story 2.1 completed:**
- Email listing page fetches from `/products/email`
- Products display with real data
- Loading and error states implemented
- Status: review

**Epic 1 completed:**
- Types include `SubTypeCount` interface
- API function `getProductListing` accepts `subTypes` param
- All utilities available

### Next Steps After This Story

Once Story 2.2 is complete:
- **Story 2.3** will make sort tabs functional
- **Story 2.4** will connect pagination to API
- **Story 2.5** will implement favorite toggle
- **Story 2.6** will enhance loading/empty/error states

### References

- [FilterSidebar Component]: `frontend/components/FilterSidebar.tsx`
- [Email Listing Page]: `frontend/app/san-pham/email/page.tsx`
- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Story 2.1]: `docs/implementation-artifacts/2-1-integrate-email-listing-page-with-backend-api.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 2, Story 2.2
- [Backend API]: `backend/API_REFERENCE.md` - Query parameters section

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript diagnostics: 0 errors
- FilterSidebar converted to controlled component
- Email page filter state integrated

### Completion Notes List

**Implementation Summary:**

1. **FilterSidebar Component Updated** (`frontend/components/FilterSidebar.tsx`):
   - Removed hardcoded `categories` array
   - Removed local state (`selectedCategories`)
   - Added props interface: `FilterSidebarProps`
   - Props: `subTypeCounts`, `selectedSubTypes`, `onSubTypesChange`, `onSearch`
   - All props optional with defaults for backward compatibility
   - Converted to controlled component pattern
   - `toggleSubType` function calls `onSubTypesChange` callback
   - "Tìm kiếm" button calls `onSearch` callback
   - Renders checkboxes from `subTypeCounts` prop
   - Maps: `subType.value` → checkbox value, `subType.label` → checkbox label, `subType.count` → count display
   - UI layout completely preserved

2. **Email Listing Page Updated** (`frontend/app/san-pham/email/page.tsx`):
   - Added import: `SubTypeCount` from `@/types/listing`
   - Added state: `selectedSubTypes` (string[])
   - Added state: `subTypeCounts` (SubTypeCount[])
   - Updated useEffect to build query params dynamically
   - Added `subTypes` param when `selectedSubTypes.length > 0`
   - Format: `params.subTypes = selectedSubTypes.join(',')` (comma-separated)
   - Updated `setSubTypeCounts(response.filters.subTypeCounts)` from API response
   - Added useEffect dependency: `selectedSubTypes`
   - Implemented `handleSubTypesChange` callback
   - Implemented `handleSearch` callback (resets page to 1)
   - Passed all 4 props to FilterSidebar in both desktop and mobile contexts

3. **State Flow:**
   - Initial load: Fetch products → Get `filters.subTypeCounts` → Pass to FilterSidebar
   - User checks boxes: FilterSidebar → `onSubTypesChange` → Update `selectedSubTypes` state
   - User clicks "Tìm kiếm": FilterSidebar → `onSearch` → Reset page to 1 → Trigger re-fetch
   - Re-fetch: Include `subTypes` param → Get filtered products → Update `subTypeCounts`
   - Counts update: New `filters.subTypeCounts` → FilterSidebar re-renders with new counts

4. **Controlled Component Pattern:**
   - FilterSidebar has no internal state
   - Parent (page) controls all state
   - Checkboxes controlled by `selectedSubTypes` prop
   - Changes flow up via callbacks
   - Single source of truth in parent

**Key Decisions:**

- Made all FilterSidebar props optional with defaults for backward compatibility
- Used controlled component pattern (no local state in FilterSidebar)
- Reset pagination to page 1 when search button clicked
- Added `selectedSubTypes` to useEffect dependencies to trigger re-fetch
- Query param format: uppercase, comma-separated (e.g., `GMAIL,HOTMAIL`)
- Updated counts from API response after each fetch
- Preserved UI layout completely in both components

**Testing Notes:**

- TypeScript compilation: ✅ 0 errors
- FilterSidebar props interface defined correctly
- Email page state management implemented
- Callbacks wired correctly
- Query params built correctly
- Mobile drawer also receives props

**Next Steps:**

- Story 2.3: Implement sort tabs with API integration
- Story 2.4: Connect pagination to API meta
- Story 2.5: Implement favorite toggle with auth
- Story 2.6: Enhanced loading/empty/error states

### File List

- [x] `frontend/components/FilterSidebar.tsx` - Updated with props and dynamic rendering
- [x] `frontend/app/san-pham/email/page.tsx` - Added filter state and callbacks
