# Story 1.2: Create API Service Layer for Listing Endpoints

Status: review

## Story

As a **developer**,
I want **centralized API service functions for all listing operations**,
So that **API calls are consistent and reusable across all pages**.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Create `frontend/lib/api/listing.ts` file (AC: All)
  - [x] Import types from `@/types/listing`
  - [x] Define API base URL from environment variable
  - [x] Implement `getProductListing(endpoint, params)` function
  - [x] Implement `getProductDetail(slug)` function
  - [x] Implement `toggleFavorite(productId, token)` function
  - [x] Implement `getUserFavorites(token, page, limit)` function
  - [x] Add error handling for all functions
  - [x] Export all functions

## Dev Notes

### Critical Requirements

1. **File Location**: Create new file at `frontend/lib/api/listing.ts`
2. **Use Story 1.1 Types**: Import all types from `@/types/listing` (created in Story 1.1)
3. **Environment Variable**: Use `process.env.NEXT_PUBLIC_API_URL` for API base URL
4. **Error Handling**: Catch and return errors in consistent format
5. **Auth Headers**: Include `Authorization: Bearer ${token}` for favorite endpoints

### Previous Story Context (Story 1.1)

**What was completed:**
- Created `frontend/types/listing.ts` with all required interfaces
- Types match backend DTOs exactly
- All types exported and ready for use

**Key learnings:**
- TypeScript compilation verified with no errors
- Types use `string | null` for nullable fields (not optional `?`)
- Path alias `@/types/listing` works correctly

**Files created:**
- `frontend/types/listing.ts` - Import from here

### API Base URL Configuration

**Source:** PRD Section "Technical Requirements"

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
```

**Why NEXT_PUBLIC prefix:**
- Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables
- Without prefix, variable is only available server-side
- This API layer will be used in client components

### Function Specifications

#### 1. getProductListing(endpoint, params)

**Purpose:** Fetch product/service listings with filters, sort, pagination

**Parameters:**
```typescript
endpoint: string  // e.g., "/products/email", "/services/blockchain"
params?: {
  subTypes?: string      // Comma-separated: "GMAIL,HOTMAIL"
  sort?: 'popular' | 'price_asc' | 'price_desc'
  page?: number
  limit?: number
}
```

**Returns:** `Promise<ProductListResponse>`

**Example usage:**
```typescript
const response = await getProductListing('/products/email', {
  subTypes: 'GMAIL,HOTMAIL',
  sort: 'popular',
  page: 1,
  limit: 12
});
```

**Implementation notes:**
- Build query string from params object
- Use URLSearchParams for proper encoding
- Default limit: 12 (matches backend default)
- Default sort: 'popular' (matches backend default)

#### 2. getProductDetail(slug)

**Purpose:** Fetch single product detail by slug

**Parameters:**
```typescript
slug: string  // e.g., "gmail-new-usa-reg-ios"
```

**Returns:** `Promise<ProductDetail>`

**Example usage:**
```typescript
const product = await getProductDetail('gmail-new-usa-reg-ios');
```

**Implementation notes:**
- Endpoint: `GET /products/slug/${slug}`
- No query parameters needed
- Handle 404 errors gracefully

#### 3. toggleFavorite(productId, token)

**Purpose:** Toggle product favorite status (add/remove)

**Parameters:**
```typescript
productId: string  // Product ID from API
token: string      // JWT auth token
```

**Returns:** `Promise<FavoriteToggleResponse>`

**Example usage:**
```typescript
const result = await toggleFavorite('clx123abc', userToken);
// result: { success: true, isFavorite: true }
```

**Implementation notes:**
- Endpoint: `POST /products/${productId}/favorite`
- Requires auth: `Authorization: Bearer ${token}`
- Backend toggles state automatically (no body needed)
- Returns new favorite status

#### 4. getUserFavorites(token, page, limit)

**Purpose:** Fetch user's favorited products with pagination

**Parameters:**
```typescript
token: string      // JWT auth token
page?: number      // Default: 1
limit?: number     // Default: 12
```

**Returns:** `Promise<ProductListResponse>`

**Example usage:**
```typescript
const favorites = await getUserFavorites(userToken, 1, 12);
```

**Implementation notes:**
- Endpoint: `GET /users/me/favorites`
- Requires auth: `Authorization: Bearer ${token}`
- Query params: page, limit
- Returns same format as getProductListing

### Error Handling Strategy

**Consistent error format:**
```typescript
{
  error: true,
  message: string,
  statusCode?: number
}
```

**Error scenarios to handle:**
1. **Network errors** - Backend down, no internet
2. **401 Unauthorized** - Invalid/expired token
3. **404 Not Found** - Invalid slug or product ID
4. **500 Server Error** - Backend error

**Implementation pattern:**
```typescript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.json();
} catch (error) {
  return {
    error: true,
    message: error.message || 'An error occurred',
    statusCode: error.status
  };
}
```

### Backend API Reference

**Source:** `backend/API_REFERENCE.md`

**Base URL:** `http://localhost:3000` (development)

