# PRD: Frontend Listing Integration with Backend APIs

**Product Manager:** John (BMAD PM Agent)  
**Created:** 2026-03-06  
**Status:** Draft  
**Priority:** High  

---

## Executive Summary

Connect existing frontend listing pages (8 routes: 4 products + 4 services) to the backend listing APIs. The backend is fully implemented and tested. Frontend UI is complete with static data. This PRD focuses ONLY on data integration - no UI redesign, no new features, just wire up the pipes.

**Success Metric:** All 8 listing routes display real backend data with working filters, sort, pagination, and favorites.

---

## Problem Statement

### Current State
- Frontend has 8 listing pages with hardcoded mock data (`data/products.ts`)
- Backend has 8 working API endpoints with real data
- Users see fake data, can't filter/sort/favorite properly
- No connection between frontend and backend

### Desired State
- Frontend fetches real data from backend APIs
- Sidebar filters work with actual subtype counts
- Sort tabs trigger API calls with correct params
- Pagination reflects real data counts
- Favorite toggle persists to backend
- Product detail links use real slugs

### Why Now?
Based on your backend docs, the API is production-ready and tested. Frontend UI is complete. This is the final integration step before launch. No dependencies blocking us.

---

## User Stories

### As a buyer browsing products:
1. I want to see real products with accurate stock/pricing so I can make purchase decisions
2. I want to filter by email type (Gmail, Hotmail, etc.) so I can find what I need
3. I want to sort by price/popularity so I can compare options
4. I want to favorite products so I can save them for later
5. I want to click a product and see its detail page

### As a developer:
1. I want clean API layer separation so code is maintainable
2. I want TypeScript types matching backend responses so I catch errors early
3. I want reusable hooks/utilities so I don't repeat code across 8 routes

---

## Scope

### ✅ In Scope
1. **API Integration Layer**
   - Create service functions for listing/detail/favorite APIs
   - Handle auth tokens for favorite endpoints
   - Error handling and loading states

2. **Route-to-Endpoint Mapping**
   - Map 8 frontend routes to 8 backend endpoints
   - Centralized mapping utility (no if/else scattered everywhere)

3. **Filter Integration**
   - Connect sidebar checkboxes to `filters.subTypeCounts` from API
   - Send selected subtypes as query params on search button click
   - Display counts next to each checkbox

4. **Sort Integration**
   - Connect 3 sort tabs to API sort params (popular, price_asc, price_desc)
   - Active tab triggers API call
   - Reset to page 1 on sort change

5. **Product Card Data Mapping**
   - Map API response fields to existing ProductCard component props
   - No layout changes to ProductCard

6. **Pagination**
   - Connect existing Pagination component to API meta (page, totalPages, total)
   - Sync page state with API calls

7. **Favorite Toggle**
   - Wire heart icon to POST /products/:id/favorite
   - Handle unauthenticated state (show login modal/redirect)
   - Optimistic UI update with rollback on error

8. **Product Detail Navigation**
   - Use slug from API for detail page links
   - Update routing if needed to support slug-based URLs

9. **Loading/Empty/Error States**
   - Show loading spinner during API calls
   - Show empty state when no products found
   - Show error message on API failure

10. **TypeScript Types**
    - Define interfaces matching backend response structure
    - Type all API functions and component props

### ❌ Out of Scope
- UI redesign or layout changes
- New filter types (price range, rating, seller name)
- Full-text search
- Advanced features not in current UI
- Backend changes
- Authentication system changes (use existing)
- Performance optimization (caching, etc.) - can add later if needed

---

## Technical Requirements

### API Endpoints to Integrate

#### Product Listing (4 routes)
```
GET /products/email
GET /products/software
GET /products/account
GET /products/other
```

#### Service Listing (4 routes)
```
GET /services/engagement
GET /services/software
GET /services/blockchain
GET /services/other
```

#### Product Detail
```
GET /products/slug/:slug
```

#### Favorites (Auth Required)
```
POST /products/:id/favorite
GET /users/me/favorites
```

### Query Parameters
- `subTypes`: Comma-separated (e.g., "GMAIL,HOTMAIL")
- `sort`: "popular" | "price_asc" | "price_desc"
- `page`: number (default: 1)
- `limit`: number (default: 12)

