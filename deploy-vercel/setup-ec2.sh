#!/bin/bash

# AWS EC2 Setup Script for Backend Only (Frontend on Vercel)
# Run this script on your EC2 instance after SSH connection

set -e

echo "=========================================="
echo "Starting EC2 Setup for Backend API"
echo "=========================================="

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install build essentials
echo "Installing build tools..."
sudo apt install -y build-essential git curl wget

# Install PostgreSQL 16
echo "Installing PostgreSQL 16..."
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql-16 postgresql-contrib-16

# Configure PostgreSQL
echo "Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE DATABASE marketplace;"
sudo -u postgres psql -c "CREATE USER marketplace_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE marketplace TO marketplace_user;"
sudo -u postgres psql -d marketplace -c "GRANT ALL ON SCHEMA public TO marketplace_user;"

# Install Redis
echo "Installing Redis..."
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Install Certbot for SSL
echo "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/marketplace-api
sudo chown -R $USER:$USER /var/www/marketplace-api

# Create logs directory
mkdir -p /var/www/marketplace-api/logs

# Setup firewall
echo "Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Configure PostgreSQL
echo "Configuring PostgreSQL..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/16/main/postgresql.conf

# Restart PostgreSQL
sudo systemctl restart postgresql

# Setup PM2 startup script
echo "Setting up PM2 startup..."
pm2 startup systemd -u $USER --hp /home/$USER
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

echo "=========================================="
echo "EC2 Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repository to /var/www/marketplace-api"
echo "2. Copy and configure backend/.env file"
echo "3. Run deploy.sh script"
echo "4. Setup SSL with: sudo certbot --nginx -d api.your-domain.com"
echo "5. Configure Vercel with your API domain"
echo ""
