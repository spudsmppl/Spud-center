# Cloudflare Pages & Workers Deployment Guide

## Prerequisites

- Cloudflare Account (free tier works)
- GitHub/GitLab repository with this project
- Node.js 18+ installed locally

## Step 1: Prepare Your Project for Cloudflare Pages

### Local Build Test
```bash
# Test the build locally
cd frontend
npm install
npm run build

# Check if dist folder was created successfully
ls -la dist/
```

## Step 2: Connect to Cloudflare Pages

### Via GitHub/GitLab Integration (Recommended)

1. **Sign in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your account

2. **Navigate to Pages**
   - In sidebar, click "Pages"
   - Click "Create a project"
   - Click "Connect to Git"

3. **Select Repository**
   - Choose GitHub or GitLab
   - Authorize Cloudflare
   - Select your repository
   - Click "Begin setup"

4. **Configure Build Settings**
   ```
   Project name: spud-center (or your choice)
   Production branch: main (or your branch)
   Framework preset: None
   Build command: cd frontend && npm install && npm run build
   Build output directory: frontend/dist
   ```

5. **Add Environment Variables**
   - In "Environment variables" section, add:
   ```
   VITE_API_URL = https://your-api-domain.com/api
   NODE_ENV = production
   ```

6. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (usually 2-5 minutes)

### Deploy Log Troubleshooting
If build fails:
1. Click on the failed deployment
2. View "Build log"
3. Search for errors (common: missing dependencies, node version)

## Step 3: Deploy Your API

### Option A: Use External Hosted Backend (Recommended for Beginners)

Deploy your Express backend to any of these platforms:

#### Railway (Easiest)
1. Push your code to GitHub
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   FRONTEND_URL=https://your-pages-domain.com
   NODE_ENV=production
   ```
6. Railway will deploy automatically

#### Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Set build command: `cd backend && npm run build`
5. Set start command: `node dist/index.js`
6. Add environment variables (same as above)

#### Heroku Alternative
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create spud-center-api

# Set environment variables
heroku config:set \
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/spud-center \
  JWT_SECRET=your-secret-key \
  FRONTEND_URL=https://your-pages-domain.com

# Deploy
git push heroku main
```

### Option B: Deploy Backend to Cloudflare Workers

For serverless deployment without running a server:

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Create `backend/wrangler.toml`**
   ```toml
   name = "spud-center-api"
   type = "javascript"
   account_id = "your_account_id"
   workers_dev = true
   
   [env.production]
   vars = { FRONTEND_URL = "https://your-pages-domain.com" }
   
   [env.development]
   vars = { FRONTEND_URL = "http://localhost:3000" }
   ```

3. **Adapt Express to Workers**
   - You'll need middleware like `itty-router` or `worktop`
   - This requires significant refactoring

**Note:** Cloudflare Workers + MongoDB can work but requires special setup for database connectivity.

### Option C: Docker Deployment

Deploy using Docker to any platform (AWS, Digital Ocean, etc.):

```bash
# Build Docker image
docker build -t spud-center .

# Run locally (test)
docker run -p 3000:3000 -p 5000:5000 \
  -e MONGODB_URI=mongodb://... \
  -e JWT_SECRET=your-secret \
  spud-center

# Push to Docker Hub
docker tag spud-center your-username/spud-center
docker push your-username/spud-center
```

## Step 4: Connect Frontend to Backend

After deploying backend, update Cloudflare Pages environment:

1. In Cloudflare Pages dashboard, select your project
2. Go to "Settings" → "Environment variables"
3. Update `VITE_API_URL`:
   ```
   Production: https://api.yourdomain.com/api
   Preview: https://api-staging.yourdomain.com/api (optional)
   ```
4. Redeploy: Click "Deployments" → latest → "Retry deployment"

## Step 5: Custom Domain

1. In Cloudflare Pages, go to "Custom domains"
2. Add your domain (e.g., `app.yourdomain.com`)
3. Verify DNS records match Cloudflare setup

## Step 6: Testing

### Test Frontend
```bash
# Visit your Pages domain
https://your-project.pages.dev

# Should see login page
# Check browser console for API errors (F12)
```

### Test API Connection
```bash
# Check health endpoint
curl https://your-pages-domain/api/health

# Or use the API directly
curl -X POST https://your-api-domain/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test Full Flow
```bash
# 1. Register account
# 2. Login
# 3. Create a node
# 4. View in dashboard
```

## Common Issues & Solutions

### Build Failed: "Cannot find module"
**Fix:**
```bash
# Ensure dependencies are listed
cd frontend && npm list

# Rebuild with fresh install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Build Failed: "Timeout"
**Fix:**
- Increase build timeout in Cloudflare Pages settings
- Optimize dependencies (reduce npm packages)
- Use `--ignore-scripts` if needed

### API Errors: CORS Issues
**Fix in backend `src/index.ts`:**
```typescript
app.use(cors({
  origin: 'https://your-pages-domain.pages.dev',
  credentials: true
}));
```

### API Errors: 404 on /api endpoints
**Check:**
1. API server is running
2. `VITE_API_URL` environment variable is set correctly
3. Browser console shows correct API URL (F12)

### Blank Page After Deploy
**Fixes:**
1. Check browser console for errors (F12)
2. Verify `_redirects` file exists in frontend folder
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check Cloudflare Pages build log

### Cannot Login
**Troubleshoot:**
1. Test API directly: `curl https://api.yourdomain/api/auth/login`
2. Check MongoDB connection in backend logs
3. Verify JWT_SECRET is set
4. Check CORS headers in browser Network tab (F12)

## Performance Optimization

### Cloudflare Pages
- Automatically cached globally
- Gzip compression enabled by default
- Use Cloudflare analytics for insights

### Image Optimization
```bash
# Optimize images before upload
npm install -g imagemin-cli
imagemin 'src/**/*.{jpg,png}' --out-dir=dist
```

### Production Checklist
- [ ] Build locally and verify `dist/` folder
- [ ] Test with production environment variables
- [ ] Verify API URL in browser console
- [ ] Test login and core features
- [ ] Check Cloudflare Pages analytics
- [ ] Monitor error logs
- [ ] Set up email notifications for failures

## Environment Variables Reference

**Cloudflare Pages:**
```
VITE_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

**Backend Server:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/spud-center
JWT_SECRET=your-super-secret-key-change-in-production
FRONTEND_URL=https://your-pages-domain.pages.dev
NODE_ENV=production
```

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
- [API Documentation](./API_REFERENCE.md)
- [SDK Usage Guide](./SDK_USAGE.md)