### Response Format (from backend docs)
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
    subTypeCounts: Array<{
      value: string,  // e.g., "GMAIL"
      label: string,  // e.g., "Gmail"
      count: number   // e.g., 15
    }>
  }
}
```

### ProductCard Type (from backend docs)
```typescript
{
  id: string,
  slug: string,
  title: string,
  image: string,
  badgeText: string,
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

---

## Implementation Plan

### Phase 1: Foundation (API Layer + Types)
**Goal:** Set up clean API infrastructure

**Tasks:**
1. Create TypeScript interfaces for all API responses
2. Create API service layer (`lib/api/listing.ts`)
3. Create route-to-endpoint mapping utility
4. Create format utilities (VND currency, numbers)
5. Test API calls with Postman/cURL to verify backend works

**Files to Create:**
- `frontend/types/listing.ts` - TypeScript interfaces
- `frontend/lib/api/listing.ts` - API service functions
- `frontend/lib/utils/routeMapping.ts` - Route to endpoint mapper
- `frontend/lib/utils/format.ts` - Number/currency formatters

**Acceptance Criteria:**
- [ ] All TypeScript types defined
- [ ] API service functions created and typed
- [ ] Route mapping utility works for all 8 routes
- [ ] Format utilities handle VND currency correctly

---

### Phase 2: Single Route Integration (Email Products)
**Goal:** Fully integrate ONE route end-to-end as proof of concept

**Tasks:**
1. Update `/san-pham/email/page.tsx` to use API
2. Implement filter sidebar with real subtype counts
3. Implement sort tabs with API calls
4. Implement pagination with real meta data
5. Implement favorite toggle (with auth check)
6. Add loading/empty/error states
7. Test thoroughly

**Files to Modify:**
- `frontend/app/san-pham/email/page.tsx`
- `frontend/components/FilterSidebar.tsx` (make it accept dynamic data)

**Acceptance Criteria:**
- [ ] Email page loads real data from backend
- [ ] Sidebar shows correct subtypes with counts
- [ ] Clicking checkboxes + search button filters products
- [ ] Sort tabs change product order
- [ ] Pagination works with real page counts
- [ ] Favorite toggle works (with auth)
- [ ] Loading spinner shows during fetch
- [ ] Empty state shows when no products
- [ ] Error message shows on API failure

---

### Phase 3: Replicate to All Routes
**Goal:** Apply the pattern from Phase 2 to remaining 7 routes

**Tasks:**
1. Update remaining 3 product routes (software, account, other)
2. Update 4 service routes (engagement, software, blockchain, other)
3. Ensure consistent behavior across all routes
4. Test each route

**Files to Modify:**
- `frontend/app/san-pham/phan-mem/page.tsx`
- `frontend/app/san-pham/tai-khoan/page.tsx`
- `frontend/app/san-pham/khac/page.tsx`
- `frontend/app/dich-vu/tang-tuong-tac/page.tsx`
- `frontend/app/dich-vu/phan-mem/page.tsx`
- `frontend/app/dich-vu/blockchain/page.tsx`
- `frontend/app/dich-vu/khac/page.tsx`

**Acceptance Criteria:**
- [ ] All 8 routes load real data
- [ ] All routes have working filters/sort/pagination
- [ ] All routes handle loading/empty/error states
- [ ] Code is DRY (no copy-paste, use shared utilities)

---

### Phase 4: Product Detail Integration
**Goal:** Connect product detail page to backend

**Tasks:**
1. Update product detail route to use slug
2. Fetch product detail from `GET /products/slug/:slug`
3. Map response to detail page UI
4. Handle 404 for invalid slugs

**Files to Check/Modify:**
- `frontend/app/san-pham/[id]/page.tsx` (may need to rename to `[slug]`)

**Acceptance Criteria:**
- [ ] Detail page loads by slug (not ID)
- [ ] All product data displays correctly
- [ ] 404 page shows for invalid slugs
- [ ] Links from listing cards work

---

### Phase 5: Polish & Testing
**Goal:** Ensure production-ready quality

**Tasks:**
1. Test all routes with various filters/sorts
2. Test favorite toggle (logged in + logged out)
3. Test pagination edge cases (first page, last page)
4. Test error scenarios (backend down, slow network)
5. Verify no console errors
6. Check mobile responsiveness (no layout breaks)
7. Performance check (no unnecessary re-renders)

**Acceptance Criteria:**
- [ ] All features work on desktop and mobile
- [ ] No console errors or warnings
- [ ] Loading states are smooth (no flashing)
- [ ] Error messages are user-friendly
- [ ] Favorite toggle has optimistic UI
- [ ] Page doesn't scroll to top on filter/sort (if possible)

---

## Data Mapping

### Backend Response → Frontend ProductCard Component

| Backend Field | Frontend Prop | Transform |
|--------------|---------------|-----------|
| `id` | `id` | Direct |
| `slug` | Used in Link href | Direct |
| `title` | `name` | Direct |
| `image` | `image` | Direct |
| `badgeText` | `badge` | Direct |
| `sellerName` | `seller` | Direct |
| `stock` | `stock` | Direct |
| `priceMin`, `priceMax` | `priceRange` | Format as "3.000 - 17.000đ" |
| `rating` | `rating` | Direct |
| `reviewCount` | `reviews` | Direct |
| `completedOrders` | `sold` | Direct |
| `complaintPercent` | `complaints` | Format as "0.0%" |
| `features` | `features` | Direct |
| `isFavorite` | Used for heart icon state | Direct |

### Format Utilities Needed

```typescript
// Format VND currency
formatVND(3000) → "3.000đ"
formatVND(17000) → "17.000đ"

// Format price range
formatPriceRange(3000, 17000) → "3.000 - 17.000đ"
formatPriceRange(5000, 5000) → "5.000đ"

// Format number with thousand separator
formatNumber(8261) → "8.261"
formatNumber(108851) → "108.851"

// Format percentage
formatPercent(0.0) → "0.0%"
formatPercent(1.5) → "1.5%"
```

---

## Error Handling

### Scenarios to Handle

1. **Backend Down / Network Error**
   - Show error message: "Không thể tải dữ liệu. Vui lòng thử lại sau."
   - Provide retry button

2. **Empty Results**
   - Show empty state: "Không tìm thấy sản phẩm phù hợp."
   - Suggest clearing filters

3. **Favorite Toggle Fails**
   - Rollback optimistic update
   - Show toast: "Không thể thêm vào yêu thích. Vui lòng thử lại."

4. **Unauthenticated Favorite**
   - Show login modal or redirect to login page
   - Preserve current page state for return

5. **Invalid Product Slug**
   - Show 404 page
   - Provide link back to listing

---

## Authentication Handling

### Current Auth System (from existing code)
- Uses JWT tokens
- Token stored in localStorage or cookies (check existing implementation)
- `useAuth` hook available in `hooks/useAuth.ts`

### Favorite Endpoints Require Auth
- Check if user is logged in before calling favorite API
- If not logged in:
  - Option A: Show login modal (if exists)
  - Option B: Redirect to `/dang-nhap` with return URL
- Include auth token in request header: `Authorization: Bearer {token}`

---

## URL State Management

### Recommended Approach (Next.js App Router)
Use search params to sync filter/sort/page state with URL:

```
/san-pham/email?subTypes=GMAIL,HOTMAIL&sort=price_asc&page=2
```

**Benefits:**
- Shareable URLs
- Browser back/forward works
- Refresh preserves state

**Implementation:**
- Use `useSearchParams` and `useRouter` from `next/navigation`
- Update URL on filter/sort/page change
- Read URL params on page load to initialize state

**Note:** If this adds complexity, can start with local state and upgrade later.

---

## Testing Checklist

### Functional Testing
- [ ] All 8 routes load data from backend
- [ ] Sidebar filters work (checkbox + search button)
- [ ] Sort tabs work (popular, price_asc, price_desc)
- [ ] Pagination works (next, prev, page numbers)
- [ ] Favorite toggle works (logged in)
- [ ] Favorite toggle shows login prompt (logged out)
- [ ] Product detail links work (slug-based)
- [ ] Loading states show during API calls
- [ ] Empty states show when no results
- [ ] Error states show on API failure

### Edge Cases
- [ ] First page (no prev button)
- [ ] Last page (no next button)
- [ ] Single page of results
- [ ] No results after filtering
- [ ] All filters selected
- [ ] No filters selected
- [ ] Slow network (loading state visible)
- [ ] Backend returns error (error message shown)

### Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Dependencies

### Backend
- ✅ Backend APIs implemented and tested (per IMPLEMENTATION_SUMMARY.md)
- ✅ Seed data available for testing
- ✅ API documentation complete

### Frontend
- ✅ UI components built (FilterSidebar, ProductCard, Pagination)
- ✅ Routing structure in place (8 routes exist)
- ✅ Auth system exists (useAuth hook)
- ⚠️ Need to verify: API base URL configuration
- ⚠️ Need to verify: Auth token storage/retrieval

### External
- None (no third-party services needed)

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Backend API not fully tested | High | Low | Test all endpoints with Postman before frontend work |
| Auth token handling unclear | Medium | Medium | Review existing auth code first, document token flow |
| Type mismatches between backend/frontend | Medium | Medium | Generate types from backend schema if possible |
| Performance issues with large datasets | Low | Low | Backend has pagination, should be fine. Monitor and add caching if needed |
| Mobile layout breaks with real data | Low | Low | Test on mobile early, existing UI should handle it |

---

## Success Criteria

### Must Have (MVP)
1. ✅ All 8 listing routes display real backend data
2. ✅ Sidebar filters work with subtype counts
3. ✅ Sort tabs work (3 options)
4. ✅ Pagination works with real page counts
5. ✅ Favorite toggle works (with auth check)
6. ✅ Product detail links use slugs
7. ✅ Loading/empty/error states implemented
8. ✅ No console errors
9. ✅ Mobile responsive (no layout breaks)

### Nice to Have (Post-MVP)
- URL state management (shareable links)
- Optimistic UI for favorites
- Skeleton loaders instead of spinners
- Infinite scroll option
- Filter/sort animations
- Performance monitoring

---

## Timeline Estimate

**Assumptions:**
- 1 developer working full-time
- Backend is fully functional
- No major blockers

**Phase 1 (Foundation):** 1 day
- API layer, types, utilities

**Phase 2 (Single Route):** 2 days
- Email route end-to-end integration
- Most complex phase (establishes pattern)

**Phase 3 (Replicate):** 1 day
- Apply pattern to 7 remaining routes
- Should be fast since pattern is established

**Phase 4 (Detail Page):** 0.5 day
- Product detail integration

**Phase 5 (Polish & Testing):** 1 day
- Testing, bug fixes, edge cases

**Total:** 5.5 days (~1 week)

**Buffer:** Add 20% for unexpected issues = 6.5 days

---

## Decisions Made

1. **Auth Token Storage:** JWT stored in localStorage
   - Use existing `useAuth` hook for token retrieval

2. **API Base URL:** Use environment variable, do NOT hardcode
   - Read from `process.env.NEXT_PUBLIC_API_URL`
   - Follow existing pattern in `lib/api.ts`

3. **Login Flow:** Redirect to `/dang-nhap` when unauthenticated user clicks favorite
   - No login modal needed
   - Preserve return URL if possible

4. **Product Detail Route:** Slug-based routing
   - Use `/san-pham/[slug]` pattern
   - Update existing route if needed

5. **Error Handling:** Reuse existing toast system if present, otherwise simple error messages
   - Check if `sweetalert2` is configured
   - Fallback to inline error messages if no toast system

6. **UI Constraints:** Keep existing UI completely unchanged
   - Only wire up data, no layout modifications
   - Support only current sidebar filter + 3 sort tabs
   - No new UI elements

7. **Schema Approach:** Extend existing product schema
   - Do NOT build parallel system
   - Reuse existing types and components where possible

---

## Appendix

### Backend Documentation References
- `backend/LISTING_IMPLEMENTATION.md` - Implementation details
- `backend/API_REFERENCE.md` - API endpoint documentation
- `backend/ROUTE_MAPPING.md` - Route to category mapping
- `backend/TESTING_GUIDE.md` - Testing examples

### Frontend Files to Review
- `frontend/lib/api.ts` - Existing API configuration
- `frontend/hooks/useAuth.ts` - Auth hook
- `frontend/components/FilterSidebar.tsx` - Filter UI
- `frontend/components/ProductCard.tsx` - Product card UI
- `frontend/app/san-pham/email/page.tsx` - Example listing page

---

## Approval

**Product Manager:** John (BMAD PM Agent)  
**Date:** 2026-03-06  

**Next Steps:**
1. Review this PRD with development team
2. Answer open questions
3. Confirm timeline estimate
4. Begin Phase 1 implementation

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-06
