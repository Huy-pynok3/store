# Google OAuth Quick Fix - TL;DR

## Vấn đề: Login Google không hoạt động trên production

### ⚡ Giải pháp nhanh (5 phút)

#### 1. Google Console (https://console.cloud.google.com/)

**Credentials → OAuth 2.0 Client ID → Edit**

Thêm vào:

```
Authorized JavaScript origins:
https://YOUR-FRONTEND.vercel.app
https://YOUR-BACKEND.onrender.com

Authorized redirect URIs:
https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

---

#### 2. Render Backend (https://dashboard.render.com/)

**Service → Environment → Edit**

```bash
FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
GOOGLE_CALLBACK_URL=https://YOUR-BACKEND.onrender.com/api/auth/google/callback
```

Click **Save Changes** (auto redeploy)

---

#### 3. Vercel Frontend (https://vercel.com/dashboard)

**Project → Settings → Environment Variables**

```bash
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND.onrender.com
```

Click **Save** → **Deployments** → **Redeploy**

---

### ✅ Test

1. Mở: `https://YOUR-FRONTEND.vercel.app`
2. Click "Đăng nhập bằng Google"
3. Phải redirect qua Google và quay lại với token

---

### 🔍 Debug nhanh

```bash
# Kiểm tra backend có sống không
curl https://YOUR-BACKEND.onrender.com/api

# Kiểm tra Google OAuth endpoint
curl https://YOUR-BACKEND.onrender.com/api/auth/google
```

---

### 📝 Thay thế

- `YOUR-FRONTEND` → domain Vercel của bạn (vd: `marketplace-vn`)
- `YOUR-BACKEND` → domain Render của bạn (vd: `marketplace-api`)

---

### ❌ Lỗi thường gặp

| Lỗi | Nguyên nhân | Fix |
|-----|-------------|-----|
| `redirect_uri_mismatch` | Google Console chưa có callback URL | Thêm chính xác URL vào Google Console |
| `CORS error` | Backend chưa cho phép frontend domain | Cập nhật `FRONTEND_URL` trên Render |
| `Cannot connect` | Frontend trỏ localhost | Cập nhật `NEXT_PUBLIC_API_URL` trên Vercel |
| `Invalid client` | Client ID/Secret sai | Copy lại từ Google Console |

---

### 📚 Chi tiết đầy đủ

Xem: `docs/FIX_GOOGLE_OAUTH_PRODUCTION.md`
