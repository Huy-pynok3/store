# Story 1.1: Create TypeScript Type Definitions for Listing APIs

Status: review

## Story

As a **developer**,
I want **TypeScript interfaces matching the backend API response structure**,
So that **I get type safety and autocomplete when working with API data**.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Create `frontend/types/listing.ts` file (AC: All)
  - [x] Define `ProductCard` interface with 15 fields matching backend DTO
  - [x] Define `PaginationMeta` interface with page, limit, total, totalPages
  - [x] Define `SubTypeCount` interface with value, label, count
  - [x] Define `ProductListResponse` interface combining data, meta, filters
  - [x] Define `ProductDetail` interface for detail page response
  - [x] Define `FavoriteToggleResponse` interface with success and isFavorite
  - [x] Export all interfaces
  - [x] Verify no `any` types are used

## Dev Notes

### Critical Requirements

1. **File Location**: Create new file at `frontend/types/listing.ts`
2. **No `any` Types**: All fields must be properly typed - use `string | null` for nullable fields, not `any`
3. **Exact Backend Match**: Types must match backend DTOs exactly - see backend reference below
4. **Export All Types**: All interfaces must be exported for use in other files

### Backend API Response Structure

**Source:** `backend/src/modules/products/dto/product-list-response.dto.ts`

The backend already has TypeScript DTOs defined. Your frontend types should match these exactly:

```typescript
export interface ProductCardDto {
  id: string;
  slug: string;
  title: string;
  image: string;
  badgeText: string | null;
  sellerName: string;
  stock: number;
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  completedOrders: number;
  complaintPercent: number;
  features: string[];
  isFavorite: boolean;
}

export interface SubTypeCount {
  value: string;
  label: string;
  count: number;
}

export interface ProductListResponseDto {
  data: ProductCardDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    subTypeCounts: SubTypeCount[];
  };
}
```

### Product Detail Response Structure

**Source:** `backend/API_REFERENCE.md` - GET /products/slug/:slug

```json
{
  "id": "clx123abc",
  "slug": "gmail-new-usa-reg-ios",
  "name": "Gmail New USA...",
  "description": "Full description...",
  "shortDescription": "Short description...",
  "badgeText": "KHÔNG TRÙNG",
  "kind": "PRODUCT",
  "category": "EMAIL",
  "subType": "GMAIL",
  "images": ["https://..."],
  "stock": 8261,
  "sold": 15420,
  "ratingAvg": 4.0,
  "reviewCount": 128,
  "completedOrders": 108851,
  "complaintPercent": 0.0,
  "isActive": true,
  "autoDeliver": true,
  "shop": {
    "id": "clx456def",
    "name": "leelangymail",
    "rating": 4.8,
    "totalSales": 108851
  },
  "features": [
    {
      "id": "clx789ghi",
      "content": "Feature text...",
      "sortOrder": 0
    }
  ],
  "priceOptions": [
    {
      "id": "clx012jkl",
      "label": "1 tài khoản",
      "price": 3000,
      "stock": 8261,
      "isActive": true
    }
  ],
  "isFavorite": false,
  "createdAt": "2024-03-05T10:30:00.000Z",
  "updatedAt": "2024-03-06T08:15:00.000Z"
}
```

### Favorite Toggle Response Structure

**Source:** `backend/API_REFERENCE.md` - POST /products/:id/favorite

```json
{
  "success": true,
  "isFavorite": true
}
```

### Existing Frontend Type Structure

**Source:** `frontend/data/products.ts`

The frontend currently has a `Product` interface for mock data. DO NOT modify this file. Create a separate `listing.ts` file for API types. The existing interface uses different field names:

- Backend `title` → Frontend mock `name`
- Backend `priceMin`/`priceMax` → Frontend mock `priceRange` (formatted string)
- Backend `reviewCount` → Frontend mock `reviews`
- Backend `completedOrders` → Frontend mock `sold`
- Backend `complaintPercent` → Frontend mock `complaints` (formatted string)

Your new types should match the backend exactly. Data mapping will be handled in Story 2.1.

### Type Naming Conventions

Use these exact names for consistency:

