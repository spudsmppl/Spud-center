# SPUD-CENTER - JARVIS Control Center

A sophisticated, JARVIS-like control center for managing and monitoring websites and APIs with real-time status updates, live previews, and secure authentication.

## Features

✨ **Core Features:**
- 🔐 Secure Login & Registration System (Protected with JWT)
- 📊 Real-time Node Monitoring (Status: Live, Stopped, Unstable)
- 🔗 Dynamic Node Management (Create, Update, Delete nodes)
- 📈 Live Website Previews
- 📊 Response Time Tracking
- 🔄 Continuous Monitoring Service
- 💾 Persistent Data Storage (MongoDB)
- 🎨 JARVIS-like Dark UI with Glowing Effects
- 📱 Fully Responsive Design
- 🛡️ Secure Data Protection (No Client-Side Inspection)

## Architecture

```
Spud-Center/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & security
│   │   ├── utils/           # Database, helpers
│   │   └── index.ts         # Server entry point
│   └── package.json
├── frontend/                # React + TypeScript UI
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API client
│   │   ├── store.ts        # State management
│   │   ├── App.tsx         # Main component
│   │   ├── main.tsx        # Entry point
│   │   └── styles/         # Global styles
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml       # Containerization
├── Dockerfile              # Docker build config
├── package.json            # Root scripts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+ or Docker
- MongoDB (or use Docker)
- npm or yarn

### Local Development Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Spud-center
```

2. **Install root dependencies:**
```bash
npm install
```

3. **Setup Backend:**
```bash
cd backend
cp .env.example .env
npm install
# Edit .env with your configuration
```

4. **Setup Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
```

5. **Start MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name spud-mongo mongo:6

# Or use local MongoDB
mongod
```

6. **Run in development mode:**
```bash
# From root directory
npm run dev

# Or run separately:
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/health

### Docker Setup

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
GET    /api/auth/me              - Get current user (requires token)
POST   /api/auth/logout          - Logout user
```

### Nodes Management
```
GET    /api/nodes                - List all nodes
POST   /api/nodes                - Create new node
GET    /api/nodes/:id            - Get node details
PUT    /api/nodes/:id            - Update node
DELETE /api/nodes/:id            - Delete node
GET    /api/nodes/:id/status     - Check node status
POST   /api/nodes/:id/monitor/start  - Start monitoring
POST   /api/nodes/:id/monitor/stop   - Stop monitoring
```

### Live Previews
```
POST   /api/preview/:id/capture  - Capture website snapshot
GET    /api/preview/:id          - Get stored preview
GET    /api/preview/:id/live     - Get live preview
```

## Authentication & Security

### Security Features
- ✅ **JWT Token Authentication** - Secure token-based auth
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **CORS Protection** - Restricted cross-origin access
- ✅ **Rate Limiting** - API rate limiting to prevent abuse
- ✅ **Helmet.js** - Security headers
- ✅ **XSS Protection** - Secure data handling
- ✅ **No Client-Side Inspection** - Sensitive data never exposed to client

### Login Flow
1. User registers/logs in
2. Backend validates credentials
3. JWT token is issued
4. Token stored in localStorage (secure)
5. Token included in all API requests
6. Automatic token validation and refresh

## Node Status Indicators

- 🟢 **LIVE** - Website is responding normally (200-299 status)
- 🔴 **STOPPED** - Website is down or unreachable
- 🟡 **UNSTABLE** - Website is responding but with errors (4xx-5xx)

## Monitoring

### Auto-Monitoring Features
- Real-time status checking (configurable intervals)
- Response time tracking
- Status history
- Historical data storage
- Automatic alerts on status changes

### Manual Controls
- Start/Stop monitoring for individual nodes
- Manual status refresh
- Capture live previews
- View status history

