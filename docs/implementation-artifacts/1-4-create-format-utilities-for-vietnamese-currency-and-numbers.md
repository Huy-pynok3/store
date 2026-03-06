# Story 1.4: Create Format Utilities for Vietnamese Currency and Numbers

Status: review

## Story

As a **developer**,
I want **utility functions to format numbers and currency in Vietnamese style**,
So that **all displayed values are consistent and properly formatted**.

## Acceptance Criteria

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

## Tasks / Subtasks

- [x] Create `frontend/lib/utils/format.ts` file (AC: All)
  - [x] Implement `formatVND(amount)` function
  - [x] Implement `formatPriceRange(min, max)` function
  - [x] Implement `formatNumber(num)` function
  - [x] Implement `formatPercent(num)` function
  - [x] Add edge case handling (null, undefined, 0)
  - [x] Export all functions

## Dev Notes

### Critical Requirements

1. **File Location**: Create new file at `frontend/lib/utils/format.ts`
2. **Vietnamese Format**: Use dot (.) as thousand separator, not comma
3. **Currency Symbol**: Use đ (Vietnamese dong symbol)
4. **Edge Cases**: Handle null, undefined, 0 gracefully
5. **Type Safety**: Type all parameters and return values

### Vietnamese Number Formatting

**Thousand separator:** Dot (.)
- 3000 → "3.000"
- 108851 → "108.851"

**Currency:** đ symbol after number
- 3000 → "3.000đ"

**Price range:** Space-dash-space between values
- 3000-17000 → "3.000 - 17.000đ"
- 5000-5000 → "5.000đ" (single value if equal)

### Function Specifications

#### 1. formatVND(amount)
```typescript
formatVND(3000) → "3.000đ"
formatVND(108851) → "108.851đ"
formatVND(0) → "0đ"
formatVND(null) → "0đ"
```

#### 2. formatPriceRange(min, max)
```typescript
formatPriceRange(3000, 17000) → "3.000 - 17.000đ"
formatPriceRange(5000, 5000) → "5.000đ"
formatPriceRange(0, 0) → "0đ"
```

#### 3. formatNumber(num)
```typescript
formatNumber(108851) → "108.851"
formatNumber(8261) → "8.261"
formatNumber(0) → "0"
```

#### 4. formatPercent(num)
```typescript
formatPercent(0.0) → "0.0%"
formatPercent(1.5) → "1.5%"
formatPercent(0) → "0.0%"
```

### Implementation Pattern

```typescript
export function formatVND(amount: number | null | undefined): string {
  const value = amount ?? 0;
  return `${formatNumber(value)}đ`;
}

export function formatNumber(num: number | null | undefined): string {
  const value = num ?? 0;
  return value.toLocaleString('vi-VN');
}
```

### Previous Story Context

**Story 1.2 completed:**
- API service layer returns raw numbers (priceMin, priceMax, complaintPercent)
- These utilities will format those numbers for display

**Story 2.1 will use these:**
- Map backend priceMin/priceMax to formatted priceRange
- Map backend complaintPercent to formatted complaints
- Display formatted stock, sold, reviews numbers

### References

- [PRD]: `docs/planning-artifacts/PRD-Frontend-Listing-Integration.md` - Data Mapping Requirements
- [Epic]: `docs/planning-artifacts/epics.md` - Epic 1, Story 1.4

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5

### Debug Log References

- TypeScript compilation verified - 0 errors
- Vietnamese locale formatting (vi-VN) used
- All edge cases handled (null, undefined, 0)

### Completion Notes List

✅ Created `frontend/lib/utils/format.ts` with 4 functions:
- `formatNumber(num)` - Uses toLocaleString('vi-VN') for dot separator
- `formatVND(amount)` - Adds đ symbol after formatted number
- `formatPriceRange(min, max)` - Returns single price if equal, range otherwise
- `formatPercent(num)` - Formats with one decimal place

All functions handle null/undefined by defaulting to 0.

### File List

- [x] `frontend/lib/utils/format.ts` - Created with format utilities
