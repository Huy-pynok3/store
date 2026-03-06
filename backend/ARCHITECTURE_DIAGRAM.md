# Product Listing System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Product List │  │ Product      │  │ Favorites    │          │
│  │ Page         │  │ Detail Page  │  │ Page         │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          │ HTTP GET         │ HTTP GET         │ HTTP GET/POST
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼─────────────────┐
│                      BACKEND (NestJS)                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Controllers                            │   │
│  │  ┌────────────────┐  ┌────────────────┐                 │   │
│  │  │ Products       │  │ Services       │                 │   │
│  │  │ Controller     │  │ Controller     │                 │   │
│  │  │                │  │                │                 │   │
│  │  │ /products/*    │  │ /services/*    │                 │   │
│  │  └────────┬───────┘  └────────┬───────┘                 │   │
│  └───────────┼──────────────────┼──────────────────────────┘   │
│              │                  │                               │
│  ┌───────────▼──────────────────▼──────────────────────────┐   │
│  │                    Services                              │   │
│  │  ┌────────────────────────────────────────────────┐     │   │
│  │  │      ProductsListingService                    │     │   │
│  │  │                                                 │     │   │
│  │  │  • getProductList()                            │     │   │
│  │  │  • getProductBySlug()                          │     │   │
│  │  │  • toggleFavorite()                            │     │   │
│  │  │  • getUserFavorites()                          │     │   │
│  │  │  • getSubTypeCounts()                          │     │   │
│  │  └─────────────────────┬──────────────────────────┘     │   │
│  └────────────────────────┼────────────────────────────────┘   │
│                           │                                     │
│  ┌────────────────────────▼────────────────────────────────┐   │
│  │              Prisma Client (ORM)                        │   │
│  └────────────────────────┬────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    PostgreSQL Database                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Product    │  │ ProductPrice │  │ Product      │       │
│  │              │  │ Option       │  │ Feature      │       │
│  │ • id         │  │              │  │              │       │
│  │ • slug       │  │ • label      │  │ • content    │       │
│  │ • kind       │  │ • price      │  │ • sortOrder  │       │
│  │ • category   │  │ • stock      │  │              │       │
│  │ • subType    │  └──────────────┘  └──────────────┘       │
│  │ • stock      │                                            │
│  │ • sold       │  ┌──────────────┐  ┌──────────────┐       │
│  │ • rating     │  │ Product      │  │   Shop       │       │
│  │ • ...        │  │ Favorite     │  │              │       │
│  └──────────────┘  │              │  │ • name       │       │
│                    │ • userId     │  │ • rating     │       │
│                    │ • productId  │  │ • totalSales │       │
│                    └──────────────┘  └──────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

---

## Request Flow

### 1. Product Listing Request

```
Frontend                Controller              Service                Database
   │                       │                      │                      │
   │  GET /products/email  │                      │                      │
   │  ?subTypes=GMAIL      │                      │                      │
   │  &sort=popular        │                      │                      │
   │──────────────────────>│                      │                      │
   │                       │                      │                      │
   │                       │ getProductList()     │                      │
   │                       │─────────────────────>│                      │
   │                       │                      │                      │
   │                       │                      │ Query products       │
   │                       │                      │ WHERE kind=PRODUCT   │
   │                       │                      │ AND category=EMAIL   │
   │                       │                      │ AND subType IN (...)  │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │ Query total count    │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │ Query subType counts │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │<─────────────────────│
   │                       │                      │ Results              │
   │                       │                      │                      │
   │                       │ Map to response      │                      │
   │                       │ format               │                      │
   │                       │<─────────────────────│                      │
   │                       │                      │                      │
   │<──────────────────────│                      │                      │
   │  JSON Response        │                      │                      │
   │  {data, meta,         │                      │                      │
   │   filters}            │                      │                      │
```

### 2. Product Detail Request

```
Frontend                Controller              Service                Database
   │                       │                      │                      │
   │  GET /products/slug/  │                      │                      │
   │  gmail-new-usa        │                      │                      │
   │──────────────────────>│                      │                      │
   │                       │                      │                      │
   │                       │ getProductBySlug()   │                      │
   │                       │─────────────────────>│                      │
   │                       │                      │                      │
   │                       │                      │ Query product        │
   │                       │                      │ WHERE slug=...       │
   │                       │                      │ INCLUDE shop,        │
   │                       │                      │ features,            │
   │                       │                      │ priceOptions,        │
   │                       │                      │ favorites            │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │<─────────────────────│
   │                       │                      │ Product with         │
   │                       │                      │ relations            │
   │                       │                      │                      │
   │                       │<─────────────────────│                      │
   │                       │                      │                      │
   │<──────────────────────│                      │                      │
   │  Full product details │                      │                      │
```

### 3. Toggle Favorite Request

```
Frontend                Controller              Service                Database
   │                       │                      │                      │
   │  POST /products/      │                      │                      │
   │  {id}/favorite        │                      │                      │
   │  + JWT Token          │                      │                      │
   │──────────────────────>│                      │                      │
   │                       │                      │                      │
   │                       │ Auth Guard           │                      │
   │                       │ validates token      │                      │
   │                       │                      │                      │
   │                       │ toggleFavorite()     │                      │
   │                       │─────────────────────>│                      │
   │                       │                      │                      │
   │                       │                      │ Check if exists      │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │<─────────────────────│
   │                       │                      │ Exists? Yes/No       │
   │                       │                      │                      │
   │                       │                      │ If exists: DELETE    │
   │                       │                      │ If not: CREATE       │
   │                       │                      │─────────────────────>│
   │                       │                      │                      │
   │                       │                      │<─────────────────────│
   │                       │                      │ Success              │
   │                       │                      │                      │
   │                       │<─────────────────────│                      │
   │                       │                      │                      │
   │<──────────────────────│                      │                      │
   │  {success: true,      │                      │                      │
   │   isFavorite: bool}   │                      │                      │
```

---

## Data Model Relationships

```
┌─────────────┐
│    User     │
│             │
│ • id        │
│ • email     │
│ • username  │
│ • balance   │
└──────┬──────┘
       │ 1:1
       │
┌──────▼──────┐
│    Shop     │
│             │
│ • id        │
│ • userId    │
│ • name      │
│ • rating    │
└──────┬──────┘
       │ 1:N
       │
┌──────▼──────────────────────┐
│         Product             │
│                             │
│ • id                        │
│ • shopId                    │
│ • slug                      │
│ • kind (PRODUCT/SERVICE)    │
│ • category (EMAIL/...)      │
│ • subType (GMAIL/...)       │
│ • stock, sold, rating       │
└──────┬──────────────────────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │ 1:N         │ 1:N         │ 1:N         │ N:M
       │             │             │             │
┌──────▼──────┐ ┌───▼────────┐ ┌──▼─────────┐ ┌─▼──────────┐
│ Product     │ │ Product    │ │ Product    │ │ Product    │
│ Feature     │ │ Price      │ │ Favorite   │ │ Favorite   │
│             │ │ Option     │ │            │ │            │
│ • content   │ │ • label    │ │ • userId   │ │ • userId   │
│ • sortOrder │ │ • price    │ │ • productId│ │ • productId│
└─────────────┘ │ • stock    │ └────────────┘ └────────────┘
                └────────────┘
```

---

## Route to Category Mapping

```
┌──────────────────────────────────────────────────────────────┐
│                    Frontend Routes                            │
└──────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼────────┐                         ┌────────▼────────┐
│   PRODUCTS     │                         │    SERVICES     │
│                │                         │                 │
│ /san-pham/*    │                         │ /dich-vu/*      │
└───────┬────────┘                         └────────┬────────┘
        │                                           │
        │                                           │
   ┌────┴────┬────────┬────────┐          ┌────────┴────┬────────┬────────┐
   │         │        │        │          │             │        │        │
┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐    ┌──▼──┐      ┌──▼──┐  ┌──▼──┐  ┌──▼──┐
│email│  │phan-│  │tai- │  │khac │    │tang-│      │phan-│  │block│  │khac │
│     │  │mem  │  │khoan│  │     │    │tuong│      │mem  │  │chain│  │     │
└──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘    │-tac │      └──┬──┘  └──┬──┘  └──┬──┘
   │        │        │        │       └──┬──┘         │        │        │
   │        │        │        │          │            │        │        │
┌──▼────────▼────────▼────────▼──────────▼────────────▼────────▼────────▼──┐
│                         Backend API Endpoints                             │
│                                                                            │
│  GET /products/email          GET /services/engagement                    │
│  GET /products/software       GET /services/software                      │
│  GET /products/account        GET /services/blockchain                    │
│  GET /products/other          GET /services/other                         │
└────────────────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    Database Query                           │
│                                                             │
│  WHERE kind = 'PRODUCT'/'SERVICE'                          │
│  AND category = 'EMAIL'/'PRODUCT_SOFTWARE'/...             │
│  AND subType IN (selected subtypes)                        │
│  ORDER BY (sort option)                                    │
│  LIMIT/OFFSET (pagination)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Filter & Sort Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼────────┐   ┌───────▼────────┐
│ Sidebar Filter │   │   Sort Tabs     │   │  Pagination    │
│                │   │                 │   │                │
│ ☑ Gmail        │   │ • Popular       │   │  Page: 1       │
│ ☑ Hotmail      │   │ • Price ↑       │   │  Limit: 12     │
│ ☐ Outlook      │   │ • Price ↓       │   │                │
└───────┬────────┘   └────────┬────────┘   └───────┬────────┘
        │                     │                     │
        │ subTypes=           │ sort=               │ page=1
        │ GMAIL,HOTMAIL       │ popular             │ limit=12
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    Query Parameters                         │
│                                                             │
│  ?subTypes=GMAIL,HOTMAIL&sort=popular&page=1&limit=12      │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    Backend Processing                       │
│                                                             │
│  1. Parse query params                                     │
│  2. Build WHERE clause (kind, category, subTypes)          │
│  3. Build ORDER BY clause (sort)                           │
│  4. Apply pagination (skip, take)                          │
│  5. Execute parallel queries:                              │
│     • Products with filters                                │
│     • Total count                                          │
│     • SubType counts (all types)                           │
│  6. Map to response format                                 │
└─────────────────────────────┬──────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    Response                                 │
│                                                             │
│  {                                                          │
│    data: [...products...],                                 │
│    meta: {page, limit, total, totalPages},                 │
│    filters: {subTypeCounts: [...]}                         │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                    Request Received                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────▼──────────────────────────────┐
│              Parallel Query Execution                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Query 1    │  │   Query 2    │  │   Query 3    │     │
│  │              │  │              │  │              │     │
│  │  Products    │  │  Total       │  │  SubType     │     │
│  │  with        │  │  Count       │  │  Counts      │     │
│  │  filters     │  │              │  │              │     │
│  │              │  │              │  │              │     │
│  │  Uses:       │  │  Uses:       │  │  Uses:       │     │
│  │  • Index on  │  │  • Index on  │  │  • Index on  │     │
│  │    kind      │  │    kind      │  │    kind      │     │
│  │  • Index on  │  │  • Index on  │  │  • Index on  │     │
│  │    category  │  │    category  │  │    category  │     │
│  │  • Index on  │  │  • Index on  │  │  • GROUP BY  │     │
│  │    subType   │  │    isActive  │  │    subType   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│         └─────────────────┴─────────────────┘              │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │
                            │ All queries complete
                            │ in parallel
                            │
┌───────────────────────────▼────────────────────────────────┐
│                    Combine Results                          │
│                                                             │
│  • Map products to response format                         │
│  • Calculate priceMin/priceMax from options                │
│  • Add pagination meta                                     │
│  • Add subType counts                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                    Response < 500ms
```

---

## Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Public Endpoints                          │
│                                                             │
│  GET /products/*                                            │
│  GET /services/*                                            │
│  GET /products/slug/:slug                                   │
│                                                             │
│  ✓ No authentication required                              │
│  ✓ isFavorite always false                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Protected Endpoints                         │
│                                                             │
│  POST /products/:id/favorite                                │
│  GET /users/me/favorites                                    │
│                                                             │
│  1. Request includes JWT token                             │
│  2. JwtAuthGuard validates token                           │
│  3. Extract userId from token                              │
│  4. Use userId in query                                    │
│  5. Return user-specific data                              │
│                                                             │
│  ✗ Without token → 401 Unauthorized                        │
│  ✓ With valid token → Process request                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Efficient parallel query execution
- ✅ Proper use of database indexes
- ✅ Type-safe TypeScript code
- ✅ Authentication on protected routes
- ✅ Frontend-friendly response format
- ✅ Scalable design for future enhancements

**Key Design Decisions:**
1. Parallel queries for performance
2. Calculated priceMin/priceMax (not stored)
3. SubType counts always show all types
4. Favorites require authentication
5. Fixed enums for categories (not dynamic)
6. Backward compatible with existing Product system
