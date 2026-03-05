# Marketplace Platform

Nền tảng thương mại điện tử chuyên về tài khoản game, phần mềm, dịch vụ MMO và các sản phẩm số.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Queue**: BullMQ
- **Authentication**: JWT + Google OAuth
- **Security**: Cloudflare Turnstile, bcrypt

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + SweetAlert2
- **State Management**: React Context

## 📦 Project Structure

```
taphoammo/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/    # Authentication & Authorization
│   │   │   ├── users/   # User management
│   │   │   ├── shops/   # Shop management
│   │   │   ├── products/# Product catalog
│   │   │   ├── orders/  # Order processing
│   │   │   └── admin/   # Admin features
│   │   ├── queues/      # Background jobs
│   │   ├── cache/       # Redis caching
│   │   └── database/    # Database utilities
│   └── prisma/          # Database schema & migrations
│
├── frontend/            # Next.js App
│   ├── app/            # App Router pages
│   ├── components/     # Reusable components
│   ├── lib/           # Utilities & helpers
│   └── public/        # Static assets
│
├── docs/              # Documentation
│   ├── planning-artifacts/      # Epics & stories
│   └── implementation-artifacts/# Implementation docs
│
└── deploy/           # Deployment configs
    ├── deploy/       # Full stack on EC2
    └── deploy-vercel/# Backend EC2 + Frontend Vercel
```

## ✅ Implemented Features

### Authentication & User Management
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Google OAuth integration
- ✅ Remember login (24h vs 7d JWT)
- ✅ Cloudflare Turnstile bot protection
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Success toast notifications

### Shop Management
- ✅ Shop creation and setup
- ✅ Shop profile management
- ✅ Shop dashboard
- ✅ Product listing management

### Product Catalog
- ✅ Product CRUD operations
- ✅ Product categories (Account, Software, Email, Service, Other)
- ✅ Product inventory management
- ✅ Auto-delivery system
- ✅ Product images upload

### Order System
- ✅ Order creation
- ✅ Order status tracking
- ✅ Order history

### UI/UX
- ✅ Responsive design
- ✅ Split login/register page
- ✅ Product browsing interface
- ✅ Shop management interface
- ✅ User account page

## 🚧 Features In Progress

### Payment Integration
- ⏳ Bank transfer integration
- ⏳ MoMo payment gateway
- ⏳ ZaloPay integration
- ⏳ Payment verification
- ⏳ Auto balance update

### Advanced Shop Features
- ⏳ Shop analytics dashboard
- ⏳ Sales reports
- ⏳ Revenue tracking
- ⏳ Customer management

### Order Management
- ⏳ Order cancellation
- ⏳ Refund processing
- ⏳ Dispute resolution
- ⏳ Order notifications (email/SMS)

### User Features
- ⏳ Wallet/Balance system
- ⏳ Transaction history
- ⏳ Purchase history with details
- ⏳ Wishlist/Favorites
- ⏳ Product reviews & ratings

## 📋 Planned Features

### Security & Verification
- 📅 Two-factor authentication (2FA)
- 📅 Email verification
- 📅 Phone verification
- 📅 Password reset flow
- 📅 Account recovery
- 📅 Rate limiting
- 📅 IP blocking

### Advanced Features
- 📅 Real-time chat system
- 📅 Notification system
- 📅 Search with filters
- 📅 Advanced product filtering
- 📅 Product recommendations
- 📅 Seller verification system
- 📅 Escrow system
- 📅 Affiliate program

### Admin Panel
- 📅 User management
- 📅 Shop approval system
- 📅 Product moderation
- 📅 Transaction monitoring
- 📅 System analytics
- 📅 Report management
- 📅 Ban/suspend users

### Mobile App
- 📅 React Native mobile app
- 📅 Push notifications
- 📅 Mobile-optimized checkout

### API & Integration
- 📅 Public API for developers
- 📅 Webhook system
- 📅 Third-party integrations
- 📅 Export/Import tools

## 🛠️ Development Setup

### Prerequisites
- Node.js 20.x
- PostgreSQL 16
- Redis 7
- npm or yarn

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Start development server
npm run start:dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Database Setup

```bash
# Start PostgreSQL and Redis with Docker
cd backend
docker-compose up -d

# Or install locally
# PostgreSQL: https://www.postgresql.org/download/
# Redis: https://redis.io/download/
```

## 🚀 Deployment

### Option 1: Full Stack on EC2
See [deploy/README.md](deploy/README.md)

### Option 2: Backend EC2 + Frontend Vercel
See [deploy-vercel/README.md](deploy-vercel/README.md)

Quick start: [deploy-vercel/QUICK-START.md](deploy-vercel/QUICK-START.md)

## 📚 Documentation

- [Epics & Stories](docs/planning-artifacts/epics.md)
- [Sprint Status](docs/implementation-artifacts/sprint-status.yaml)
- [Implementation Artifacts](docs/implementation-artifacts/)

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/marketplace
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
NEXT_PUBLIC_TURNSTILE_ENABLED=true
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:watch
npm run test:cov

# Frontend tests (when implemented)
cd frontend
npm run test
```

## 📝 API Documentation

API documentation available at: `http://localhost:3001/api/docs` (when Swagger is configured)

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

**Users**
- `GET /api/users/profile` - Get user profile
- `PATCH /api/users/profile` - Update profile

**Shops**
- `POST /api/shops` - Create shop
- `GET /api/shops/:id` - Get shop details
- `PATCH /api/shops/:id` - Update shop

**Products**
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product details
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Orders**
- `POST /api/orders` - Create order
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- Product Owner: [Name]
- Scrum Master: [Name]
- Developers: [Names]

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact: 
---

**Status**: 🟡 In Active Development

**Current Sprint**: Epic 1 - User Authentication & Account Access

**Last Updated**: March 5, 2026
