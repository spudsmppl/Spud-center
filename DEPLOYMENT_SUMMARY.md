# 🎯 Spud Center - API SDK & Cloudflare Deployment

This project is now fully configured for:
- ☁️ **Cloudflare Pages** deployment (frontend)
- 🔗 **API SDK** for controlling the platform
- 🌐 **Multi-environment** support (local, staging, production)
- 🔐 **CORS-configured** for cross-origin requests

## 📦 What's New

### 1. API SDK (Ready to Download & Use)

**Location**: [sdk/SpudCenterSDK.ts](sdk/SpudCenterSDK.ts)

**Features**:
- ✅ Complete TypeScript SDK with full type safety
- ✅ Supports browser, Node.js, Python, and cURL
- ✅ Authentication (register, login, logout)
- ✅ Node management (create, read, update, delete)
- ✅ Preview management (create, update, delete)
- ✅ Error handling with detailed error objects
- ✅ Timeout and retry support

**Usage**:
```typescript
import SpudCenterSDK from 'sdk/SpudCenterSDK.ts';

const sdk = new SpudCenterSDK('https://api.yourdomain.com');
const auth = await sdk.login('email@example.com', 'password');
sdk.setToken(auth.token);

const node = await sdk.createNode({
  name: 'My Website',
  url: 'https://example.com'
});
```

See [SDK_USAGE.md](SDK_USAGE.md) for complete examples in all languages.

### 2. Cloudflare Pages Configuration

**Files**:
- [wrangler.toml](wrangler.toml) - Cloudflare Pages build config
- [frontend/_redirects](frontend/_redirects) - SPA routing config
- [frontend/vite.config.ts](frontend/vite.config.ts) - Production optimized

**Build Settings**:
```
Command: cd frontend && npm install && npm run build
Output: frontend/dist
```

### 3. Environment Configuration

**Frontend** (Cloudflare Pages):
```env
VITE_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

**Backend** (External service):
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-pages-domain.pages.dev
NODE_ENV=production
```

### 4. Enhanced CORS Support

Backend now supports:
- ✅ Cloudflare Pages domains (*.pages.dev)
- ✅ Cloudflare Workers domains (*.workers.dev)
- ✅ Custom domains
- ✅ Local development (localhost, 127.0.0.1)
- ✅ Vite dev server (localhost:5173)

See [backend/src/index.ts](backend/src/index.ts) for CORS configuration.

### 5. API Documentation

- [OpenAPI Specification](openapi.yaml) - Import to Postman or Swagger UI
- [API Reference](API_REFERENCE.md) - Detailed endpoint documentation
- [SDK Usage Guide](SDK_USAGE.md) - Code examples in multiple languages

## 🚀 Deployment Steps

### Step 1: Build & Test Locally
```bash
npm run build:frontend
npm run build:backend
npm run build:sdk
```

### Step 2: Deploy to Cloudflare Pages
```bash
# Method 1: Via GitHub integration (recommended)
1. Push code to GitHub
2. Go to Cloudflare Dashboard
3. Pages → Create Project → Connect to Git
4. Configure as described above

# Method 2: Direct deployment
npm run cloudflare:deploy
```

### Step 3: Deploy Backend
Choose one:
- **Railway**: Most user-friendly, auto-deploys from GitHub
- **Render**: Similar to Railway, good free tier
- **Heroku**: Classic option, requires buildpacks
- **Your own server**: Docker or Node.js directly

### Step 4: Connect Frontend to Backend
Update Cloudflare Pages environment variables:
```
VITE_API_URL: https://your-deployed-api.com/api
```

Then redeploy frontend.

## 📊 Project Structure

```
├── sdk/                          # API SDK (ready to use/download)
│   ├── SpudCenterSDK.ts         # Main SDK file
│   ├── package.json
│   └── index.js
│
├── frontend/                      # React + Vite frontend
│   ├── vite.config.ts           # Cloudflare optimized
│   ├── _redirects               # SPA routing for Pages
│   ├── src/
│   │   ├── api/client.ts        # Updated for Cloudflare
│   │   └── ...
│   └── dist/                    # Built files (deployed to Pages)
│
├── backend/                       # Express API server
│   ├── src/index.ts             # CORS configured for Cloudflare
│   ├── .env.example
│   └── ...
│
├── wrangler.toml                 # Cloudflare Pages config
├── openapi.yaml                  # API specification
│
├── SDK_USAGE.md                  # SDK examples & documentation
├── DEPLOYMENT_GUIDE.md           # Detailed deployment steps
├── QUICK_START_DEPLOYMENT.md     # Quick reference
└── CLOUDFLARE_DEPLOYMENT.md      # Cloudflare-specific guide
```

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start both frontend & backend locally
npm run dev:frontend    # Frontend only (port 3000)
npm run dev:backend     # Backend only (port 5000)

