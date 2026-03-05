#!/bin/bash

# Deployment script for production
# Run this from the project root directory

set -e

echo "=========================================="
echo "Starting Deployment Process"
echo "=========================================="

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo "Error: backend/.env not found!"
    echo "Please copy backend/.env.example to backend/.env and configure it"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "Error: frontend/.env.local not found!"
    echo "Please copy frontend/.env.local.example to frontend/.env.local and configure it"
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npm run prisma:generate

# Run database migrations
echo "Running database migrations..."
npm run prisma:migrate

# Build backend
echo "Building backend..."
npm run build

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Go back to root
cd ..

# Stop PM2 processes if running
echo "Stopping existing PM2 processes..."
pm2 delete all || true

# Start applications with PM2
echo "Starting applications with PM2..."
pm2 start deploy/ecosystem.config.js

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup Nginx configuration
echo "Setting up Nginx..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/marketplace
sudo ln -sf /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

# Reload Nginx
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "View logs with:"
echo "  pm2 logs backend"
echo "  pm2 logs frontend"
echo ""
