# Fix Google OAuth cho Production (Vercel + Render)

## Vấn đề hiện tại

Google OAuth không hoạt động vì:

1. ❌ Frontend đang trỏ về `localhost:3001` thay vì backend Render
2. ❌ Google OAuth callback URL chưa được cập nhật cho production
3. ❌ Google Console chưa được cấu hình với domain production

---

## Giải pháp: 3 bước

### Bước 1: Cập nhật Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn project của bạn (hoặc tạo mới)
3. Vào **APIs & Services** → **Credentials**
4. Chọn OAuth 2.0 Client ID của bạn (hoặc tạo mới)

#### Thêm Authorized JavaScript origins:

```
https://your-frontend.vercel.app
https://your-backend.onrender.com
```

#### Thêm Authorized redirect URIs:

```
https://your-backend.onrender.com/api/auth/google/callback
```

5. Click **Save**

---

### Bước 2: Cập nhật Environment Variables trên Render (Backend)

1. Vào [Render Dashboard](https://dashboard.render.com/)
2. Chọn service `marketplace-backend`
3. Vào **Environment** tab
4. Cập nhật các biến sau:

```bash
# Frontend URL - Thay bằng domain Vercel của bạn
FRONTEND_URL=https://your-frontend.vercel.app

# Google OAuth - Callback URL production
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback

# Giữ nguyên các biến khác (copy từ Google Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

5. Click **Save Changes** (Render sẽ tự động redeploy)

---

### Bước 3: Cập nhật Environment Variables trên Vercel (Frontend)

#### Option A: Qua Vercel Dashboard (Khuyến nghị)

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project frontend của bạn
3. Vào **Settings** → **Environment Variables**
4. Thêm/cập nhật các biến sau:

```bash
# API URL - Thay bằng domain Render của bạn
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com

# Cloudflare Turnstile (nếu dùng - copy từ Cloudflare Dashboard)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
NEXT_PUBLIC_TURNSTILE_ENABLED=true
```

5. Click **Save**
6. Vào **Deployments** tab → Click **Redeploy** (chọn deployment mới nhất)

#### Option B: Qua CLI

```bash
cd frontend

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Nhập: https://your-backend.onrender.com

# Redeploy
vercel --prod
```

---

## Kiểm tra sau khi cấu hình

### 1. Test Backend Health

```bash
curl https://your-backend.onrender.com/api
```

Kết quả mong đợi: `{"message":"Marketplace API is running"}`

### 2. Test Google OAuth Flow

1. Mở frontend: `https://your-frontend.vercel.app`
2. Click nút "Đăng nhập bằng Google"
3. Kiểm tra URL redirect:
   - Phải redirect đến: `https://accounts.google.com/o/oauth2/v2/auth?...`
   - Sau khi login, phải redirect về: `https://your-backend.onrender.com/api/auth/google/callback`
   - Cuối cùng redirect về: `https://your-frontend.vercel.app?token=...`

### 3. Kiểm tra Console Logs

#### Backend (Render):
```
Vào Render Dashboard → Logs tab
Tìm: "Google OAuth login successful for [email]"
```

#### Frontend (Vercel):
```
Vào Vercel Dashboard → Deployments → View Function Logs
Kiểm tra API calls đến backend
```

---

## Troubleshooting

### Lỗi: "redirect_uri_mismatch"

**Nguyên nhân:** Google Console chưa có redirect URI production

**Giải pháp:**
1. Vào Google Console → Credentials
2. Thêm chính xác URL: `https://your-backend.onrender.com/api/auth/google/callback`
3. Đợi 5 phút để Google cập nhật

### Lỗi: "CORS error" khi gọi API

**Nguyên nhân:** Backend chưa cho phép frontend domain

**Giải pháp:**
1. Vào Render → Environment
2. Cập nhật `FRONTEND_URL=https://your-frontend.vercel.app`
3. Redeploy backend

### Lỗi: "Cannot connect to backend"

**Nguyên nhân:** Frontend vẫn trỏ về localhost

**Giải pháp:**
1. Vào Vercel → Environment Variables
2. Đảm bảo `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Redeploy frontend

### Lỗi: "Invalid client" hoặc "Unauthorized"

**Nguyên nhân:** Google Client ID/Secret không đúng

**Giải pháp:**
1. Vào Google Console → Credentials
2. Copy lại Client ID và Client Secret
3. Cập nhật lại trên Render Environment Variables

---

## Checklist hoàn thành

- [ ] Google Console đã thêm Authorized JavaScript origins
- [ ] Google Console đã thêm Authorized redirect URIs
- [ ] Render backend đã cập nhật `FRONTEND_URL`
- [ ] Render backend đã cập nhật `GOOGLE_CALLBACK_URL`
- [ ] Vercel frontend đã cập nhật `NEXT_PUBLIC_API_URL`
- [ ] Đã redeploy cả frontend và backend
- [ ] Test Google OAuth flow thành công
- [ ] Kiểm tra logs không có lỗi

---

## Thông tin quan trọng

### URLs cần thay thế:

| Placeholder | Thay bằng |
|-------------|-----------|
| `your-frontend.vercel.app` | Domain Vercel thực tế của bạn |
| `your-backend.onrender.com` | Domain Render thực tế của bạn |

### Ví dụ cụ thể:

Nếu domain của bạn là:
- Frontend: `marketplace-vn.vercel.app`
- Backend: `marketplace-api.onrender.com`

Thì cấu hình sẽ là:

**Google Console:**
```
Authorized JavaScript origins:
- https://marketplace-vn.vercel.app
- https://marketplace-api.onrender.com

Authorized redirect URIs:
- https://marketplace-api.onrender.com/api/auth/google/callback
```

**Render Environment:**
```bash
FRONTEND_URL=https://marketplace-vn.vercel.app
GOOGLE_CALLBACK_URL=https://marketplace-api.onrender.com/api/auth/google/callback
```

**Vercel Environment:**
```bash
NEXT_PUBLIC_API_URL=https://marketplace-api.onrender.com
```

---

## Lưu ý quan trọng

1. **Đợi 5-10 phút** sau khi thay đổi Google Console để thay đổi có hiệu lực
2. **Luôn redeploy** sau khi thay đổi environment variables
3. **Xóa cache trình duyệt** nếu vẫn gặp lỗi
4. **Kiểm tra logs** trên cả Render và Vercel để debug
5. **Test ở chế độ Incognito** để tránh cache

---

## Hỗ trợ thêm

Nếu vẫn gặp vấn đề, cung cấp thông tin sau:

1. Domain frontend (Vercel): `_______________`
2. Domain backend (Render): `_______________`
3. Error message từ console: `_______________`
4. Screenshot của Google Console Credentials
5. Screenshot của Render Environment Variables
6. Screenshot của Vercel Environment Variables
