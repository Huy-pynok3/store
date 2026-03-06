# Story 1.3: Create Route-to-Endpoint Mapping Utility

Status: review

## Story

As a **developer**,
I want **a centralized utility that maps frontend routes to backend endpoints**,
So that **I don't have scattered if/else logic across components**.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Create `frontend/lib/utils/routeMapping.ts` file (AC: All)
  - [x] Define route-to-endpoint mapping object
  - [x] Implement `getEndpointFromRoute(route)` function
  - [x] Add error handling for invalid routes
  - [x] Export function

## Dev Notes

### Critical Requirements

1. **File Location**: Create new file at `frontend/lib/utils/routeMapping.ts`
2. **Use Object/Map**: No if/else chains - use object lookup for maintainability
3. **Error Handling**: Throw descriptive error for invalid routes
4. **Type Safety**: Type the route parameter and return value

### Route Mappings

**Product routes (4):**
- `/san-pham/email` → `/products/email`
- `/san-pham/phan-mem` → `/products/software`
- `/san-pham/tai-khoan` → `/products/account`
- `/san-pham/khac` → `/products/other`

**Service routes (4):**
- `/dich-vu/tang-tuong-tac` → `/services/engagement`
- `/dich-vu/phan-mem` → `/services/software`
- `/dich-vu/blockchain` → `/services/blockchain`
- `/dich-vu/khac` → `/services/other`

### Implementation Pattern

```typescript
const ROUTE_TO_ENDPOINT_MAP: Record<string, string> = {
  '/san-pham/email': '/products/email',
  // ... other mappings
};

export function getEndpointFromRoute(route: string): string {
  const endpoint = ROUTE_TO_ENDPOINT_MAP[route];
  if (!endpoint) {
    throw new Error(`Invalid route: ${route}`);
  }
  return endpoint;
}
```

### Previous Story Context

**Story 1.2 completed:**
- Created API service layer at `frontend/lib/api/listing.ts`
- Functions accept endpoint parameter (e.g., "/products/email")
- This utility will provide those endpoints from route paths

**Integration example:**
```typescript
import { getProductListing } from '@/lib/api/listing';
import { getEndpointFromRoute } from '@/lib/utils/routeMapping';

const route = '/san-pham/email';
const endpoint = getEndpointFromRoute(route); // "/products/email"
const data = await getProductListing(endpoint);
```

### References

- [Backend Routes]: `backend/ROUTE_MAPPING.md`
- [PRD]: `docs/planning-artifacts/PRD-Frontend-Listing-Integration.md`
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 1, Story 1.3

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript compilation verified - 0 errors
- Route mapping uses object lookup (maintainable)
- Error handling for invalid routes implemented

### Completion Notes List

✅ Created `frontend/lib/utils/routeMapping.ts` with:
- `ROUTE_TO_ENDPOINT_MAP` object with 8 route mappings
- `getEndpointFromRoute(route)` function with error handling
- All 4 product routes mapped
- All 4 service routes mapped
- Throws descriptive error for invalid routes

### File List

- [x] `frontend/lib/utils/routeMapping.ts` - Created with route mapping utility