**Listing endpoints:**
- `GET /products/email`
- `GET /products/software`
- `GET /products/account`
- `GET /products/other`
- `GET /services/engagement`
- `GET /services/software`
- `GET /services/blockchain`
- `GET /services/other`

**Detail endpoint:**
- `GET /products/slug/:slug`

**Favorite endpoints:**
- `POST /products/:id/favorite` (requires auth)
- `GET /users/me/favorites` (requires auth)

**Query parameters:**
- `subTypes`: string (comma-separated)
- `sort`: "popular" | "price_asc" | "price_desc"
- `page`: number
- `limit`: number

### TypeScript Best Practices

1. **Import types from Story 1.1:**
```typescript
import {
  ProductListResponse,
  ProductDetail,
  FavoriteToggleResponse
} from '@/types/listing';
```

2. **Use async/await** (not .then/.catch chains)
3. **Type all parameters and return values**
4. **Use const for API_BASE_URL**
5. **Export all functions individually** (not default export)

### Project Structure Notes

- **New File**: `frontend/lib/api/listing.ts`
- **Dependencies**: `frontend/types/listing.ts` (from Story 1.1)
- **Future Use**: These functions will be used in Story 2.1 (email listing integration)

### Common Pitfalls to Avoid

1. **Don't hardcode API URL** - Use environment variable
2. **Don't forget NEXT_PUBLIC prefix** - Required for client-side access
3. **Don't skip error handling** - Every function must handle errors
4. **Don't use .then/.catch** - Use async/await for consistency
5. **Don't forget auth headers** - Favorite endpoints require token

### Testing Your Functions

After creating the functions, you can verify them by:

1. Check TypeScript compilation: `npx tsc --noEmit`
2. Import in a test file: `import { getProductListing } from '@/lib/api/listing'`
3. Verify types are correct (autocomplete should work)
4. Check that all functions are exported

### Next Steps After This Story

Once this story is complete:
- **Story 1.3** will create route-to-endpoint mapping utility
- **Story 1.4** will create format utilities for Vietnamese currency
- **Story 2.1** will integrate the email listing page using these API functions

### Environment Setup

- **API Base URL**: Set `NEXT_PUBLIC_API_URL` in `.env.local`
- **Default**: Falls back to `http://localhost:3000` if not set
- **Production**: Will be set to production API URL

### Validation Checklist

Before marking this story as done, verify:

- [ ] File created at `frontend/lib/api/listing.ts`
- [ ] All 4 functions implemented and exported
- [ ] Types imported from `@/types/listing`
- [ ] API base URL uses environment variable
- [ ] Auth headers included for favorite endpoints
- [ ] Error handling implemented for all functions
- [ ] No TypeScript compilation errors
- [ ] Functions can be imported from other files

### Estimated Complexity

**Time Estimate**: 30-45 minutes  
**Complexity**: Low-Medium  
**Risk**: Low (straightforward API wrapper functions)

This story builds directly on Story 1.1's types. The main work is implementing fetch calls with proper error handling and auth headers.

### References

- [Story 1.1]: `docs/implementation-artifacts/1-1-create-typescript-type-definitions-for-listing-apis.md`
- [Backend API Reference]: `backend/API_REFERENCE.md`
- [PRD]: `docs/planning-artifacts/PRD-Frontend-Listing-Integration.md` - Section: "Technical Requirements"
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 1, Story 1.2

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript compilation verified with `npx tsc --noEmit` - 0 errors
- All 4 API functions implemented with proper typing
- Error handling implemented for all functions
- Auth headers included for favorite endpoints

### Completion Notes List

✅ Created `frontend/lib/api/listing.ts` with 4 exported functions:
- `getProductListing(endpoint, params)` - Fetches listings with query params using URLSearchParams
- `getProductDetail(slug)` - Fetches product by slug with 404 handling
- `toggleFavorite(productId, token)` - Toggles favorite with auth header
- `getUserFavorites(token, page, limit)` - Fetches user favorites with auth and pagination

All functions:
- Use `process.env.NEXT_PUBLIC_API_URL` with fallback to localhost:3000
- Return properly typed responses from `@/types/listing`
- Include comprehensive error handling with user-friendly messages
- Use async/await pattern (no .then/.catch)
- Auth endpoints include `Authorization: Bearer ${token}` header

### File List

- [x] `frontend/lib/api/listing.ts` - Created with all API service functions


---

## Additional Context for Developer

### Why This Story Matters

This is the core API integration layer that all listing pages will use. Getting this right ensures consistent API calls, proper error handling, and type safety across the entire application. All 8 listing routes depend on these functions.

### Implementation Strategy

**Recommended approach:**

1. Start with `getProductListing` - most complex, used by all listing pages
2. Then `getProductDetail` - simpler, single endpoint
3. Then `toggleFavorite` - adds auth header pattern
4. Finally `getUserFavorites` - combines listing + auth patterns

