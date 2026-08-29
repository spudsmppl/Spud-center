#!/bin/bash

# Spud Center Deployment Verification Script
# This script tests your setup before deploying to Cloudflare Pages

set -e

echo "🧪 Spud Center Deployment Verification"
echo "========================================"
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"

# Check npm version
echo "✓ Checking npm version..."
NPM_VERSION=$(npm -v)
echo "  Found: $NPM_VERSION"

# Check required files
echo ""
echo "✓ Checking project structure..."
REQUIRED_FILES=(
  "frontend/package.json"
  "backend/package.json"
  "frontend/vite.config.ts"
  "wrangler.toml"
  "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
    exit 1
  fi
done

# Test frontend build
echo ""
echo "✓ Testing frontend build..."
cd frontend
npm install --legacy-peer-deps
npm run build
if [ -d "dist" ]; then
  echo "  ✓ Build successful! dist/ folder created"
  echo "  📊 Build size: $(du -sh dist | cut -f1)"
else
  echo "  ✗ Build failed - no dist folder"
  exit 1
fi
cd ..

# Test backend build
echo ""
echo "✓ Testing backend build..."
cd backend
npm install --legacy-peer-deps
npm run build
if [ -d "dist" ]; then
  echo "  ✓ Build successful! dist/ folder created"
else
  echo "  ✗ Build failed - no dist folder"
  exit 1
fi
cd ..

# Check frontend configuration
echo ""
echo "✓ Checking frontend configuration..."
if grep -q "VITE_API_URL" frontend/src/api/client.ts; then
  echo "  ✓ API URL configuration found"
else
  echo "  ✗ API URL configuration missing"
  exit 1
fi

# Check backend configuration
echo ""
echo "✓ Checking backend configuration..."
if grep -q "cors" backend/src/index.ts; then
  echo "  ✓ CORS configuration found"
else
  echo "  ✗ CORS configuration missing"
  exit 1
fi

# Check environment files
echo ""
echo "✓ Checking environment files..."
if [ -f "backend/.env.example" ]; then
  echo "  ✓ backend/.env.example found"
else
  echo "  ⚠ backend/.env.example missing (optional)"
fi

if [ -f "frontend/.env.example" ]; then
  echo "  ✓ frontend/.env.example found"
else
  echo "  ⚠ frontend/.env.example missing (optional)"
fi

# Check API SDK
echo ""
echo "✓ Checking API SDK..."
if [ -f "sdk/SpudCenterSDK.ts" ]; then
  echo "  ✓ SDK file found"
else
  echo "  ✗ SDK file missing"
  exit 1
fi

# Check documentation
echo ""
echo "✓ Checking documentation..."
DOCS=(
  "API_REFERENCE.md"
  "DEPLOYMENT_GUIDE.md"
  "CLOUDFLARE_DEPLOYMENT.md"
  "SDK_USAGE.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "  ✓ $doc"
  else
    echo "  ✗ MISSING: $doc"
  fi
done

echo ""
echo "========================================"
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Cloudflare Pages dashboard"
echo "2. Deploy backend (Railway, Render, etc.)"
echo "3. Push this project to GitHub"
echo "4. Connect to Cloudflare Pages"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
