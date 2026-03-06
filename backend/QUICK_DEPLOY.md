# Quick Deploy Guide - 5 Phút

## Bước 1: Tạo Database (2 phút)

1. Vào [Render Dashboard](https://dashboard.render.com/)
2. New + → PostgreSQL
3. Name: `marketplace-db`, Region: Singapore, Plan: Free
4. Create Database
5. Copy **Internal Database URL**

## Bước 2: Deploy Backend (2 phút)

1. New + → Web Service
2. Connect GitHub repo
3. Cấu hình:
   - Name: `marketplace-backend`
   - Root Directory: `backend`
   - Build: `npm install && npm run prisma:generate && npm run build`
   - Start: `npm run start:prod`

4. Environment Variables:
```bash
DATABASE_URL=<paste-url-từ-bước-1>
JWT_SECRET=<chạy: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend.vercel.app
```

5. Create Web Service

## Bước 3: Run Migration (1 phút)

Sau khi deploy xong, vào Shell tab:

```bash
npx prisma migrate deploy
npm run prisma:seed
```

## Bước 4: Test

```
https://marketplace-backend.onrender.com/api/health
```

## Done! 🎉

Backend URL: `https://marketplace-backend.onrender.com/api`

Cập nhật frontend `.env.production`:
```bash
NEXT_PUBLIC_API_URL=https://marketplace-backend.onrender.com/api
```

---

## Troubleshooting

**Build fails?** → Check build command có `prisma:generate`

**Can't connect DB?** → Check DATABASE_URL format

**CORS error?** → Check FRONTEND_URL environment variable

**Service sleeps?** → Free plan sleeps sau 15 phút. Upgrade hoặc ping mỗi 10 phút.

---

Chi tiết đầy đủ: [DEPLOY_RENDER.md](./DEPLOY_RENDER.md)
