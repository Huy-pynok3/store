# Deploy Steps - Từng Bước Chi Tiết

## Chuẩn Bị (Trên Local)

### 1. Generate Secrets

```bash
cd backend
npm run deploy:secrets
```

Copy các secrets được generate, bạn sẽ cần chúng ở bước sau.

### 2. Check Environment (Optional)

```bash
npm run deploy:check
```

### 3. Test Build

```bash
npm run build
```

Đảm bảo build thành công trước khi deploy.

---

## Deploy lên Render

### Bước 1: Tạo PostgreSQL Database

1. Đăng nhập [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Điền:
   ```
   Name: marketplace-db
   Database: marketplace
   User: marketplace_user
   Region: Singapore
   Plan: Free
   ```
4. Click **Create Database**
5. Đợi database được tạo (1-2 phút)
6. Copy **Internal Database URL** (tab Connect)

---

### Bước 2: Tạo Redis (Optional)

1. Click **New +** → **Redis**
2. Điền:
   ```
   Name: marketplace-redis
   Region: Singapore
   Plan: Free
   ```
3. Click **Create Redis**
4. Copy **Internal Redis URL**

---

### Bước 3: Deploy Backend Web Service

#### 3.1. Tạo Service

1. Click **New +** → **Web Service**
2. Connect GitHub repository
3. Chọn repository của bạn
4. Click **Connect**

#### 3.2. Cấu hình Service

Điền các thông tin sau:

```
Name: marketplace-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run prisma:generate && npm run build
Start Command: npm run start:prod
Plan: Free
```

#### 3.3. Advanced Settings

Scroll xuống **Advanced** và set:

```
Health Check Path: /api/health
```

#### 3.4. Environment Variables

Click **Add Environment Variable** và thêm từng biến sau:

**Required:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste Internal Database URL từ bước 1 |
| `JWT_SECRET` | Paste secret từ `npm run deploy:secrets` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `FRONTEND_URL` | `http://localhost:3000` (tạm thời, sẽ update sau) |

**Optional (nếu có Redis):**

| Key | Value |
|-----|-------|
| `REDIS_URL` | Redis URL từ Render (ví dụ: `redis://red-xxx:6379` hoặc `redis://password@red-xxx:6379`) |

**Optional (nếu dùng Google OAuth):**

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | Your Google Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google Client Secret |
| `GOOGLE_CALLBACK_URL` | `https://marketplace-backend.onrender.com/api/auth/google/callback` |

#### 3.5. Deploy

1. Click **Create Web Service**
2. Render sẽ bắt đầu build
3. Đợi 5-10 phút cho build hoàn thành
4. Check logs để đảm bảo không có error

---

### Bước 4: Run Database Migration

#### 4.1. Mở Shell

1. Trong Render dashboard, chọn service `marketplace-backend`
2. Click tab **Shell** (bên cạnh Logs)
3. Đợi shell khởi động

#### 4.2. Deploy Migrations

Trong shell, chạy:

```bash
npx prisma migrate deploy
```

Đợi migrations chạy xong.

#### 4.3. Seed Database (Optional)

Nếu muốn tạo dữ liệu mẫu:

```bash
npm run prisma:seed
```

---

### Bước 5: Verify Deployment

#### 5.1. Check Health Endpoint

Mở trình duyệt và truy cập:

```
https://marketplace-backend.onrender.com/api/health
```

Bạn sẽ thấy response:

```json
{
  "status": "healthy",
  "uptime": 123.45,
  "timestamp": "2024-03-07T...",
  "environment": "production"
}
```

#### 5.2. Check API Root

```
https://marketplace-backend.onrender.com/api
```

Response:

```json
{
  "status": "ok",
  "message": "Backend API is running",
  "timestamp": "2024-03-07T..."
}
```

#### 5.3. Test Authentication

Dùng Postman hoặc curl:

```bash
curl -X POST https://marketplace-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "Test123456"
  }'
```

---

### Bước 6: Update Frontend URL

#### 6.1. Trong Render Dashboard

1. Vào service `marketplace-backend`
2. Click tab **Environment**
3. Tìm biến `FRONTEND_URL`
4. Update value thành URL frontend thực tế:
   ```
   https://your-frontend.vercel.app
   ```
5. Click **Save Changes**
6. Service sẽ tự động redeploy

---

## Post-Deployment

### Monitor Logs

1. Vào tab **Logs**
2. Check không có error
3. Monitor trong 10-15 phút đầu

### Check Metrics

1. Vào tab **Metrics**
2. Check:
   - CPU usage < 50%
   - Memory usage < 80%
   - Response time < 500ms

### Setup Monitoring (Optional)

Thêm health check ping service:

1. Dùng [UptimeRobot](https://uptimerobot.com/) (free)
2. Add monitor:
   ```
   URL: https://marketplace-backend.onrender.com/api/health
   Interval: 5 minutes
   ```

---

## Troubleshooting

### Build Failed

**Error**: `Cannot find module '@prisma/client'`

**Fix**: Đảm bảo build command có:
```bash
npm install && npm run prisma:generate && npm run build
```

---

**Error**: `TypeScript compilation errors`

**Fix**: Test build locally:
```bash
npm run build
```

Fix errors và push lại.

---

### Runtime Errors

**Error**: `Cannot connect to database`

**Fix**:
1. Check DATABASE_URL format
2. Ensure database is running
3. Check database và web service cùng region

---

**Error**: `CORS blocked`

**Fix**: Update FRONTEND_URL environment variable

---

**Error**: `Port already in use`

**Fix**: Đảm bảo code dùng `process.env.PORT`:
```typescript
const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
```

---

### Service Sleeps (Free Plan)

Free plan sleeps sau 15 phút không hoạt động.

**Solutions**:

1. **Upgrade to Starter** ($7/month) - Recommended
2. **Ping service** mỗi 10 phút:
   - Dùng cron-job.org
   - Ping: `https://marketplace-backend.onrender.com/api/health`

---

## Next Steps

- [ ] Deploy frontend lên Vercel
- [ ] Update FRONTEND_URL trong backend
- [ ] Setup custom domain
- [ ] Configure monitoring
- [ ] Setup backup strategy
- [ ] Document API endpoints
- [ ] Setup CI/CD pipeline

---

## Rollback

Nếu có vấn đề:

### Rollback Code

1. Vào **Manual Deploy**
2. Chọn commit trước đó
3. Click **Deploy**

### Rollback Database

```bash
# Restore from backup
psql <DATABASE_URL> < backup.sql
```

---

## Support

- Render Docs: https://render.com/docs
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs

---

## Checklist

- [ ] Database created
- [ ] Redis created (optional)
- [ ] Web service created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Migrations deployed
- [ ] Database seeded
- [ ] Health check passes
- [ ] API endpoints work
- [ ] Frontend URL updated
- [ ] Monitoring setup
- [ ] Documentation updated

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Backend URL**: _______________

**Notes**: _______________
