# Spud Center API SDK

Complete SDK for controlling the Spud Center API from your applications.

## Installation

### NPM
```bash
npm install spud-center-sdk
```

### Direct Import
```typescript
import SpudCenterSDK from './sdk/SpudCenterSDK.ts';
```

## Quick Start

### Browser/Frontend
```typescript
import SpudCenterSDK from 'spud-center-sdk';

// Initialize SDK
const sdk = new SpudCenterSDK('https://api.yourdomain.com');

// Register
const auth = await sdk.register('user@example.com', 'password123');
sdk.setToken(auth.token);

// Create a node
const node = await sdk.createNode({
  name: 'My Website',
  url: 'https://example.com',
  description: 'My awesome website'
});

// List all nodes
const nodes = await sdk.listNodes();
console.log(nodes);
```

### Node.js/Backend
```javascript
const SpudCenterSDK = require('spud-center-sdk').default;

const sdk = new SpudCenterSDK(process.env.API_URL);

// Use same methods as browser
```

### Python
```python
import requests

class SpudCenterSDK:
    def __init__(self, base_url, token=None):
        self.base_url = base_url.rstrip('/')
        self.token = token
        self.headers = {'Content-Type': 'application/json'}
        if token:
            self.headers['Authorization'] = f'Bearer {token}'
    
    def register(self, email, password):
        return requests.post(
            f'{self.base_url}/auth/register',
            json={'email': email, 'password': password},
            headers=self.headers
        ).json()

sdk = SpudCenterSDK('https://api.yourdomain.com')
auth = sdk.register('user@example.com', 'password123')
sdk.token = auth['token']
```

### cURL
```bash
# Register
curl -X POST https://api.yourdomain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create node (with auth token)
curl -X POST https://api.yourdomain.com/nodes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Site","url":"https://example.com"}'
```

## API Methods

### Authentication

```typescript
// Register new user
const auth = await sdk.register('email@example.com', 'password');
// Returns: { message, token, user }

// Login
const auth = await sdk.login('email@example.com', 'password');
// Returns: { message, token, user }

// Set token (after login)
sdk.setToken(auth.token);

// Get current user
const user = await sdk.getCurrentUser();

// Logout
await sdk.logout();

// Clear token
sdk.clearToken();
```

### Node Management

```typescript
// Create node
const node = await sdk.createNode({
  name: 'Website Name',
  url: 'https://example.com',
  description: 'Optional description',
  tags: ['tag1', 'tag2'],
  metadata: { custom: 'data' }
});

// List all nodes
const nodes = await sdk.listNodes();

// Get specific node
const node = await sdk.getNode('node_id');

// Update node
const updated = await sdk.updateNode('node_id', {
  name: 'New Name',
  status: 'active'
});

// Delete node
await sdk.deleteNode('node_id');
```

### Preview Management

```typescript
// Create preview for a node
const preview = await sdk.createPreview('node_id', 'https://preview-url.com');

// Get preview for node
const preview = await sdk.getNodePreview('node_id');

// Get specific preview
const preview = await sdk.getPreview('preview_id');

// Update preview
const updated = await sdk.updatePreview('preview_id', 'https://new-url.com');

// Delete preview
await sdk.deletePreview('preview_id');
```

## Error Handling

```typescript
try {
  const node = await sdk.createNode({ name: 'Test' });
} catch (error: any) {
  console.error('Error:', error.message);
  console.error('Status:', error.status);
  console.error('Data:', error.data);
}
```

## Environment Setup

### Cloudflare Pages
Set environment variable in Cloudflare Pages dashboard:
```
VITE_API_URL=https://api.yourdomain.com/api
```

### Local Development
Create `.env.local` in frontend:
```
VITE_API_URL=http://localhost:5000/api
```

### Docker
Set in `docker-compose.yml`:
```yaml
environment:
  VITE_API_URL: http://localhost:5000/api
```

## TypeScript Types

All methods are fully typed:

```typescript
import {
  User,
  Node,
  Preview,
  AuthResponse,
  AuthCredentials,
  APIError,
  NodeData,
  PreviewData
} from 'spud-center-sdk';

const sdk = new SpudCenterSDK('url');
const nodes: Node[] = await sdk.listNodes();
const auth: AuthResponse = await sdk.register('email', 'pass');
```

## Complete Example

```typescript
import SpudCenterSDK, { Node } from 'spud-center-sdk';

async function main() {
  const sdk = new SpudCenterSDK('https://api.yourdomain.com');
  
  try {
    // Register or login
    const auth = await sdk.login('user@example.com', 'password');
    sdk.setToken(auth.token);
    
    // Get current user
    const user = await sdk.getCurrentUser();
    console.log('Logged in as:', user.email);
    
    // Create multiple nodes
    const nodes: Node[] = [];
    for (let i = 1; i <= 3; i++) {
      const node = await sdk.createNode({
        name: `Website ${i}`,
        url: `https://site${i}.com`,
        tags: ['production']
      });
      nodes.push(node);
    }
    
    // Create previews for each
    for (const node of nodes) {
      await sdk.createPreview(node._id, `https://preview-${node.name}.com`);
    }
    
    // List all
    const allNodes = await sdk.listNodes();
    console.log('Total nodes:', allNodes.length);
    
  } catch (error: any) {
    console.error('API Error:', error);
  }
}

main();
```

## Support

For issues and questions, check:
- [API Documentation](./openapi.yaml)
- [Deployment Guide](./CLOUDFLARE_DEPLOYMENT.md)
- GitHub Issues
