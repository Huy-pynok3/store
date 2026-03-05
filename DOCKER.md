# Docker Setup Guide

Single docker-compose.yml for both development and production using environment variables.

## Setup Options

### Option 1: Full Stack (Development)
Use when developing both frontend and backend locally.

### Option 2: Backend Only (Vercel Frontend)
Use when frontend is deployed on Vercel and you only need backend locally or on EC2.

## Full Stack Development

### Quick Start

```bash
# Start all services (backend + frontend + databases)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Backend Only (Frontend on Vercel)

### Quick Start

```bash
# Start backend services only
docker-compose -f docker-compose.backend-only.yml up -d

# View logs
docker-compose -f docker-compose.backend-only.yml logs -f

# Stop services
docker-compose -f docker-compose.backend-only.yml down
```

### Configuration

Backend will be accessible at `http://localhost:3001`

Update `FRONTEND_URL` in backend/.env to your Vercel domain:
```env
FRONTEND_URL=https://your-app.vercel.app
```

Update Vercel environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api  # For local dev
# or
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api  # For production
```

## Common Commands

### Database Migrations

```bash
# Full stack
docker-compose exec backend npx prisma migrate dev

# Backend only
docker-compose -f docker-compose.backend-only.yml exec backend npx prisma migrate dev

# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

### Useful Commands

```bash
# Rebuild specific service
docker-compose up -d --build backend

# View service logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend npm run test
docker-compose exec backend sh

# Restart service
docker-compose restart backend

# Check service status
docker-compose ps
```

## Production Environment

### Setup

```bash
# Copy production environment file
cp .env.prod.example .env.prod

# Edit with your production values
nano .env.prod
```

Update these critical values:
- `POSTGRES_PASSWORD` - Strong database password
- `REDIS_PASSWORD` - Strong Redis password
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `FRONTEND_URL` - Your domain
- `NEXT_PUBLIC_API_URL` - Your API domain
- Google OAuth credentials
- Cloudflare Turnstile keys

### Deploy

```bash
# Build and start production services
docker-compose --env-file .env.prod up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Commands

```bash
# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# View backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend

# Scale backend (multiple instances)
docker-compose up -d --scale backend=3
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill the process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Connect to database
docker-compose exec postgres psql -U postgres -d marketplace
```

### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Container Won't Start

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build --force-recreate

# Check container logs
docker-compose logs <service-name>
```

### Clean Everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a --volumes

# Start fresh
docker-compose up -d --build
```

## Docker Commands Reference

### Images

```bash
# List images
docker images

# Remove image
docker rmi <image-id>

# Remove all unused images
docker image prune -a
```

### Containers

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop <container-id>

# Remove container
docker rm <container-id>

# Remove all stopped containers
docker container prune
```

### Volumes

```bash
# List volumes
docker volume ls

# Remove volume
docker volume rm <volume-name>

# Remove all unused volumes
docker volume prune
```

### Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect <network-name>

# Remove network
docker network rm <network-name>
```

## Performance Tips

### Development

- Use volume mounts for hot reload
- Limit resource usage in Docker Desktop settings
- Use `.dockerignore` to exclude unnecessary files

### Production

- Use multi-stage builds to reduce image size
- Run as non-root user for security
- Use health checks for reliability
- Enable logging drivers for monitoring
- Use Docker secrets for sensitive data

## Security Best Practices

1. Never commit `.env` files
2. Use strong passwords for databases
3. Run containers as non-root users
4. Keep images updated
5. Scan images for vulnerabilities
6. Use Docker secrets in production
7. Limit container resources
8. Use private registries for production images

## Monitoring

### Health Checks

```bash
# Check service health
docker-compose ps

# Inspect container health
docker inspect --format='{{.State.Health.Status}}' <container-name>
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container
docker stats <container-name>
```

### Logs

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs -f backend

# Since timestamp
docker-compose logs --since 2024-01-01T00:00:00
```
