#!/bin/bash

# Deployment script for Backend API (Frontend on Vercel)
# Run this from the project root directory

set -e

echo "=========================================="
echo "Starting Backend API Deployment"
echo "=========================================="

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "Error: backend/.env not found!"
    echo "Please copy deploy-vercel/.env.production.example to backend/.env and configure it"
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm ci --production=false

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "Running database migrations..."
npm run prisma:migrate

# Build backend
echo "Building backend..."
npm run build

# Go back to root
cd ..

# Stop PM2 processes if running
echo "Stopping existing PM2 processes..."
pm2 delete backend || true

# Start backend with PM2
echo "Starting backend with PM2..."
pm2 start deploy-vercel/ecosystem.config.js

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup Nginx configuration
echo "Setting up Nginx..."
sudo cp deploy-vercel/nginx.conf /etc/nginx/sites-available/marketplace-api
sudo ln -sf /etc/nginx/sites-available/marketplace-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "=========================================="
echo "Backend Deployment Complete!"
echo "=========================================="
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "View logs with: pm2 logs backend"
echo ""
echo "API URL: https://api.your-domain.com"
echo ""
echo "Next: Configure Vercel with this API URL"
echo ""
