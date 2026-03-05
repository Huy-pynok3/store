# Backend API - Marketplace

NestJS + Prisma + PostgreSQL + Redis backend cho marketplace.

## Setup

### 1. Start PostgreSQL & Redis với Docker

```bash
cd backend
docker-compose up -d
```

Hoặc cài đặt PostgreSQL và Redis riêng lẻ.

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Setup environment

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

File `.env` đã có config sẵn cho Docker:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/marketplace?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this
```

#### Google OAuth Setup (Optional)

Nếu muốn enable Google login:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API và Google Identity API
4. Tạo OAuth 2.0 Client ID credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
5. Copy Client ID và Client Secret vào `.env`:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
```

### 4. Chạy migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Start server

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server sẽ chạy tại `http://localhost:3001/api`

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Users
- `GET /api/users/me` - Thông tin user (requires auth)

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm (requires auth)
- `PATCH /api/products/:id` - Cập nhật sản phẩm (requires auth)

### Orders
- `POST /api/orders` - Tạo đơn hàng (requires auth)
- `GET /api/orders` - Danh sách đơn hàng (requires auth)
- `GET /api/orders/:id` - Chi tiết đơn hàng (requires auth)

### Shops
- `POST /api/shops` - Tạo shop (requires auth)
- `GET /api/shops/my-shop` - Shop của mình (requires auth)
- `GET /api/shops/:id` - Chi tiết shop
- `PATCH /api/shops` - Cập nhật shop (requires auth)

## Database Schema

### Key Features

1. **Transaction Safety**: Order processing dùng Prisma transactions
2. **Stock Management**: Automatic stock decrement với row locking
3. **Purchase Tracking**: Unique constraint ngăn mua trùng sản phẩm
4. **Balance System**: Transaction log cho mọi thay đổi số dư
5. **Inventory System**: Quản lý data sản phẩm (account, license key, etc.)

## Prisma Studio

Xem database qua GUI:

```bash
npm run prisma:studio
```

## Redis + BullMQ Features

### Queue System

3 queues đã được setup:
- `orders`: Xử lý order processing, delivery, stock check
- `emails`: Gửi email (welcome, confirmation, delivery)
- `notifications`: Push notifications

### Background Jobs

Order processing tự động:
1. User tạo order → Job `process-order` được add vào queue
2. Order được xử lý → Status chuyển sang PROCESSING
3. Nếu auto-deliver enabled → Job `deliver-order` được trigger
4. Email confirmation được gửi tự động

### Caching

Redis cache cho:
- Products (5 phút TTL)
- Products list (1 phút TTL)
- Users (10 phút TTL)
- Shops (5 phút TTL)
- Orders (3 phút TTL)
- Sessions (24 giờ TTL)

Cache tự động invalidate khi data thay đổi.

### Admin Queue Management

```bash
GET /api/admin/queues/stats
```

Xem stats của các queues (requires ADMIN role).

## Next Steps

- [ ] Add file upload (Cloudinary/S3)
- [ ] Add payment gateway integration (Momo, ZaloPay, VNPay)
- [ ] Integrate email service (SendGrid, AWS SES)
- [ ] Add 2FA authentication
- [ ] Add rate limiting per user
- [ ] Add webhook handlers
- [ ] Add analytics & reporting