1. `ProductCard` - For listing page product cards (matches backend `ProductCardDto`)
2. `ProductListResponse` - For listing API response (matches backend `ProductListResponseDto`)
3. `PaginationMeta` - For pagination metadata
4. `SubTypeCount` - For filter subtype counts
5. `ProductDetail` - For detail page product data
6. `FavoriteToggleResponse` - For favorite toggle API response

### Project Structure Notes

- **New File**: `frontend/types/listing.ts` (create this directory if it doesn't exist)
- **No Changes**: Do not modify `frontend/data/products.ts` - that's for mock data
- **Future Use**: These types will be imported in Stories 1.2 (API service layer) and 2.1 (component integration)

### TypeScript Best Practices

1. Use `interface` instead of `type` for object shapes (better for extension)
2. Use `string | null` for nullable fields, not `string?` (backend uses null, not undefined)
3. Use `number` for all numeric fields (price, stock, rating, etc.)
4. Use `string[]` for arrays of strings (features)
5. Use nested interfaces for complex objects (shop, priceOptions, features)

### References

- [Backend DTO]: `backend/src/modules/products/dto/product-list-response.dto.ts`
- [API Reference]: `backend/API_REFERENCE.md` - Sections: "Product Listing Endpoints", "Product Detail Endpoint", "Favorite Endpoints"
- [PRD]: `docs/planning-artifacts/PRD-Frontend-Listing-Integration.md` - Section: "Technical Requirements"
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 1, Story 1.1

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript compilation verified with `npx tsc --noEmit` - 0 errors
- All interfaces match backend DTOs exactly
- No `any` types used - all fields properly typed

### Completion Notes List

✅ Created `frontend/types/listing.ts` with 6 exported interfaces:
- `ProductCard` - 15 fields matching backend ProductCardDto
- `PaginationMeta` - pagination metadata (page, limit, total, totalPages)
- `SubTypeCount` - filter subtype counts (value, label, count)
- `ProductListResponse` - complete listing API response structure
- `ProductDetail` - product detail page data with nested Shop, ProductFeature, PriceOption interfaces
- `FavoriteToggleResponse` - favorite toggle API response

All types match backend response structure exactly. Nullable fields use `string | null` pattern. No `any` types used.

### File List

- [x] `frontend/types/listing.ts` - Created with all required interfaces


---

## Additional Context for Developer

### Why This Story Matters

This is the foundation for the entire frontend-backend integration. All subsequent stories (API service layer, component integration) depend on these types. Getting them right now prevents refactoring later.

### Common Pitfalls to Avoid

1. **Don't use `any`**: Even for complex nested objects, define proper interfaces
2. **Don't use optional (`?`) for nullable fields**: Backend returns `null`, not `undefined`, so use `string | null`
3. **Don't modify existing `Product` interface**: That's for mock data, keep it separate
4. **Don't add extra fields**: Only include fields that backend actually returns
5. **Don't use different names**: Match backend field names exactly (e.g., `title` not `name`)

### Testing Your Types

After creating the types, you can verify them by:

1. Import them in a test file: `import { ProductCard, ProductListResponse } from '@/types/listing'`
2. Create a sample object matching the backend response structure
3. TypeScript should show no errors if types are correct
4. Check that autocomplete works when accessing nested properties

### Next Steps After This Story

Once this story is complete:
- **Story 1.2** will create API service functions using these types
- **Story 1.3** will create route-to-endpoint mapping utility
- **Story 1.4** will create format utilities for Vietnamese currency
- **Story 2.1** will integrate the email listing page using all of Epic 1's work

### Environment Setup

- **TypeScript Version**: Check `frontend/package.json` for current version
- **Path Alias**: Use `@/types/listing` to import (configured in `tsconfig.json`)
- **No Runtime Code**: These are type-only definitions, no runtime JavaScript generated

### Validation Checklist

Before marking this story as done, verify:

- [ ] File created at `frontend/types/listing.ts`
- [ ] All 6 interfaces defined and exported
- [ ] No `any` types used
- [ ] All fields match backend response structure
- [ ] Nullable fields use `| null` not `?`
- [ ] No TypeScript compilation errors
- [ ] File can be imported from other files using `@/types/listing`

### Estimated Complexity

**Time Estimate**: 15-30 minutes  
**Complexity**: Low  
**Risk**: Low (pure type definitions, no logic)

This is a straightforward story - just translating backend DTOs to frontend TypeScript interfaces. The main challenge is ensuring exact field name and type matching.
