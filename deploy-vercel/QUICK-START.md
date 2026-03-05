# Quick Start Guide - Vercel + EC2

Deploy nhanh trong 15 phút!

## Tổng quan

- **Frontend**: Vercel (tự động deploy từ Git)
- **Backend API**: AWS EC2 Ubuntu 22.04

## Bước 1: Setup Backend trên EC2 (10 phút)

### 1.1 Tạo EC2 Instance

- Instance type: t3.small
- AMI: Ubuntu 22.04 LTS
- Security Group: Mở ports 22, 80, 443

### 1.2 Cấu hình DNS

Tạo A record cho API:
```
api.your-domain.com → EC2_PUBLIC_IP
```

### 1.3 SSH và Setup

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /var/www
sudo mkdir marketplace-api
sudo chown -R ubuntu:ubuntu marketplace-api
cd marketplace-api
git clone https://github.com/your-repo.git .
chmod +x deploy-vercel/setup-ec2.sh
./deploy-vercel/setup-ec2.sh
```

### 1.4 Cấu hình .env

```bash
cd backend
cp ../deploy-vercel/.env.production.example .env
nano .env
```

Cập nhật:
- `DATABASE_URL`: Password PostgreSQL
- `JWT_SECRET`: `openssl rand -base64 32`
- `FRONTEND_URL`: Domain Vercel của bạn
- Google OAuth credentials

### 1.5 Deploy

```bash
cd /var/www/marketplace-api
nano deploy-vercel/nginx.conf  # Thay your-domain.com
./deploy-vercel/deploy.sh
sudo certbot --nginx -d api.your-domain.com
```

## Bước 2: Deploy Frontend lên Vercel (5 phút)

### 2.1 Import Project

1. Truy cập [vercel.com](https://vercel.com)
2. Import repository
3. Root Directory: `frontend`

### 2.2 Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-key
NEXT_PUBLIC_TURNSTILE_ENABLED=true
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
```

### 2.3 Deploy

Click "Deploy" và đợi build hoàn tất.

## Bước 3: Cấu hình Google OAuth

1. Google Cloud Console > Credentials
2. Thêm Authorized redirect URIs:
   ```
   https://api.your-domain.com/api/auth/google/callback
   ```
3. Thêm Authorized JavaScript origins:
   ```
   https://your-vercel-domain.vercel.app
   ```

## Bước 4: Cập nhật CORS

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /var/www/marketplace-api
nano deploy-vercel/nginx.conf
```

Thay `your-vercel-domain.vercel.app` bằng domain Vercel thực.

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Kiểm tra

```bash
# Test API
curl https://api.your-domain.com/api/health

# Test frontend
# Truy cập Vercel domain và test login
```

## Xong!

- Frontend: `https://your-vercel-domain.vercel.app`
- Backend API: `https://api.your-domain.com`

## Troubleshooting

### CORS Error
```bash
# Check Nginx config
sudo nginx -t
cat /etc/nginx/sites-available/marketplace-api | grep Access-Control

# Reload Nginx
sudo systemctl reload nginx
```

### Backend không chạy
```bash
pm2 logs backend
pm2 restart backend
```

### Vercel build failed
Check environment variables trong Vercel Dashboard.
