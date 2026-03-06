# Hướng dẫn Deploy Backend lên Render

## Bước 1: Chuẩn bị Database PostgreSQL

### 1.1. Tạo PostgreSQL Database trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Điền thông tin:
   - **Name**: `marketplace-db` (hoặc tên bạn muốn)
   - **Database**: `marketplace`
   - **User**: `marketplace_user`
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Plan**: Free (hoặc Starter nếu cần)
4. Click **Create Database**
5. Sau khi tạo xong, copy **Internal Database URL** (dạng `postgresql://...`)

---

## Bước 2: Tạo Redis Instance (Optional - cho Cache & Queue)

### 2.1. Tạo Redis trên Render

1. Click **New +** → **Redis**
2. Điền thông tin:
   - **Name**: `marketplace-redis`
   - **Region**: Singapore
   - **Plan**: Free
3. Click **Create Redis**
4. Copy **Internal Redis URL** (dạng `redis://...`)

> **Lưu ý**: Nếu không dùng Redis, bạn cần disable cache và queue trong code.

---

## Bước 3: Deploy Backend Web Service

### 3.1. Tạo Web Service

1. Click **New +** → **Web Service**
2. Chọn repository GitHub của bạn
3. Điền thông tin:
   - **Name**: `marketplace-backend`
   - **Region**: Singapore
   - **Branch**: `main` (hoặc branch bạn muốn)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (hoặc Starter)

### 3.2. Cấu hình Environment Variables

Trong phần **Environment**, thêm các biến sau:

```bash
# Database
DATABASE_URL=<Internal Database URL từ bước 1>

# Redis (nếu có)
REDIS_URL=<Redis URL từ bước 2, ví dụ: redis://red-xxx:6379 hoặc redis://password@red-xxx:6379>

# JWT
JWT_SECRET=<random-string-ít-nhất-32-ký-tự>
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=production

# Frontend URL (thay bằng URL frontend của bạn)
FRONTEND_URL=https://your-frontend.vercel.app

# Cloudflare Turnstile (optional)
TURNSTILE_SITE_KEY=your-site-key
TURNSTILE_SECRET_KEY=your-secret-key
TURNSTILE_ENABLED=false

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=https://marketplace-backend.onrender.com/api/auth/google/callback
```

### 3.3. Tạo JWT Secret

Chạy lệnh sau để tạo JWT secret ngẫu nhiên:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4. Deploy

1. Click **Create Web Service**
2. Render sẽ tự động build và deploy
3. Đợi khoảng 5-10 phút

---

## Bước 4: Chạy Database Migration

### 4.1. Kết nối SSH vào Render

Sau khi deploy xong, vào **Shell** tab trong Render dashboard và chạy:

```bash
npx prisma migrate deploy
```

### 4.2. Seed Database (Optional)

Nếu muốn tạo dữ liệu mẫu:

```bash
npm run prisma:seed
```

---

## Bước 5: Kiểm tra Deployment

### 5.1. Test API

Mở trình duyệt và truy cập:

```
https://marketplace-backend.onrender.com/api
```

Bạn sẽ thấy response từ API.

### 5.2. Test Health Check

```
https://marketplace-backend.onrender.com/api/health
```

---

## Bước 6: Cấu hình Frontend

Cập nhật `NEXT_PUBLIC_API_URL` trong frontend:

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://marketplace-backend.onrender.com/api
```

---

## Troubleshooting

### Lỗi: "Cannot connect to database"

- Kiểm tra `DATABASE_URL` có đúng không
- Đảm bảo database đã được tạo
- Kiểm tra region của database và web service có giống nhau không

### Lỗi: "Prisma Client not generated"

Thêm vào build command:

```bash
npm install && npm run prisma:generate && npm run build
```

### Lỗi: "Port already in use"

Render tự động gán port, đảm bảo code của bạn dùng `process.env.PORT`:

```typescript
// main.ts
const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
```

### Free Plan Sleep Mode

Render free plan sẽ sleep sau 15 phút không hoạt động. Để giữ service luôn active:

1. Upgrade lên Starter plan ($7/tháng)
2. Hoặc dùng cron job ping service mỗi 10 phút

---

## Monitoring & Logs

### Xem Logs

1. Vào Render dashboard
2. Chọn service `marketplace-backend`
3. Click tab **Logs**

### Metrics

Tab **Metrics** hiển thị:
- CPU usage
- Memory usage
- Request count
- Response time

---

## Auto Deploy

Render tự động deploy khi bạn push code lên GitHub branch đã cấu hình.

Để tắt auto deploy:
1. Vào **Settings**
2. Tắt **Auto-Deploy**

---

## Backup Database

### Manual Backup

```bash
# Từ local machine
pg_dump <DATABASE_URL> > backup.sql
```

### Restore

```bash
psql <DATABASE_URL> < backup.sql
```

---

## Cost Estimate

| Service | Plan | Cost |
|---------|------|------|
| PostgreSQL | Free | $0 |
| Redis | Free | $0 |
| Web Service | Free | $0 |
| **Total** | | **$0/month** |

Free plan limitations:
- Database: 1GB storage, 97 hours/month
- Redis: 25MB storage
- Web Service: 750 hours/month, sleeps after 15min inactivity

Để production, nên upgrade:
- PostgreSQL Starter: $7/month (10GB)
- Redis Starter: $10/month (100MB)
- Web Service Starter: $7/month (always on)
- **Total**: ~$24/month

---

## Next Steps

1. ✅ Deploy backend lên Render
2. ✅ Cấu hình database và Redis
3. ✅ Chạy migration
4. ⬜ Deploy frontend lên Vercel
5. ⬜ Cấu hình custom domain
6. ⬜ Setup monitoring và alerts
7. ⬜ Cấu hình CI/CD pipeline

---

## Support

Nếu gặp vấn đề, check:
- [Render Docs](https://render.com/docs)
- [NestJS Deployment Guide](https://docs.nestjs.com/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
