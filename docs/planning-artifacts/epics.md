---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments: 
  - "docs/planning-artifacts/PRD-Frontend-Listing-Integration.md"
  - "backend/LISTING_IMPLEMENTATION.md"
  - "backend/API_REFERENCE.md"
  - "backend/ROUTE_MAPPING.md"
---

# Frontend Listing Integration - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Frontend Listing Integration, decomposing the requirements from the PRD and backend technical documentation into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1:** Create TypeScript interfaces matching backend API response structure for listing, detail, and favorite endpoints

**FR2:** Create API service layer with functions for fetching product/service listings, product details, and toggling favorites

**FR3:** Create route-to-endpoint mapping utility that maps 8 frontend routes to corresponding backend endpoints without scattered if/else logic

**FR4:** Create format utilities for VND currency, price ranges, numbers with thousand separators, and percentages

**FR5:** Connect sidebar filter checkboxes to dynamic subtype counts from API response

**FR6:** Send selected subtypes as comma-separated query params when user clicks search button

**FR7:** Connect 3 sort tabs (Phổ biến, Giá tăng dần, Giá giảm dần) to API sort parameters (popular, price_asc, price_desc)

**FR8:** Reset pagination to page 1 when sort changes

**FR9:** Map backend API response fields to existing ProductCard component props without changing layout

**FR10:** Connect existing Pagination component to API meta data (page, totalPages, total)

**FR11:** Sync pagination state with API calls

**FR12:** Wire heart icon to POST /products/:id/favorite endpoint with auth token

**FR13:** Redirect unauthenticated users to /dang-nhap when clicking favorite

**FR14:** Implement optimistic UI update for favorite toggle with rollback on error

**FR15:** Update product detail links to use slug from API instead of ID

**FR16:** Support slug-based routing for product detail pages

**FR17:** Show loading spinner during API calls

**FR18:** Show empty state message when no products found

**FR19:** Show error message when API call fails

**FR20:** Integrate all 8 listing routes (4 products + 4 services) with backend APIs

**FR21:** Fetch product detail from GET /products/slug/:slug endpoint

**FR22:** Handle 404 for invalid product slugs

### Non-Functional Requirements

**NFR1:** Use environment variable for API base URL, do not hardcode

**NFR2:** Store JWT token in localStorage and retrieve using existing useAuth hook

**NFR3:** Keep existing UI completely unchanged - no layout modifications

**NFR4:** Support only current sidebar filter and 3 sort tabs - no new UI elements

**NFR5:** Extend existing product schema - do not build parallel system

**NFR6:** Reuse existing types and components where possible

**NFR7:** Code must be DRY - no copy-paste across 8 routes

**NFR8:** All TypeScript types must be properly defined

**NFR9:** No console errors or warnings

**NFR10:** Mobile responsive - no layout breaks with real data

**NFR11:** Loading states must be smooth without flashing

**NFR12:** Error messages must be user-friendly in Vietnamese

**NFR13:** Reuse existing toast system if present, otherwise use simple error handling

### Additional Requirements

**Technical Requirements from Backend:**
- Backend uses 8 fixed endpoints: /products/email, /products/software, /products/account, /products/other, /services/engagement, /services/software, /services/blockchain, /services/other
- Query parameters: subTypes (comma-separated), sort (popular|price_asc|price_desc), page (number), limit (number, default 12)
- Response includes data array, meta object (page, limit, total, totalPages), and filters object (subTypeCounts array)
- ProductCard response includes: id, slug, title, image, badgeText, sellerName, stock, priceMin, priceMax, rating, reviewCount, completedOrders, complaintPercent, features, isFavorite
- Favorite endpoints require JWT authentication in Authorization header
- Unauthenticated users see isFavorite: false for all products

**Data Mapping Requirements:**
- Backend title → Frontend name
- Backend priceMin/priceMax → Frontend priceRange (formatted as "3.000 - 17.000đ")
- Backend reviewCount → Frontend reviews
- Backend completedOrders → Frontend sold
- Backend complaintPercent → Frontend complaints (formatted as "0.0%")

**Error Handling Requirements:**
- Backend down/network error: "Không thể tải dữ liệu. Vui lòng thử lại sau." with retry button
- Empty results: "Không tìm thấy sản phẩm phù hợp." with suggestion to clear filters
- Favorite toggle fails: Rollback optimistic update, show "Không thể thêm vào yêu thích. Vui lòng thử lại."
- Invalid product slug: Show 404 page with link back to listing

### FR Coverage Map

