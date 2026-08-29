# API Reference Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "viewer"
  }
}
```

### 2. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "viewer"
  }
}
```

### 3. Get Current User
**GET** `/auth/me` (Protected)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "viewer",
  "createdAt": "2024-01-01T12:00:00Z",
  "lastLogin": "2024-01-02T14:30:00Z",
  "isActive": true
}
```

### 4. Logout
**POST** `/auth/logout` (Protected)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## Node Management Endpoints

### 1. Create Node
**POST** `/nodes` (Protected)

**Request:**
```json
{
  "name": "node-1",
  "url": "https://example.com",
  "description": "My Example Website",
  "checkInterval": 60000
}
```

**Response:**
```json
{
  "message": "Node created successfully",
  "node": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "node-1",
    "url": "https://example.com",
    "status": "live",
    "statusCode": 200,
    "responseTime": 145,
    "isMonitoring": false,
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

### 2. List All Nodes
**GET** `/nodes` (Protected)

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "node-1",
    "url": "https://example.com",
    "status": "live",
    "statusCode": 200,
    "responseTime": 145,
    "isMonitoring": true,
    "lastChecked": "2024-01-02T14:30:00Z"
  }
]
```

### 3. Get Node Details
**GET** `/nodes/:id` (Protected)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "node-1",
  "url": "https://example.com",
  "status": "live",
  "statusCode": 200,
  "responseTime": 145,
  "isMonitoring": true,
  "lastChecked": "2024-01-02T14:30:00Z",
  "description": "My Example Website",
  "checkInterval": 60000,
  "createdBy": "507f1f77bcf86cd799439011"
}
```

### 4. Update Node
**PUT** `/nodes/:id` (Protected)

**Request:**
```json
{
  "name": "node-1-updated",
  "url": "https://example-updated.com",
  "description": "Updated Description",
  "checkInterval": 120000
}
```

**Response:**
```json
{
  "message": "Node updated successfully",
  "node": { /* updated node object */ }
}
```

### 5. Delete Node
**DELETE** `/nodes/:id` (Protected)

**Response:**
```json
{
  "message": "Node deleted successfully"
}
```

### 6. Get Node Status
**GET** `/nodes/:id/status` (Protected)

**Response:**
```json
{
  "status": "live",
  "statusCode": 200,
  "responseTime": 142,
  "success": true
}
```

### 7. Start Monitoring
**POST** `/nodes/:id/monitor/start` (Protected)

**Response:**
```json
{
  "message": "Monitoring started",
  "node": { /* node object with isMonitoring: true */ }
}
```

### 8. Stop Monitoring
**POST** `/nodes/:id/monitor/stop` (Protected)

**Response:**
```json
{
  "message": "Monitoring stopped",
  "node": { /* node object with isMonitoring: false */ }
}
```

---

## Preview Endpoints

### 1. Capture Preview
**POST** `/preview/:id/capture` (Protected)

**Response:**
```json
{
  "message": "Preview captured successfully",
  "preview": {
    "_id": "507f1f77bcf86cd799439013",
    "nodeId": "507f1f77bcf86cd799439012",
    "title": "Example Domain",
    "description": "Example Domain. This domain is for use in examples...",
    "htmlSnapshot": "<!DOCTYPE html>...",
    "lastCaptured": "2024-01-02T14:30:00Z"
  }
}
```

### 2. Get Stored Preview
**GET** `/preview/:id` (Protected)

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "nodeId": "507f1f77bcf86cd799439012",
  "title": "Example Domain",
  "description": "Example Domain description",
  "htmlSnapshot": "<!DOCTYPE html>...",
  "lastCaptured": "2024-01-02T14:30:00Z"
}
```

### 3. Get Live Preview
**GET** `/preview/:id/live` (Protected)

**Response:**
```json
{
  "title": "Example Domain",
  "content": "<!DOCTYPE html>...",
  "statusCode": 200,
  "lastFetched": "2024-01-02T14:35:00Z"
}
```

---

## Status Codes

### Success
- **200** - OK
- **201** - Created

### Client Errors
- **400** - Bad Request
- **401** - Unauthorized (Invalid/Missing token)
- **403** - Forbidden (Insufficient permissions)
- **404** - Not Found

### Server Errors
- **500** - Internal Server Error

---

## Error Response Format

```json
{
  "message": "Error description"
}
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Curl Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Create Node
```bash
curl -X POST http://localhost:5000/api/nodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name":"node-1",
    "url":"https://example.com",
    "description":"My Site"
  }'
```

### Get Nodes
```bash
curl -X GET http://localhost:5000/api/nodes \
  -H "Authorization: Bearer <token>"
```

### Get Node Status
```bash
curl -X GET http://localhost:5000/api/nodes/<id>/status \
  -H "Authorization: Bearer <token>"
```

---

## Node Status Values

| Status | Code | Meaning |
|--------|------|---------|
| `live` | 200-299 | Website is online |
| `unstable` | 400-599 | Website has errors |
| `stopped` | 0, timeout | Website is unreachable |

---

## Security Headers

All responses include security headers:
- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## Data Retention

- **User Sessions:** 7 days (configurable)
- **Node Data:** Stored indefinitely
- **Status History:** Stored with each status check
- **Previews:** Captured on demand or scheduled

---

## Pagination (Future)

The API currently returns all results. Pagination will be added with:
- `?page=1`
- `?limit=20`
- `?sort=createdAt`

---

## WebSocket Support (Future)

Real-time monitoring will use WebSocket connections:
- `ws://localhost:5000/ws/nodes/:id`
- Subscribe to live status updates
- Get instant notifications on status changes
