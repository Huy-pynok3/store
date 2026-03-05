# AWS EC2 + Vercel Deployment Guide

Hướng dẫn deploy ứng dụng với:
- **Backend API**: AWS EC2 (Ubuntu 22.04)
- **Frontend**: Vercel

## Kiến trúc

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  Next.js        │
└────────┬────────┘
         │ HTTPS
         │
┌────────▼────────┐
│  AWS EC2        │
│  (Backend API)  │
│  - NestJS       │
│  - PostgreSQL   │
│  - Redis        │
│  - Nginx        │
└─────────────────┘
```

## Phần 1: Deploy Backend lên EC2

### Bước 1: Tạo EC2 Instance

1. Đăng nhập AWS Console
2. Chọn EC2 > Launch Instance
3. Cấu hình:
   - Name: marketplace-api
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t3.small (2 vCPU, 2GB RAM) - đủ cho backend
   - Key pair: Tạo mới hoặc chọn existing
   - Security Group: Mở ports 22, 80, 443
4. Launch instance

### Bước 2: Cấu hình Domain cho API

1. Truy cập DNS provider (Cloudflare, Route53, etc.)
2. Tạo A record:
   - Name: `api` hoặc `api.your-domain.com`
   - Value: EC2 Public IP
   - TTL: 300

### Bước 3: Kết nối SSH và Setup

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Download and run setup script
cd /var/www/marketplace-api
git clone https://github.com/your-username/your-repo.git .

# Run setup
chmod +x deploy-vercel/setup-ec2.sh
./deploy-vercel/setup-ec2.sh
```

### Bước 4: Cấu hình Environment Variables

```bash
cd /var/www/marketplace-api/backend
cp ../deploy-vercel/.env.production.example .env
nano .env
```

Cập nhật các giá trị:

```env
DATABASE_URL="postgresql://marketplace_user:your_password@localhost:5432/marketplace"
JWT_SECRET=<generate with: openssl rand -base64 32>
FRONTEND_URL=https://your-vercel-domain.vercel.app
GOOGLE_CALLBACK_URL=https://api.your-domain.com/api/auth/google/callback
```

### Bước 5: Cập nhật Nginx Config

```bash
cd /var/www/marketplace-api
nano deploy-vercel/nginx.conf
```

Thay thế:
- `api.your-domain.com` → domain API thực của bạn
- `your-vercel-domain.vercel.app` → domain Vercel của bạn

### Bước 6: Deploy Backend

```bash
cd /var/www/marketplace-api
chmod +x deploy-vercel/deploy.sh
./deploy-vercel/deploy.sh
```

### Bước 7: Setup SSL Certificate

```bash
sudo certbot --nginx -d api.your-domain.com
```

### Bước 8: Kiểm tra Backend

```bash
# Check PM2
pm2 status
pm2 logs backend

# Test API
curl https://api.your-domain.com/api/health
```

## Phần 2: Deploy Frontend lên Vercel

### Bước 1: Chuẩn bị Repository

Đảm bảo frontend code đã push lên GitHub/GitLab/Bitbucket.

### Bước 2: Import Project vào Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import repository của bạn
4. Chọn framework: Next.js
5. Root Directory: `frontend`

### Bước 3: Cấu hình Environment Variables

Trong Vercel project settings, thêm các biến:

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
NEXT_PUBLIC_TURNSTILE_ENABLED=true
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Bước 4: Deploy

1. Click "Deploy"
2. Vercel sẽ tự động build và deploy
3. Lấy URL: `https://your-project.vercel.app`

### Bước 5: Cấu hình Custom Domain (Optional)

1. Trong Vercel project > Settings > Domains
2. Add domain: `your-domain.com`
3. Cấu hình DNS theo hướng dẫn của Vercel

### Bước 6: Cập nhật CORS trên Backend

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update Nginx config
cd /var/www/marketplace-api
nano deploy-vercel/nginx.conf
```

Thay `your-vercel-domain.vercel.app` bằng domain Vercel thực:

```nginx
add_header Access-Control-Allow-Origin "https://your-actual-domain.vercel.app" always;
```

Nếu dùng custom domain:

```nginx
add_header Access-Control-Allow-Origin "https://your-domain.com" always;
```

Reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 7: Cập nhật Backend .env

```bash
cd /var/www/marketplace-api/backend
nano .env
```

Cập nhật `FRONTEND_URL`:

```env
FRONTEND_URL=https://your-actual-domain.vercel.app
# hoặc
FRONTEND_URL=https://your-domain.com
```

Restart backend:

```bash
pm2 restart backend
```

## Phần 3: Cấu hình Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Chọn project > APIs & Services > Credentials
3. Chỉnh sửa OAuth 2.0 Client ID
4. Thêm Authorized JavaScript origins:
   - `https://your-vercel-domain.vercel.app`
   - `https://your-domain.com` (nếu có custom domain)