## Database Schema

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (admin/viewer),
  createdAt: Date,
  lastLogin: Date,
  isActive: Boolean
}
```

### Node Collection
```javascript
{
  name: String (unique),
  url: String,
  status: String (live/stopped/unstable),
  statusCode: Number,
  responseTime: Number,
  lastChecked: Date,
  isMonitoring: Boolean,
  checkInterval: Number (ms),
  apiKey: String,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Preview Collection
```javascript
{
  nodeId: ObjectId (Node),
  title: String,
  description: String,
  htmlSnapshot: String,
  lastCaptured: Date,
  captureInterval: Number (ms)
}
```

## Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spud-center
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
ENVIRONMENT=development
NODE_ENV=development
ADMIN_EMAIL=admin@spudcenter.com
ADMIN_PASSWORD=ChangeMe123!
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

## Usage Guide

### 1. Register Account
- Visit http://localhost:3000/register
- Enter email and password (min 8 characters)
- Account created with 'viewer' role

### 2. Login
- Visit http://localhost:3000/login
- Enter credentials
- JWT token generated and stored

### 3. Create Node
- Click "ADD NEW NODE" on dashboard
- Enter node name, website URL, and description
- System automatically checks initial status
- Node appears on dashboard

### 4. Monitor Node
- Click on node card to view details
- Click "START MONITORING" to enable auto-monitoring
- Monitor will check status every 30 seconds
- View live preview by clicking "LOAD LIVE PREVIEW"

### 5. View Analytics
- Status history shows recent status changes
- Response time tracking for performance analysis
- Last checked timestamp for monitoring verification

## Development

### Backend Development
```bash
cd backend

# Start in development mode (auto-reload)
npm run dev

# Build TypeScript
npm run build

# Start production build
npm start
```

### Frontend Development
```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting
```bash
cd frontend
npm run lint
```

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy with Docker
```bash
# Build image
docker build -t spud-center:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  -p 3000:3000 \
  -e MONGODB_URI=<your-mongodb-url> \
  -e JWT_SECRET=<your-secret> \
  spud-center:latest
```

### Environment-Specific Configuration
- Development: Use local MongoDB, debugging enabled
- Production: Use managed MongoDB, rate limiting increased, security headers strict

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If using Docker
docker ps | grep mongo
docker logs spud-center-db
```

### Port Already in Use
```bash
# Frontend (3000)
lsof -i :3000
kill -9 <PID>

# Backend (5000)
lsof -i :5000
kill -9 <PID>
```

### API Connection Issues
- Check VITE_API_URL in frontend .env
- Ensure backend is running on correct port
- Check CORS settings in backend

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT_SECRET is set correctly
- Verify token expiration time

## Performance Optimization

- ✅ Lazy loading on dashboard
- ✅ Caching of node data
- ✅ Optimized MongoDB queries
- ✅ Frontend code splitting
- ✅ Minimize API calls with batching
- ✅ Response compression

## Security Best Practices

1. **Change default JWT_SECRET** in production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Implement rate limiting** on all endpoints
5. **Regular security audits** and updates
6. **Monitor logs** for suspicious activity
7. **Keep dependencies updated**

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions:
1. Open an issue on GitHub
2. Contact the development team
3. Check documentation and FAQs

## Roadmap

- [ ] Webhook integration for external alerts
- [ ] Advanced analytics and reporting
- [ ] Email notifications
- [ ] Slack integration
- [ ] API key management
- [ ] Role-based access control (RBAC)
- [ ] Multi-user collaboration
- [ ] Custom domain support
- [ ] API rate limiting per user
- [ ] Advanced filtering and search

## Changelog

### v1.0.0 (Current)
- Initial release
- Core monitoring functionality
- Real-time status tracking
- Live preview capability
- Secure authentication
- Full CRUD operations for nodes

## Credits

Built with ❤️ using:
- Node.js & Express
- React & TypeScript
- MongoDB
- Zustand for state management
- Docker & Docker Compose

---

**SPUD-CENTER v1.0** | JARVIS Control Center for Website Management