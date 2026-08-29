# Cloudflare Pages Deployment Guide

## Setup Instructions

### 1. Connect Your Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** → **Create a project** → **Connect to Git**
3. Select your GitHub/GitLab repository
4. Choose the following build settings:
   - **Framework preset**: None (custom)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/dist`

### 2. Environment Variables

In Cloudflare Pages dashboard, set the following environment variables:

```
VITE_API_URL=https://your-api-domain.com/api
NODE_ENV=production
```

For development/preview environments:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Deploy Workflow

```bash
# Build locally
cd frontend
npm install
npm run build

# The dist folder will be deployed to Cloudflare Pages
```

## API Deployment Options

### Option A: Use External API (Recommended)

If your backend is already hosted elsewhere (AWS, Heroku, Railway, etc.):
- Set `VITE_API_URL` to your backend URL
- No additional configuration needed

### Option B: Deploy Backend to Cloudflare Workers

For deploying the Express backend to Cloudflare Workers, you'll need to:

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Create a `wrangler.toml` in the backend folder with Worker-compatible configuration
3. Use a middleware to adapt Express to Cloudflare Workers

### Option C: Deploy Backend Separately

- Deploy backend to Railway, Render, Heroku, or your own server
- Update the `VITE_API_URL` environment variable in Cloudflare Pages

## Troubleshooting Build Errors

### Error: "Build failed"

**Possible causes:**
1. Missing build script in package.json
2. Node version mismatch
3. Missing dependencies

**Solutions:**
```bash
# Ensure package.json has correct scripts
npm run build  # Test locally first

# Check node version compatibility
node --version  # Should be 18+ for this project

# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Cannot find module"

- Ensure all dependencies are in package.json (not just devDependencies)
- Run `npm install` in the build command before `npm run build`

### Routing Issues (404 on refresh)

The `_redirects` file handles SPA routing. Verify it exists in the frontend folder with:
```
/* /index.html 200
```

## Monitoring & Analytics

After deployment:
1. Go to Cloudflare Pages dashboard
2. View build logs for any warnings
3. Check Analytics to monitor traffic

## Custom Domain

1. In Cloudflare Pages, click on your project
2. Go to **Custom domains**
3. Add your domain and follow DNS configuration steps
4. Update your API client with the new domain in environment variables

## Security Headers

Cloudflare automatically adds security headers. For additional configuration:

1. In Cloudflare dashboard, go to **Rules** → **Transform Rules**
2. Add custom headers as needed

## Next Steps

1. Test the build locally: `npm run build`
2. Push to your repository
3. Monitor the first deployment in Cloudflare Pages dashboard
4. Update your `VITE_API_URL` once your backend is deployed
