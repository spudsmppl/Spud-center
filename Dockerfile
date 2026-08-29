# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend
COPY backend ./backend
RUN cd backend && npm install

# Copy frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Build backend
RUN cd backend && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies only
RUN npm install -g pm2

COPY package*.json ./
RUN npm install --only=production

COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copy built backend
COPY backend/dist ./backend/dist
COPY backend/src ./backend/src

# Copy frontend build
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose ports
EXPOSE 5000 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start app
CMD ["npm", "start"]
