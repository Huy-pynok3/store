# API Reference - Product Listing System

## Base URL
```
http://localhost:3000
```

## Authentication
Some endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Product Listing Endpoints

### 1. Get Email Products
```http
GET /products/email
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| subTypes | string | No | - | Comma-separated list (e.g., "GMAIL,HOTMAIL") |
| sort | string | No | popular | "popular", "price_asc", "price_desc" |
| page | number | No | 1 | Page number |
| limit | number | No | 12 | Items per page |

**Example Request:**
```bash
curl "http://localhost:3000/products/email?subTypes=GMAIL,HOTMAIL&sort=popular&page=1&limit=12"
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clx123abc",
      "slug": "gmail-new-usa-reg-ios",
      "title": "Gmail New USA, hàng ngon, Reg IOS đã nghỉ >15 ngày",
      "image": "https://picsum.photos/seed/gmail1/400/300",
      "badgeText": "KHÔNG TRÙNG",
      "sellerName": "leelangymail",
      "stock": 8261,
      "priceMin": 3000,
      "priceMax": 17000,
      "rating": 4.0,
      "reviewCount": 128,
      "completedOrders": 108851,
      "complaintPercent": 0.0,
      "features": [
        "Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English",
        "Gmail USA chất lượng cao, tạo từ IP USA",
        "Tên tiếng Anh, thông tin người dùng thật"
      ],
      "isFavorite": false
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 816,
    "totalPages": 68
  },
  "filters": {
    "subTypeCounts": [
      { "value": "GMAIL", "label": "Gmail", "count": 15 },
      { "value": "HOTMAIL", "label": "Hotmail", "count": 8 },
      { "value": "OUTLOOKMAIL", "label": "OutlookMail", "count": 12 }
    ]
  }
}
```

---

### 2. Get Software Products
```http
GET /products/software
```

Same query parameters and response format as email products.

**Available SubTypes:**
- WINDOWS_SOFTWARE
- MAC_SOFTWARE
- MOBILE_APP
- WEB_APP
- OTHER_SOFTWARE

---

### 3. Get Account Products
```http
GET /products/account
```

Same query parameters and response format.

**Available SubTypes:**
- SOCIAL_ACCOUNT
- GAMING_ACCOUNT
- STREAMING_ACCOUNT
- OTHER_ACCOUNT

---

### 4. Get Other Products
```http
GET /products/other
```

Same query parameters and response format.

**Available SubTypes:**
- GENERAL_OTHER

---

## Service Listing Endpoints

### 5. Get Engagement Services
```http
GET /services/engagement
```

Same query parameters and response format as products.

**Available SubTypes:**
- FACEBOOK_ENGAGEMENT
- INSTAGRAM_ENGAGEMENT
- TIKTOK_ENGAGEMENT
- YOUTUBE_ENGAGEMENT
- OTHER_ENGAGEMENT

---

### 6. Get Software Services
```http
GET /services/software
```

**Available SubTypes:**
- CUSTOM_SOFTWARE_DEV
- API_INTEGRATION
- OTHER_SERVICE_SOFTWARE

---

### 7. Get Blockchain Services
```http
GET /services/blockchain
```

**Available SubTypes:**
- BLOCKCHAIN_DEV
- SMART_CONTRACT
- NFT_SERVICE
- OTHER_BLOCKCHAIN

---

### 8. Get Other Services
```http
GET /services/other
```

**Available SubTypes:**
- GENERAL_OTHER

---

## Product Detail Endpoint

### 9. Get Product by Slug
```http
GET /products/slug/:slug
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Product slug (e.g., "gmail-new-usa-reg-ios") |

**Example Request:**
```bash
curl http://localhost:3000/products/slug/gmail-new-usa-reg-ios
```