FR1: Epic 1 - TypeScript interfaces for API responses
FR2: Epic 1 - API service layer functions
FR3: Epic 1 - Route-to-endpoint mapping utility
FR4: Epic 1 - Format utilities (currency, numbers, percentages)
FR5: Epic 2 - Sidebar filter with dynamic subtype counts
FR6: Epic 2 - Send selected subtypes as query params
FR7: Epic 2 - Connect sort tabs to API params
FR8: Epic 2 - Reset pagination on sort change
FR9: Epic 2 - Map API response to ProductCard props
FR10: Epic 2 - Connect Pagination component to API meta
FR11: Epic 2 - Sync pagination state with API
FR12: Epic 2 - Wire heart icon to favorite endpoint
FR13: Epic 2 - Redirect unauthenticated users to login
FR14: Epic 2 - Optimistic UI for favorite toggle
FR15: Epic 4 - Update detail links to use slug
FR16: Epic 4 - Support slug-based routing
FR17: Epic 2 - Loading spinner during API calls
FR18: Epic 2 - Empty state when no products
FR19: Epic 2 - Error message on API failure
FR20: Epic 3 - Integrate all 8 listing routes
FR21: Epic 4 - Fetch product detail by slug
FR22: Epic 4 - Handle 404 for invalid slugs

## Epic List

### Epic 1: API Foundation & Data Infrastructure
Developers have a clean, typed API layer to fetch product listings and details from the backend
**FRs covered:** FR1, FR2, FR3, FR4

### Epic 2: Single Route Integration (Email Products)
Buyers can browse real email products with working filters, sort, pagination, and favorites on the email listing page
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR17, FR18, FR19

### Epic 3: Complete Listing Coverage
Buyers can browse all 8 product/service categories with consistent filtering, sorting, and favorites
**FRs covered:** FR20

### Epic 4: Product Detail Pages
Buyers can click any product card and view complete product details including features, price options, and seller information
**FRs covered:** FR15, FR16, FR21, FR22



## Epic 1: API Foundation & Data Infrastructure

Developers have a clean, typed API layer to fetch product listings and details from the backend

### Story 1.1: Create TypeScript Type Definitions for Listing APIs

As a **developer**,
I want **TypeScript interfaces matching the backend API response structure**,
So that **I get type safety and autocomplete when working with API data**.

**Acceptance Criteria:**

**Given** the backend API documentation is available
**When** I create TypeScript interfaces in `frontend/types/listing.ts`
**Then** the following types are defined:
- `ProductListResponse` with data, meta, and filters properties
- `ProductCard` with all 15 fields from backend (id, slug, title, image, badgeText, sellerName, stock, priceMin, priceMax, rating, reviewCount, completedOrders, complaintPercent, features, isFavorite)
- `PaginationMeta` with page, limit, total, totalPages
- `SubTypeCount` with value, label, count
- `ProductDetail` for detail page response
- `FavoriteToggleResponse` with success and isFavorite

**And** all types match the backend response structure exactly
**And** types are exported for use in other files
**And** no `any` types are used

### Story 1.2: Create API Service Layer for Listing Endpoints

As a **developer**,
I want **centralized API service functions for all listing operations**,
So that **API calls are consistent and reusable across all pages**.

**Acceptance Criteria:**

**Given** TypeScript types from Story 1.1 exist
**When** I create `frontend/lib/api/listing.ts`
**Then** the following functions are implemented:
- `getProductListing(endpoint, params)` - fetches listing with query params
- `getProductDetail(slug)` - fetches product by slug
- `toggleFavorite(productId, token)` - toggles favorite with auth
- `getUserFavorites(token, page, limit)` - fetches user favorites

**And** all functions use the API base URL from `process.env.NEXT_PUBLIC_API_URL`
**And** all functions return properly typed responses
**And** auth token is included in headers for favorite endpoints
**And** errors are caught and returned in a consistent format

### Story 1.3: Create Route-to-Endpoint Mapping Utility

As a **developer**,
I want **a centralized utility that maps frontend routes to backend endpoints**,
So that **I don't have scattered if/else logic across components**.

**Acceptance Criteria:**

**Given** the 8 frontend routes are known
**When** I create `frontend/lib/utils/routeMapping.ts`
**Then** a function `getEndpointFromRoute(route)` is implemented
**And** it maps:
- `/san-pham/email` → `/products/email`
- `/san-pham/phan-mem` → `/products/software`
- `/san-pham/tai-khoan` → `/products/account`
- `/san-pham/khac` → `/products/other`
- `/dich-vu/tang-tuong-tac` → `/services/engagement`
- `/dich-vu/phan-mem` → `/services/software`
- `/dich-vu/blockchain` → `/services/blockchain`
- `/dich-vu/khac` → `/services/other`

**And** the function returns the correct endpoint for any valid route
**And** the function throws an error for invalid routes
**And** the mapping is maintainable (object/map, not if/else chain)

### Story 1.4: Create Format Utilities for Vietnamese Currency and Numbers

