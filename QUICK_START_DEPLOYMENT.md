# API Control & Cloudflare Deployment - Quick Reference

## 🚀 Download & Use the API SDK

### Quick Start
```bash
# Copy the SDK to your project
cp sdk/SpudCenterSDK.ts ./your-project/

# Import and use
import SpudCenterSDK from './SpudCenterSDK';
const sdk = new SpudCenterSDK('https://api.yourdomain.com');
```

### Key Files
- **SDK**: [sdk/SpudCenterSDK.ts](sdk/SpudCenterSDK.ts) - Complete API client
- **Types**: TypeScript interfaces included in SDK
- **Examples**: [SDK_USAGE.md](SDK_USAGE.md) - Code examples
- **API Docs**: [openapi.yaml](openapi.yaml) - OpenAPI specification

## 🔧 API Control Methods

### Authenticate
```typescript
const auth = await sdk.login('email@example.com', 'password');
sdk.setToken(auth.token);
```

### Manage Nodes (Websites)
```typescript
// Create
const node = await sdk.createNode({
  name: 'My Website',
  url: 'https://example.com'
});

// Read
const nodes = await sdk.listNodes();
const node = await sdk.getNode('node_id');

// Update
await sdk.updateNode('node_id', { name: 'Updated' });

// Delete
await sdk.deleteNode('node_id');
```

### Manage Previews
```typescript
await sdk.createPreview('node_id', 'https://preview-url.com');
await sdk.getNodePreview('node_id');
await sdk.updatePreview('preview_id', 'https://new-url.com');
await sdk.deletePreview('preview_id');
```

## ☁️ Cloudflare Pages Deployment

### 1️⃣ Prepare Project (5 min)
```bash
# Verify build works locally
npm run build:frontend

# Check dist folder created
ls frontend/dist/
```

### 2️⃣ Connect to Cloudflare (5 min)
```
Dashboard → Pages → Create Project → Connect to Git
```

Build Settings:
```
Command: cd frontend && npm install && npm run build
Directory: frontend/dist
```

### 3️⃣ Set Environment Variables (2 min)
```
VITE_API_URL: https://api.yourdomain.com/api
NODE_ENV: production
```

### 4️⃣ Deploy Backend (10-20 min)
Choose one:
- **Railway** (easiest) → railway.app
- **Render** → render.com  
- **Heroku** → heroku.com
- **Your own server**

### 5️⃣ Update API URL (1 min)
After backend deployed, update Cloudflare:
```
VITE_API_URL: https://your-api-url/api
```

Then redeploy.

## 📋 Deployment Checklist

```
Frontend (Cloudflare Pages)
☐ Build locally with: npm run build:frontend
☐ Verify dist/ folder exists
☐ Push to GitHub
☐ Connect to Cloudflare Pages
☐ Set VITE_API_URL environment variable
☐ Deploy

Backend (External Service)
☐ Choose hosting (Railway, Render, etc.)
☐ Set environment variables:
  ☐ MONGODB_URI
  ☐ JWT_SECRET
  ☐ FRONTEND_URL
  ☐ NODE_ENV=production
☐ Deploy
☐ Test API endpoint: curl https://api.yourdomain.com/api/health

Final
☐ Update Cloudflare VITE_API_URL with deployed API URL
☐ Redeploy frontend
☐ Test login & features
```

## 🔗 API Endpoints

```
Auth
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protected)
POST   /api/auth/logout (protected)

Nodes
POST   /api/nodes (protected)
GET    /api/nodes (protected)
GET    /api/nodes/:id (protected)
PUT    /api/nodes/:id (protected)
DELETE /api/nodes/:id (protected)

Preview
POST   /api/preview (protected)
GET    /api/preview/:id (protected)
PUT    /api/preview/:id (protected)
DELETE /api/preview/:id (protected)
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build log in Cloudflare dashboard |
| 404 on routes | Verify `_redirects` file in frontend/ |
| API errors | Check `VITE_API_URL` in browser console (F12) |
| CORS errors | Verify `FRONTEND_URL` in backend env vars |
| Login fails | Check MongoDB connection & JWT_SECRET |
| Blank page | Clear cache & check browser console |

## 📚 Documentation

- [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- [SDK Usage Examples](SDK_USAGE.md)
- [API Reference](API_REFERENCE.md)
- [OpenAPI Spec](openapi.yaml)
- [Cloudflare Specific](CLOUDFLARE_DEPLOYMENT.md)

## 🎯 Key Environment Variables

**Frontend (Cloudflare Pages)**
```
VITE_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

**Backend (Your Server)**
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://your-pages-domain.pages.dev
NODE_ENV=production
```

## 💡 Pro Tips

1. **Test locally first**: `npm run build` before deploying
2. **Monitor logs**: Check Cloudflare Pages & backend server logs
3. **Use staging**: Set up preview environment with staging API
4. **Cache strategy**: Cloudflare Pages caches automatically
5. **Performance**: Monitor with Cloudflare Analytics

## 🆘 Get Help

1. Check browser console (F12)
2. Check Cloudflare Pages build logs
3. Check backend server logs
4. Review [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
5. Check [SDK_USAGE.md](SDK_USAGE.md) for examples

---

**Status**: Ready for deployment ✅

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.