**Response:** `200 OK`
```json
{
  "id": "clx123abc",
  "slug": "gmail-new-usa-reg-ios",
  "name": "Gmail New USA, hàng ngon, Reg IOS đã nghỉ >15 ngày",
  "description": "Gmail USA - reg iOS | New 15-30 ngày (OLD)...",
  "shortDescription": "Gmail USA chất lượng cao, tạo từ IP USA",
  "badgeText": "KHÔNG TRÙNG",
  "kind": "PRODUCT",
  "category": "EMAIL",
  "subType": "GMAIL",
  "images": ["https://picsum.photos/seed/gmail1/400/300"],
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
      "content": "Gmail USA - reg iOS | New 15-30 ngày (OLD) | IP USA, Name English",
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
    },
    {
      "id": "clx345mno",
      "label": "10 tài khoản",
      "price": 27000,
      "stock": 826,
      "isActive": true
    }
  ],
  "isFavorite": false,
  "createdAt": "2024-03-05T10:30:00.000Z",
  "updatedAt": "2024-03-06T08:15:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

---

## Favorite Endpoints

### 10. Toggle Favorite
```http
POST /products/:id/favorite
```

**Authentication:** Required (JWT)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Example Request:**
```bash
curl -X POST http://localhost:3000/products/clx123abc/favorite \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
{
  "success": true,
  "isFavorite": true
}
```

**Second Call (Toggle Off):**
```json
{
  "success": true,
  "isFavorite": false
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

### 11. Get User Favorites
```http
GET /users/me/favorites
```

**Authentication:** Required (JWT)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 12 | Items per page |

**Example Request:**
```bash
curl http://localhost:3000/users/me/favorites?page=1&limit=12 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "clx123abc",
      "slug": "gmail-new-usa-reg-ios",
      "title": "Gmail New USA...",
      "image": "https://...",
      "badgeText": "KHÔNG TRÙNG",
      "sellerName": "leelangymail",
      "stock": 8261,
      "priceMin": 3000,
      "priceMax": 17000,
      "rating": 4.0,
      "reviewCount": 128,
      "completedOrders": 108851,
      "complaintPercent": 0.0,
      "features": ["..."],
      "isFavorite": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## Sort Options

| Value | Description | Behavior |
|-------|-------------|----------|
| `popular` | Most popular first | Sort by `completedOrders DESC`, then `sold DESC` |
| `price_asc` | Lowest price first | Sort by minimum price ascending |
| `price_desc` | Highest price first | Sort by maximum price descending |

---

## SubType Values

### Email (EMAIL category)
- `GMAIL` - Gmail
- `HOTMAIL` - Hotmail
- `OUTLOOKMAIL` - OutlookMail
- `IUUMAIL` - IuuMail
- `DOMAINMAIL` - DomainMail
- `YAHOOMAIL` - YahooMail
- `PROTONMAIL` - ProtonMail
- `OTHER_MAIL` - Loại Mail Khác

### Software (PRODUCT_SOFTWARE category)
- `WINDOWS_SOFTWARE` - Windows Software
- `MAC_SOFTWARE` - Mac Software
- `MOBILE_APP` - Mobile App
- `WEB_APP` - Web App
- `OTHER_SOFTWARE` - Phần mềm khác

### Account (ACCOUNT category)
- `SOCIAL_ACCOUNT` - Tài khoản mạng xã hội
- `GAMING_ACCOUNT` - Tài khoản game
- `STREAMING_ACCOUNT` - Tài khoản streaming
- `OTHER_ACCOUNT` - Tài khoản khác

### Engagement (ENGAGEMENT category)
- `FACEBOOK_ENGAGEMENT` - Facebook
- `INSTAGRAM_ENGAGEMENT` - Instagram
- `TIKTOK_ENGAGEMENT` - TikTok
- `YOUTUBE_ENGAGEMENT` - YouTube
- `OTHER_ENGAGEMENT` - Dịch vụ khác

### Blockchain (BLOCKCHAIN category)
- `BLOCKCHAIN_DEV` - Blockchain Development
- `SMART_CONTRACT` - Smart Contract
- `NFT_SERVICE` - NFT Service
- `OTHER_BLOCKCHAIN` - Blockchain khác

### Service Software (SERVICE_SOFTWARE category)
- `CUSTOM_SOFTWARE_DEV` - Custom Software
- `API_INTEGRATION` - API Integration
- `OTHER_SERVICE_SOFTWARE` - Dịch vụ phần mềm khác

---

## Error Responses

### 400 Bad Request
Invalid query parameters or request body.
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
Missing or invalid authentication token.
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
Resource not found.
```json
{
  "statusCode": 404,
  "message": "Product not found"
}
```

### 500 Internal Server Error
Server error.
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented. Consider adding if needed:
- Recommended: 100 requests per minute per IP
- Use `@nestjs/throttler` package

---

## Pagination

All listing endpoints support pagination:
- Default `limit`: 12
- Maximum `limit`: 100 (recommended)
- `page` starts at 1

**Meta Response:**
```json
{
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 816,
    "totalPages": 68
  }
}
```

---

## Performance

Expected response times:
- Listing endpoints: < 500ms
- Detail endpoint: < 200ms
- Favorite toggle: < 100ms

If slower, consider:
- Adding Redis caching
- Optimizing database queries
- Adding database indexes

---

## Testing

Use the provided `TESTING_GUIDE.md` for comprehensive test scenarios.

Quick test:
```bash
# Test all endpoints
curl http://localhost:3000/products/email
curl http://localhost:3000/products/software
curl http://localhost:3000/services/engagement
curl http://localhost:3000/products/slug/gmail-new-usa-reg-ios
```

---

## Postman Collection

Import this collection for easy testing:

1. Create new collection "Product Listing API"
2. Add environment variable `baseUrl` = `http://localhost:3000`
3. Add environment variable `token` = (your JWT token)
4. Add requests from this reference
5. Use `{{baseUrl}}` and `{{token}}` in requests

---

## Support

For issues or questions:
1. Check `TESTING_GUIDE.md` for troubleshooting
2. Review `LISTING_IMPLEMENTATION.md` for details
3. Check server logs for errors
4. Use `npx prisma studio` to inspect database