# Building
npm run build           # Build both
npm run build:frontend  # Build frontend (Cloudflare Pages)
npm run build:backend   # Build backend
npm run build:sdk       # Build SDK

# Deployment
npm run cloudflare:deploy  # Deploy to Cloudflare Pages

# Docker
npm run docker-build    # Build Docker image
npm run docker-run      # Run Docker container
```

## 🔐 Security

- ✅ JWT authentication
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ Helmet.js security headers
- ✅ Password hashing with bcrypt
- ✅ MongoDB connection security
- ✅ Environment variable protection

## 🧪 Testing

### Test API Locally
```bash
# Start backend & frontend
npm run dev

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test with SDK
npm install spud-center-sdk
# See SDK_USAGE.md for examples
```

### Test Cloudflare Deployment
```bash
# Verify build
npm run verify-deployment

# Check build output
ls -la frontend/dist/

# Test production build
cd frontend
npm run build
npm run preview
```

## 📈 Monitoring

- **Cloudflare Pages**: Built-in analytics & logging
- **Backend logs**: Check deployment platform (Railway, Render, etc.)
- **API SDK**: Built-in error handling with detailed messages
- **Health checks**: GET `/api/health` endpoint

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md#common-issues--solutions) |
| API not responding | Verify `VITE_API_URL` in Cloudflare environment vars |
| CORS errors | Check backend `FRONTEND_URL` environment variable |
| Login fails | Verify MongoDB connection & JWT_SECRET |
| Blank page | Clear cache, check console (F12), verify _redirects |

## 📚 Documentation

Complete documentation is provided:

1. **[QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)** - 5-minute overview
2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Step-by-step detailed guide
3. **[SDK_USAGE.md](SDK_USAGE.md)** - SDK examples in all languages
4. **[CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md)** - Cloudflare-specific setup
5. **[openapi.yaml](openapi.yaml)** - API specification (import to Postman)
6. **[API_REFERENCE.md](API_REFERENCE.md)** - Endpoint documentation

## 🎯 Next Steps

1. **Local testing**: `npm run dev`
2. **Verify deployment**: `./verify-deployment.sh`
3. **Push to GitHub**: Git commit & push
4. **Deploy frontend**: Connect to Cloudflare Pages
5. **Deploy backend**: Use Railway or Render
6. **Set environment variables**: Update Cloudflare Pages
7. **Test live deployment**: Visit your Pages domain

## 🆘 Need Help?

1. Check the relevant documentation file
2. Review browser console (F12) for errors
3. Check Cloudflare Pages build logs
4. Check backend server logs
5. Verify all environment variables are set

## 📝 Files Changed/Created

**New Files**:
- ✅ [sdk/SpudCenterSDK.ts](sdk/SpudCenterSDK.ts) - Complete API SDK
- ✅ [wrangler.toml](wrangler.toml) - Cloudflare Pages config
- ✅ [frontend/_redirects](frontend/_redirects) - SPA routing
- ✅ [openapi.yaml](openapi.yaml) - API specification
- ✅ [SDK_USAGE.md](SDK_USAGE.md) - SDK documentation
- ✅ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment guide
- ✅ [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md) - Cloudflare guide
- ✅ [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md) - Quick reference
- ✅ [verify-deployment.sh](verify-deployment.sh) - Deployment verification script
- ✅ [backend/.env.example](backend/.env.example) - Environment template

**Modified Files**:
- ✅ [frontend/vite.config.ts](frontend/vite.config.ts) - Production optimized
- ✅ [frontend/src/api/client.ts](frontend/src/api/client.ts) - Enhanced for Cloudflare
- ✅ [backend/src/index.ts](backend/src/index.ts) - CORS for Cloudflare
- ✅ [package.json](package.json) - Added scripts & workspaces

## ✨ Summary

Your project is now **fully ready for Cloudflare Pages deployment** with:

- 🎯 Complete API SDK for programmatic control
- ☁️ Cloudflare Pages configuration
- 🔗 Proper CORS setup for cross-origin requests
- 📚 Comprehensive documentation
- ✅ Production-ready build configuration
- 🧪 Verification scripts

**Start with**: [QUICK_START_DEPLOYMENT.md](QUICK_START_DEPLOYMENT.md)

---

**Questions?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed troubleshooting.
