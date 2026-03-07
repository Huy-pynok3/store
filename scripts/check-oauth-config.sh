#!/bin/bash

# Script kiểm tra cấu hình Google OAuth cho production
# Chạy: bash scripts/check-oauth-config.sh

echo "🔍 Kiểm tra cấu hình Google OAuth..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0

# Check frontend environment
echo "📱 Frontend Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "frontend/.env.local" ]; then
    API_URL=$(grep NEXT_PUBLIC_API_URL frontend/.env.local | cut -d '=' -f2)
    
    if [[ $API_URL == *"localhost"* ]]; then
        echo -e "${RED}❌ NEXT_PUBLIC_API_URL đang trỏ về localhost${NC}"
        echo "   Hiện tại: $API_URL"
        echo "   Cần: https://your-backend.onrender.com"
        ((ERRORS++))
    elif [[ $API_URL == *"onrender.com"* ]]; then
        echo -e "${GREEN}✅ NEXT_PUBLIC_API_URL đã cấu hình production${NC}"
        echo "   $API_URL"
    else
        echo -e "${YELLOW}⚠️  NEXT_PUBLIC_API_URL không rõ ràng${NC}"
        echo "   $API_URL"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}❌ Không tìm thấy frontend/.env.local${NC}"
    ((ERRORS++))
fi

echo ""

# Check backend environment
echo "🖥️  Backend Configuration:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "backend/.env" ]; then
    FRONTEND_URL=$(grep FRONTEND_URL backend/.env | cut -d '=' -f2)
    GOOGLE_CALLBACK=$(grep GOOGLE_CALLBACK_URL backend/.env | cut -d '=' -f2)
    GOOGLE_CLIENT_ID=$(grep GOOGLE_CLIENT_ID backend/.env | cut -d '=' -f2)
    
    # Check FRONTEND_URL
    if [[ $FRONTEND_URL == *"localhost"* ]]; then
        echo -e "${RED}❌ FRONTEND_URL đang trỏ về localhost${NC}"
        echo "   Hiện tại: $FRONTEND_URL"
        echo "   Cần: https://your-frontend.vercel.app"
        ((ERRORS++))
    elif [[ $FRONTEND_URL == *"vercel.app"* ]]; then
        echo -e "${GREEN}✅ FRONTEND_URL đã cấu hình production${NC}"
        echo "   $FRONTEND_URL"
    else
        echo -e "${YELLOW}⚠️  FRONTEND_URL không rõ ràng${NC}"
        echo "   $FRONTEND_URL"
        ((WARNINGS++))
    fi
    
    # Check GOOGLE_CALLBACK_URL
    if [[ $GOOGLE_CALLBACK == *"localhost"* ]]; then
        echo -e "${RED}❌ GOOGLE_CALLBACK_URL đang trỏ về localhost${NC}"
        echo "   Hiện tại: $GOOGLE_CALLBACK"
        echo "   Cần: https://your-backend.onrender.com/api/auth/google/callback"
        ((ERRORS++))
    elif [[ $GOOGLE_CALLBACK == *"onrender.com"* ]]; then
        echo -e "${GREEN}✅ GOOGLE_CALLBACK_URL đã cấu hình production${NC}"
        echo "   $GOOGLE_CALLBACK"
    else
        echo -e "${YELLOW}⚠️  GOOGLE_CALLBACK_URL không rõ ràng${NC}"
        echo "   $GOOGLE_CALLBACK"
        ((WARNINGS++))
    fi
    
    # Check GOOGLE_CLIENT_ID
    if [[ -z "$GOOGLE_CLIENT_ID" ]]; then
        echo -e "${RED}❌ GOOGLE_CLIENT_ID chưa được cấu hình${NC}"
        ((ERRORS++))
    else
        echo -e "${GREEN}✅ GOOGLE_CLIENT_ID đã được cấu hình${NC}"
        echo "   ${GOOGLE_CLIENT_ID:0:20}..."
    fi
else
    echo -e "${RED}❌ Không tìm thấy backend/.env${NC}"
    ((ERRORS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Tất cả cấu hình đều OK!${NC}"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Có $WARNINGS cảnh báo${NC}"
else
    echo -e "${RED}❌ Có $ERRORS lỗi cần sửa${NC}"
fi

echo ""
echo "📖 Xem hướng dẫn chi tiết tại: docs/FIX_GOOGLE_OAUTH_PRODUCTION.md"
echo ""

# Exit with error code if there are errors
if [ $ERRORS -gt 0 ]; then
    exit 1
fi