5. Thêm Authorized redirect URIs:
   - `https://api.your-domain.com/api/auth/google/callback`
6. Save

## Kiểm tra hoàn chỉnh

### Test Backend API

```bash
# Health check
curl https://api.your-domain.com/api/health

# Test CORS
curl -H "Origin: https://your-vercel-domain.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.your-domain.com/api/auth/login
```

### Test Frontend

1. Truy cập `https://your-vercel-domain.vercel.app`
2. Test đăng ký/đăng nhập
3. Test Google OAuth
4. Check browser console không có CORS errors

## Quản lý và Monitoring

### Backend (EC2)

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# View logs
pm2 logs backend

# Restart
pm2 restart backend

# Monitor
pm2 monit

# Update code
cd /var/www/marketplace-api
git pull origin main
./deploy-vercel/deploy.sh
```

### Frontend (Vercel)

1. Push code lên Git → Vercel tự động deploy
2. View logs: Vercel Dashboard > Deployments > Logs
3. Rollback: Vercel Dashboard > Deployments > Promote to Production

## Vercel Deployment Settings

### Build & Development Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "devCommand": "npm run dev"
}
```

### Root Directory

Nếu frontend trong subfolder:
- Root Directory: `frontend`

### Environment Variables

Vercel hỗ trợ 3 môi trường:
- Production
- Preview (branches)
- Development

Cấu hình cho từng môi trường riêng nếu cần.

## Tối ưu hóa

### Backend (EC2)

1. **Enable CloudWatch** cho monitoring
2. **Setup Auto Scaling** nếu traffic cao
3. **RDS PostgreSQL** thay vì PostgreSQL trên EC2
4. **ElastiCache Redis** thay vì Redis trên EC2

### Frontend (Vercel)

1. **Image Optimization**: Dùng `next/image`
2. **Edge Functions**: Deploy API routes lên Edge
3. **ISR**: Incremental Static Regeneration cho dynamic pages
4. **Analytics**: Enable Vercel Analytics

## Chi phí ước tính

### AWS EC2
- t3.small: ~$15/tháng
- EBS 20GB: ~$2/tháng
- Data transfer: ~$5/tháng
- **Tổng EC2**: ~$22/tháng

### Vercel
- Hobby (Free): $0
- Pro: $20/tháng (nếu cần)

**Tổng chi phí**: ~$22-42/tháng

## Troubleshooting

### CORS Error

Kiểm tra:
1. Nginx config có đúng Vercel domain
2. Backend .env có đúng FRONTEND_URL
3. Vercel environment variables đúng API URL

```bash
# Check Nginx config
sudo nginx -t
cat /etc/nginx/sites-available/marketplace-api | grep Access-Control

# Check backend env
cd /var/www/marketplace-api/backend
cat .env | grep FRONTEND_URL

# Restart services
pm2 restart backend
sudo systemctl reload nginx
```

### Google OAuth không hoạt động

1. Check Google Console có đúng redirect URI
2. Check backend .env có đúng GOOGLE_CALLBACK_URL
3. Check Vercel có đúng GOOGLE_CLIENT_ID

### API không kết nối được

```bash
# Check backend status
pm2 status
pm2 logs backend

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Check firewall
sudo ufw status
```

### Vercel build failed

1. Check build logs trong Vercel Dashboard
2. Verify environment variables
3. Test build locally: `npm run build`

## Security Checklist

- [ ] SSL certificate installed (Certbot)
- [ ] Strong database password
- [ ] JWT secret changed
- [ ] Firewall configured (UFW)
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Rate limiting enabled
- [ ] Google OAuth configured correctly

## Continuous Deployment

### Backend

Setup GitHub Actions:

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /var/www/marketplace-api
            git pull origin main
            ./deploy-vercel/deploy.sh
```

### Frontend

Vercel tự động deploy khi push code lên Git.

## Support

Nếu gặp vấn đề:
1. Check PM2 logs: `pm2 logs backend`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check Vercel logs: Vercel Dashboard > Deployments
4. Test API directly: `curl https://api.your-domain.com/api/health`