**Code organization:**
```typescript
// 1. Imports
import { ProductListResponse, ProductDetail, FavoriteToggleResponse } from '@/types/listing';

// 2. Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 3. Helper functions (if needed)
function buildQueryString(params: object): string { ... }

// 4. Exported API functions
export async function getProductListing(...) { ... }
export async function getProductDetail(...) { ... }
export async function toggleFavorite(...) { ... }
export async function getUserFavorites(...) { ... }
```

### Fetch API Best Practices

**Use native fetch (no axios needed):**
```typescript
const response = await fetch(url, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    // Add auth header if needed
  },
});
```

**Check response status:**
```typescript
if (!response.ok) {
  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
}
```

**Parse JSON:**
```typescript
const data: ProductListResponse = await response.json();
return data;
```

### Query String Building

**Use URLSearchParams for safety:**
```typescript
const params = new URLSearchParams();
if (subTypes) params.append('subTypes', subTypes);
if (sort) params.append('sort', sort);
if (page) params.append('page', page.toString());
if (limit) params.append('limit', limit.toString());

const queryString = params.toString();
const url = `${API_BASE_URL}${endpoint}?${queryString}`;
```

**Why URLSearchParams:**
- Handles encoding automatically
- Skips undefined/null values
- Produces clean query strings

### Auth Header Pattern

**For favorite endpoints:**
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

**Important:**
- Space between "Bearer" and token
- Token is JWT string from localStorage
- Don't include auth header for public endpoints

### Error Response Format

**Return consistent error objects:**
```typescript
{
  error: true,
  message: 'User-friendly error message',
  statusCode: 404  // Optional
}
```

**User-friendly messages:**
- 401: "Authentication required. Please log in."
- 404: "Product not found."
- 500: "Server error. Please try again later."
- Network: "Unable to connect. Check your internet connection."

### Environment Variable Setup

**Create `.env.local` if it doesn't exist:**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**For production:**
```
NEXT_PUBLIC_API_URL=https://api.taphoammo.com
```

**Check if variable is loaded:**
```typescript
console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
```

### Type Safety Tips

**Function signatures should be explicit:**
```typescript
export async function getProductListing(
  endpoint: string,
  params?: {
    subTypes?: string;
    sort?: 'popular' | 'price_asc' | 'price_desc';
    page?: number;
    limit?: number;
  }
): Promise<ProductListResponse> {
  // Implementation
}
```

**Use type guards for error handling:**
```typescript
if ('error' in response) {
  // Handle error
  return response;
}
// Handle success
return response;
```

### Common Issues and Solutions

**Issue:** "process.env.NEXT_PUBLIC_API_URL is undefined"
**Solution:** Restart dev server after adding .env.local

**Issue:** "CORS error when calling API"
**Solution:** Backend must allow frontend origin (already configured)

**Issue:** "401 Unauthorized on favorite endpoints"
**Solution:** Check token format - must be `Bearer ${token}`, not just token

**Issue:** "TypeScript error: Cannot find module '@/types/listing'"
**Solution:** Check tsconfig.json has path alias configured

### Testing Checklist

Manual testing after implementation:

1. **Import test:**
```typescript
import { getProductListing } from '@/lib/api/listing';
// Should have no TypeScript errors
```

2. **Type checking:**
```typescript
const result = await getProductListing('/products/email');
// result should have type ProductListResponse
// Autocomplete should show: result.data, result.meta, result.filters
```

3. **Compilation:**
```bash
npx tsc --noEmit
# Should show 0 errors
```

### Integration with Story 2.1

Story 2.1 will use these functions like this:

```typescript
import { getProductListing } from '@/lib/api/listing';

// In component
const [products, setProducts] = useState<ProductCard[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    const response = await getProductListing('/products/email', {
      sort: 'popular',
      page: 1,
      limit: 12
    });
    
    if ('error' in response) {
      // Handle error
      console.error(response.message);
    } else {
      setProducts(response.data);
    }
    setLoading(false);
  }
  
  fetchProducts();
}, []);
```

This shows why proper typing and error handling in this story is critical.

### Performance Considerations

**Not needed in this story, but good to know:**
- No caching yet (Story 1.2 scope is just API calls)
- No request deduplication (can add later if needed)
- No retry logic (can add later if needed)
- Keep it simple - just fetch and return

**Future optimizations (out of scope):**
- Add React Query for caching
- Add request cancellation for unmounted components
- Add retry logic for failed requests

### Security Notes

**Token handling:**
- Never log tokens to console
- Token comes from useAuth hook (existing)
- Token stored in localStorage (existing pattern)

**API URL:**
- Use environment variable (never hardcode)
- Validate URL format if needed
- Use HTTPS in production

### Estimated Line Count

Expected file size: ~150-200 lines including:
- Imports: ~5 lines
- Constants: ~2 lines
- Helper functions: ~10-20 lines
- 4 API functions: ~30-40 lines each
- Error handling: ~10-15 lines per function
- Comments: ~20-30 lines

Keep functions focused and readable. Each function should do one thing well.