As a **developer**,
I want **utility functions to format numbers and currency in Vietnamese style**,
So that **all displayed values are consistent and properly formatted**.

**Acceptance Criteria:**

**Given** Vietnamese formatting requirements (thousand separator with dot, currency symbol đ)
**When** I create `frontend/lib/utils/format.ts`
**Then** the following functions are implemented:
- `formatVND(amount)` - formats number as "3.000đ"
- `formatPriceRange(min, max)` - formats as "3.000 - 17.000đ" or "5.000đ" if equal
- `formatNumber(num)` - formats with thousand separator "8.261"
- `formatPercent(num)` - formats as "0.0%" or "1.5%"

**And** `formatVND(3000)` returns "3.000đ"
**And** `formatPriceRange(3000, 17000)` returns "3.000 - 17.000đ"
**And** `formatPriceRange(5000, 5000)` returns "5.000đ"
**And** `formatNumber(108851)` returns "108.851"
**And** `formatPercent(0.0)` returns "0.0%"
**And** all functions handle edge cases (null, undefined, 0)


## Epic 2: Single Route Integration (Email Products)

Buyers can browse real email products with working filters, sort, pagination, and favorites on the email listing page

### Story 2.1: Integrate Email Listing Page with Backend API

As a **buyer**,
I want **to see real email products from the backend**,
So that **I can browse actual available products with accurate stock and pricing**.

**Acceptance Criteria:**

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

### Story 2.2: Connect Sidebar Filter with Dynamic Subtype Counts

As a **buyer**,
I want **to see available email types with product counts**,
So that **I know which filters have products before selecting them**.

**Acceptance Criteria:**

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

### Story 2.3: Implement Sort Tabs with API Integration

As a **buyer**,
I want **to sort products by popularity or price**,
So that **I can find the best deals or most popular items**.

**Acceptance Criteria:**

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

### Story 2.4: Connect Pagination to API Meta Data

As a **buyer**,
I want **to navigate through multiple pages of products**,
So that **I can browse all available products beyond the first page**.

**Acceptance Criteria:**

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

### Story 2.5: Implement Favorite Toggle with Authentication

As a **buyer**,
I want **to favorite products I'm interested in**,
So that **I can save them for later review**.

**Acceptance Criteria:**

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

### Story 2.6: Add Loading, Empty, and Error States

As a **buyer**,
I want **clear feedback when data is loading, empty, or fails**,
So that **I understand what's happening and what to do next**.

**Acceptance Criteria:**

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


## Epic 3: Complete Listing Coverage

Buyers can browse all 8 product/service categories with consistent filtering, sorting, and favorites

### Story 3.1: Integrate Remaining 7 Listing Routes

As a **buyer**,
I want **to browse all product and service categories**,
So that **I can find any type of product or service available on the platform**.

**Acceptance Criteria:**

**Given** the email listing page pattern from Epic 2 is established
**When** I apply the same pattern to the remaining 7 routes
**Then** the following pages are integrated with backend APIs:
- `/san-pham/phan-mem` → `/products/software`
- `/san-pham/tai-khoan` → `/products/account`
- `/san-pham/khac` → `/products/other`
- `/dich-vu/tang-tuong-tac` → `/services/engagement`
- `/dich-vu/phan-mem` → `/services/software`
- `/dich-vu/blockchain` → `/services/blockchain`
- `/dich-vu/khac` → `/services/other`

**And** each route displays real data from its corresponding endpoint
**And** each route has working sidebar filters with dynamic subtype counts
**And** each route has working sort tabs (popular, price_asc, price_desc)
**And** each route has working pagination
**And** each route has working favorite toggle with auth
**And** each route has loading, empty, and error states
**And** all routes reuse the same utilities and components (DRY code)
**And** no code is copy-pasted between routes
**And** the existing UI layout is unchanged for all routes
**And** all routes work on desktop and mobile

## Epic 4: Product Detail Pages

Buyers can click any product card and view complete product details including features, price options, and seller information

### Story 4.1: Update Product Card Links to Use Slugs

As a **buyer**,
I want **product cards to link to detail pages using slugs**,
So that **I can view product details with SEO-friendly URLs**.

**Acceptance Criteria:**

**Given** product cards display on listing pages
**When** the API response includes `slug` field for each product
**Then** product card links use `/san-pham/[slug]` format instead of `/san-pham/[id]`
**And** clicking a product card navigates to the slug-based URL
**And** the slug is extracted from the API response
**And** the existing ProductCard component layout is unchanged

### Story 4.2: Implement Slug-Based Product Detail Page

As a **buyer**,
I want **to view complete product details when I click a product**,
So that **I can see all information before making a purchase decision**.

**Acceptance Criteria:**

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
