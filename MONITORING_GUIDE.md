# Node Monitoring Guide

## 📊 Understanding Node Monitoring

This guide explains how to set up, configure, and manage node monitoring in SPUD-CENTER.

## 🎯 What is a Node?

A **Node** is a monitored website or API endpoint. Each node tracks:
- Real-time status (live, stopped, unstable)
- Response time performance
- HTTP status codes
- Last check timestamp
- Monitoring history

## 🔧 Creating Your First Node

### Step 1: Navigate to Dashboard
1. Log in to SPUD-CENTER
2. Go to Dashboard at `/dashboard`

### Step 2: Click "ADD NEW NODE"
The node creation form will appear with these fields:

| Field | Description | Example |
|-------|-------------|---------|
| **Node Name** | Unique identifier for your node | `node-1`, `api-server-prod` |
| **URL** | Website or API endpoint to monitor | `https://example.com` |
| **Description** | Optional description | `Production API Server` |

### Step 3: Configure Node
```json
{
  "name": "node-1",
  "url": "https://api.example.com",
  "description": "Production API"
}
```

### Step 4: Confirm Creation
- Click "CREATE NODE"
- System will perform initial status check
- Node appears on dashboard with status indicator

## 🟢 Understanding Status Indicators

### Status Colors

| Status | Color | Meaning | Code |
|--------|-------|---------|------|
| **LIVE** | 🟢 Green | Website is online | 200-299 |
| **UNSTABLE** | 🟡 Yellow | Website has errors | 400-599 |
| **STOPPED** | 🔴 Red | Website is down | Connection failed |

### Status Pulse Animation
- Status indicators pulse to show they're being monitored
- Rapid pulse = active monitoring
- Steady = manual check only

## 📈 Monitoring Your Nodes

### Enable Auto-Monitoring

1. Click on a node card to open details
2. Click "START MONITORING" button
3. Node will now check status every 30 seconds
4. Status updates in real-time

### What Gets Tracked

```
✓ Status code (200, 404, 500, etc.)
✓ Response time (milliseconds)
✓ Availability (online/offline)
✓ Last check timestamp
✓ Historical data
```

### Manual Status Check

Even with monitoring disabled, you can:
1. Click "REFRESH STATUS" to check immediately
2. Get instant status update
3. View current response time

## 📱 Live Preview Feature

### Capture Website Preview

1. Navigate to node details
2. Scroll to "Live Preview" section
3. Click "LOAD LIVE PREVIEW"
4. Website renders in iframe

### Preview Shows

- 📄 Website title
- 📝 Meta description
- 🔍 Current HTML content
- ⏰ Time preview was captured

### Use Cases

- Verify website content before incidents
- Monitor design changes
- Check for error pages
- Validate content updates

## 📊 Status History & Analytics

### Viewing History

1. Open node details page
2. Scroll to "Status History" section
3. Last 10 status changes shown
4. Each entry shows:
   - Status (LIVE/UNSTABLE/STOPPED)
   - Timestamp
   - Response time

### Performance Metrics

- **Response Time** - How quickly the website responds (ms)
- **Uptime** - Percentage of time website was live
- **Last Checked** - Most recent status check
- **Check Interval** - How often monitoring checks

## 🛠️ Advanced Configuration

### Adjust Check Interval

Update the monitoring frequency (default: 60 seconds):

```typescript
{
  "name": "node-1",
  "url": "https://example.com",
  "checkInterval": 30000  // 30 seconds
}
```

### API Key for External Access

Each node gets a unique API key:
```
key_1704110400000_a1b2c3d4e
```

Use for:
- External monitoring services
- Custom integrations
- WebHook notifications

## 🔔 Monitoring Scenarios

### Scenario 1: Production Website Monitoring
```
Node Name: prod-web
URL: https://example.com
Interval: 60 seconds
Alert: Instant notification if status changes
```

### Scenario 2: API Health Monitoring
```
Node Name: api-endpoint
URL: https://api.example.com/health
Interval: 30 seconds
Alert: Status change or timeout
```

### Scenario 3: Database Server Monitoring
```
Node Name: db-server
URL: https://db.example.com:5432/health
Interval: 120 seconds
Alert: Connection timeout
```

## ⚠️ Troubleshooting

### Node Shows "STOPPED" but Website is Live

**Possible Causes:**
1. URL is incorrect
2. Website requires authentication
3. CORS restrictions
4. SSL certificate issues

**Solutions:**
```bash
# Test URL from terminal
curl -I https://example.com

# Check with verbose output
curl -v https://example.com

# Verify SSL
curl --cacert /path/to/cert https://example.com
```

### Response Time is Very High

**Possible Causes:**
1. Network latency
2. Server is slow
3. Large page size
4. Many resources loading

**Solutions:**
- Optimize server performance
- Reduce page size
- Use CDN
- Check server resources

### Live Preview Fails

**Possible Causes:**
1. Website blocks iframe embedding
2. Authentication required
3. CORS restrictions
4. Server-side rendering issues

**Solutions:**
- Check website security headers
- Verify no X-Frame-Options: DENY
- Ensure public access to website

## 🚀 Best Practices

### 1. Naming Conventions
```
✓ Good Names:
  - prod-web-server
  - api-endpoint-1
  - cdn-cache-status

✗ Avoid:
  - test123
  - random-name
  - x
```

### 2. Monitoring Frequency
```
✓ For Critical Services: 30-60 seconds
✓ For Non-Critical: 5-10 minutes
✓ For Heavy Load: 30+ minutes
```

### 3. URL Configuration
```
✓ Use /health endpoints
✓ Always use HTTPS
✓ Include protocol (https://)
✓ Avoid query parameters

✗ Avoid:
  - example.com (missing protocol)
  - Changing URLs frequently
  - Endpoints that modify data
```

### 4. Monitoring Strategy
```
✓ Monitor critical services
✓ Set up alerts for changes
✓ Review history regularly
✓ Document each node's purpose
```

## 📋 Checklist: Setting Up Monitoring

- [ ] Create account and login
- [ ] Create first node with production URL
- [ ] Enable monitoring on node
- [ ] Test status check and preview
- [ ] Add more nodes as needed
- [ ] Review status history
- [ ] Configure check intervals
- [ ] Test alert notifications
- [ ] Document monitoring strategy

## 🔐 Security Considerations

### Monitor Only Public Services
- Don't monitor private/internal services
- Ensure node URLs are publicly accessible
- Use VPN if accessing internal networks

### Protect API Keys
- Don't share node API keys
- Regenerate if compromised
- Use different keys for different services

### Rate Limiting
- System limits 100 checks per 15 minutes
- Adjust intervals to stay within limits
- Use bulk operations when possible

## 📞 Getting Help

### Common Issues

1. **"Node not found"** - Node was deleted or you don't have permission
2. **"Invalid URL"** - Check URL format (must include https://)
3. **"Token expired"** - Log out and log back in
4. **"CORS error"** - Website blocks monitoring requests

### Support Resources

- Check API Reference for endpoint details
- Review QUICKSTART.md for setup help
- Check main README.md for architecture

## 🎓 Advanced Topics

### Custom Health Check Endpoints

Create a dedicated health check endpoint:

```javascript
// Node.js Express example
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: 'connected'
  });
});
```

### Integration with External Services

Use node API key for:
- PagerDuty webhooks
- Slack notifications
- Custom dashboards
- External monitoring tools

### Batch Monitoring

Monitor multiple nodes simultaneously:
- Create nodes with consistent naming
- Batch status checks via API
- Aggregate results
- Single dashboard view

---

**Happy Monitoring!** 🚀

For more information, check the main README.md or API_REFERENCE.md
