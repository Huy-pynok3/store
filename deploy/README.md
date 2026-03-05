# AWS EC2 Deployment Guide

Hướng dẫn deploy ứng dụng Marketplace lên AWS EC2.

## Yêu cầu

- AWS EC2 instance (Ubuntu 22.04 LTS)
- Instance type: t3.medium hoặc cao hơn (2 vCPU, 4GB RAM)
- Storage: 30GB SSD trở lên
- Domain name đã trỏ về EC2 IP

## Bước 1: Tạo EC2 Instance

1. Đăng nhập AWS Console
2. Chọn EC2 > Launch Instance
3. Cấu hình:
   - Name: marketplace-app
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: t3.medium
   - Key pair: Tạo mới hoặc chọn existing
   - Security Group: Mở ports 22, 80, 443
4. Launch instance

## Bước 2: Kết nối SSH

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Bước 3: Chạy Setup Script

```bash
# Download setup script
wget https://raw.githubusercontent.com/your-repo/deploy/setup-ec2.sh

# Make executable
chmod +x setup-ec2.sh

# Run setup
./setup-ec2.sh
```

Script sẽ cài đặt:
- Node.js 20.x
- PostgreSQL 16
- Redis
- Nginx
- PM2
- Certbot (SSL)

## Bước 4: Clone Repository

```bash
cd /var/www/marketplace
git clone https://github.com/your-username/your-repo.git .
```

## Bước 5: Cấu hình Environment Variables

### Backend

```bash
cd /var/www/marketplace/backend
cp ../deploy/.env.production.example .env
nano .env
```

Cập nhật các giá trị:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Random string (dùng `openssl rand -base64 32`)
- `FRONTEND_URL`: Domain của bạn
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile keys

### Frontend

```bash
cd /var/www/marketplace/frontend
cp ../deploy/frontend.env.production.example .env.local
nano .env.local
```

Cập nhật:
- `NEXT_PUBLIC_API_URL`: https://your-domain.com/api
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key

## Bước 6: Cập nhật Nginx Config

```bash
cd /var/www/marketplace
nano deploy/nginx.conf
```

Thay `your-domain.com` bằng domain thực của bạn.

## Bước 7: Deploy

```bash
cd /var/www/marketplace
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

Script sẽ:
- Install dependencies
- Build backend và frontend
- Run database migrations
- Start PM2 processes
- Configure Nginx

## Bước 8: Setup SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot sẽ tự động:
- Tạo SSL certificate
- Cấu hình Nginx
- Setup auto-renewal

## Bước 9: Cấu hình Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Chọn project của bạn
3. APIs & Services > Credentials
4. Chỉnh sửa OAuth 2.0 Client ID
5. Thêm Authorized redirect URIs:
   - `https://your-domain.com/api/auth/google/callback`
6. Save

## Bước 10: Kiểm tra

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs backend
pm2 logs frontend

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql

# Check Redis
sudo systemctl status redis-server
```

Truy cập: `https://your-domain.com`

## Quản lý ứng dụng

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs
pm2 logs backend
pm2 logs frontend

# Restart
pm2 restart all
pm2 restart backend
pm2 restart frontend

# Stop
pm2 stop all

# Monitor
pm2 monit
```

### Update Code

```bash
cd /var/www/marketplace
git pull origin main
./deploy/deploy.sh
```

### Database Backup

```bash
# Backup
pg_dump -U marketplace_user marketplace > backup_$(date +%Y%m%d).sql

# Restore
psql -U marketplace_user marketplace < backup_20260305.sql
```

### View Logs

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application logs
tail -f logs/backend-error.log
tail -f logs/frontend-error.log
```

## Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] Strong database password
- [ ] JWT secret changed
- [ ] Environment variables secured
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Database backups scheduled
- [ ] Rate limiting enabled (Nginx)
- [ ] CORS configured properly

## Monitoring

### Setup PM2 Monitoring (Optional)

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### CloudWatch Integration (Optional)

Install CloudWatch agent để monitor EC2 metrics.

## Troubleshooting

### Application không start

```bash
pm2 logs
# Check error logs
```

### Database connection error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U marketplace_user -d marketplace -h localhost
```

### Nginx 502 Bad Gateway

```bash
# Check backend is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL certificate issues

```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

## Chi phí ước tính (AWS)

- EC2 t3.medium: ~$30/tháng
- EBS 30GB: ~$3/tháng
- Data transfer: ~$5-10/tháng
- **Tổng**: ~$40-50/tháng

## Tối ưu hóa

1. **Enable CloudFront CDN** cho static assets
2. **RDS PostgreSQL** thay vì PostgreSQL trên EC2
3. **ElastiCache Redis** thay vì Redis trên EC2
4. **Auto Scaling Group** cho high availability
5. **Application Load Balancer** cho multiple instances

## Support

Nếu gặp vấn đề, check:
1. PM2 logs: `pm2 logs`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. System logs: `sudo journalctl -xe`
