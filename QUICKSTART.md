# SPUD-CENTER Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Step 2: Setup Environment
Backend and frontend `.env` files are already configured for local development.

### Step 3: Start MongoDB
```bash
# Option A: Using Docker (recommended)
docker run -d -p 27017:27017 --name spud-mongo mongo:6

# Option B: Using Docker Compose (full stack)
docker-compose up -d

# Option C: Using local MongoDB
mongod
```

### Step 4: Run Application
```bash
# From root directory - runs both backend and frontend
npm run dev

# Or run separately in different terminals:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

### Step 5: Access Application
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## 📝 Default Test Account
```
Email: test@example.com
Password: Test@1234
```

## 🎯 First Steps

1. **Register/Login** - Create account or login at http://localhost:3000
2. **Create a Node** - Click "ADD NEW NODE" and enter:
   - Node Name: `node-1`
   - URL: `https://www.google.com`
   - Description: `Google Homepage`
3. **Monitor Node** - Click on the node and click "START MONITORING"
4. **View Live Preview** - Click "LOAD LIVE PREVIEW" to see the website
5. **Check Status** - View real-time status updates and response times

## 🐳 Using Docker Compose (Recommended)

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up --build

# Services will be available:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - MongoDB: localhost:27017
```

## 📋 Project Structure

```
backend/
  ├── src/
  │   ├── controllers/   - Business logic
  │   ├── models/        - Database schemas
  │   ├── routes/        - API endpoints
  │   ├── middleware/    - Auth & security
  │   └── index.ts       - Server entry
  └── package.json

frontend/
  ├── src/
  │   ├── pages/        - Login, Register, Dashboard, NodeDetail
  │   ├── components/   - Reusable components
  │   ├── api/          - API client
  │   ├── store.ts      - State management
  │   └── styles/       - CSS styling
  └── package.json
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Protected routes
- ✅ Secure token storage

## 🛠️ Useful Commands

```bash
# Backend
cd backend
npm run dev          # Development mode
npm run build        # Build TypeScript
npm start            # Run production build

# Frontend
cd frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build

# Root
npm run dev          # Run both backend and frontend
npm run build        # Build both
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000 && kill -9 <PID>

# Kill process on port 5000
lsof -i :5000 && kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker ps | grep mongo

# Or start MongoDB:
docker run -d -p 27017:27017 --name spud-mongo mongo:6
```

### API Connection Issues
- Ensure backend is running on http://localhost:5000
- Check VITE_API_URL in frontend/.env
- Clear browser cache and localStorage

## 📚 Next Steps

1. **Customize Styling** - Edit `frontend/src/styles/global.css`
2. **Add More Nodes** - Create multiple nodes for different websites
3. **Deploy** - Use Docker or your preferred hosting platform
4. **Integrate APIs** - Connect to external services
5. **Monitor Websites** - Set up continuous monitoring

## 🚢 Deployment

### Docker
```bash
docker build -t spud-center .
docker run -p 3000:3000 -p 5000:5000 spud-center
```

### Production Environment
Set these environment variables:
```
MONGODB_URI=<production-mongodb-url>
JWT_SECRET=<secure-secret-key>
NODE_ENV=production
FRONTEND_URL=<frontend-domain>
```

## 📞 Support

For issues or questions:
1. Check the main README.md
2. Review API documentation
3. Check logs: `docker-compose logs -f`

---

Happy monitoring! 🎉
