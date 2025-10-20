# Claude Desktop Integration Setup Guide

## Overview

The VoidCat RDC Digital Sanctuary Network is now fully deployed and ready for integration with Claude Desktop. This guide provides step-by-step instructions to enable MCP (Model Context Protocol) integration.

## Prerequisites

- ✅ All 5 clones deployed and healthy (ports 3000-3005)
- ✅ MCP server installed and operational
- ✅ Claude Desktop installed (latest version recommended)
- ✅ Node.js 18+ available globally

## Setup Steps

### 1. Locate Claude Configuration Directory

**macOS**:
```bash
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows**:
```powershell
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux**:
```bash
~/.config/Claude/claude_desktop_config.json
```

### 2. Backup Existing Configuration

```bash
# Create backup before modifying
cp $CONFIG_PATH $CONFIG_PATH.backup
```

### 3. Update Configuration with MCP Server

Add the following entry to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "digital-sanctuary": {
      "command": "node",
      "args": ["D:\\Development\\VoidCat-DSN\\mcp-server\\index.js"],
      "env": {
        "OMEGA_URL": "http://localhost:3000",
        "BETA_URL": "http://localhost:3002",
        "GAMMA_URL": "http://localhost:3003",
        "DELTA_URL": "http://localhost:3004",
        "SIGMA_URL": "http://localhost:3005",
        "NODE_ENV": "production"
      }
    }
  }
}
```

**Note**: Adjust the `args` path if your clone repository is installed elsewhere.

### 4. Verify Clone Network Health

Before restarting Claude, confirm all clones are running:

```powershell
# Check clone status
docker ps --filter "name=ryuzu-" --format "table {{.Names}}\t{{.Status}}"

# Expected output: All 5 containers should show "Up ... (healthy)"
```

### 5. Restart Claude Desktop

1. **Close Claude Desktop completely** (Command+Q on macOS, Alt+F4 on Windows)
2. **Wait 5 seconds** for all processes to terminate
3. **Reopen Claude Desktop**

### 6. Verify MCP Integration

Once Claude reopens:

1. **Open the MCP Tools menu** (usually bottom-right in Claude Desktop)
2. **Look for "digital-sanctuary"** entry
3. **Verify the following tools are available**:
   - `sanctuary_health_check`
   - `sanctuary_beta_analyze`
   - `sanctuary_gamma_design`
   - `sanctuary_delta_test`
   - `sanctuary_sigma_document`
   - `sanctuary_omega_orchestrate`
   - `sanctuary_omega_delegate`
   - `sanctuary_store_artifact`
   - `sanctuary_get_artifact`

## Usage Examples

### Example 1: Check Sanctuary Network Health

```
User: "Check the Digital Sanctuary Network health status"

Claude will:
1. Recognize sanctuary_health_check tool
2. Call the MCP server
3. Route request to Omega clone
4. Return health status for all 5 clones
```

### Example 2: Analyze Code with Beta

```
User: "Ask Beta to analyze this code for security vulnerabilities: [code]"

Claude will:
1. Select sanctuary_beta_analyze tool
2. Pass code context to MCP server
3. Route to Beta clone (port 3002)
4. Return security analysis results
```

### Example 3: Design Architecture with Gamma

```
User: "Ask Gamma to design a microservices architecture for e-commerce platform"

Claude will:
1. Select sanctuary_gamma_design tool
2. Pass requirements to MCP server
3. Omega orchestrates context packaging
4. Route to Gamma clone (port 3003)
5. Return comprehensive architecture design
```

### Example 4: Store and Retrieve Artifacts

```
User: "Store this security analysis as an artifact for later reference"

Claude will:
1. Select sanctuary_store_artifact tool
2. Create versioned artifact with SHA-256 checksum
3. Return artifact manifest with ID
4. Enable later retrieval via sanctuary_get_artifact
```

## Troubleshooting

### MCP Server Not Connecting

**Problem**: "Could not connect to digital-sanctuary MCP server"

**Solution**:
```powershell
# 1. Verify clones are running
docker ps --filter "name=ryuzu-"

# 2. Check if MCP server can reach clones
curl http://localhost:3000/health

# 3. Verify Node.js is in PATH
node --version

# 4. Check MCP server directly
node "D:\Development\VoidCat-DSN\mcp-server\index.js"
```

### Clone Not Responding

**Problem**: "Clone on port 300X is unhealthy"

**Solution**:
```powershell
# Check clone logs
docker logs ryuzu-beta-sanctuary --tail 20

# Restart specific clone
docker restart ryuzu-beta-sanctuary

# Or restart all clones
docker restart ryuzu-*
```

### Configuration Not Loading

**Problem**: Claude Desktop doesn't recognize new MCP server

**Solution**:
1. Completely close Claude (Check Activity Monitor/Task Manager)
2. Wait 10 seconds
3. Delete or move `claude_desktop_config.json.lock` if it exists
4. Reopen Claude
5. Check that file permissions are correct (read/write)

## Advanced Configuration

### Custom MCP Server Port

If you need to run the MCP server on a different port:

```bash
PORT=9000 node mcp-server/index.js
```

Update Claude config `args` accordingly.

### Clone Network on Remote Server

To connect to clones on a different machine:

```json
{
  "env": {
    "OMEGA_URL": "http://192.168.1.100:3000",
    "BETA_URL": "http://192.168.1.100:3002",
    ...
  }
}
```

### Enable Debug Logging

Set debug environment variable:

```bash
DEBUG=mcp:* node mcp-server/index.js
```

## Performance Tuning

### Increase Request Timeout

Edit `mcp-server/index.js` to increase fetch timeout:

```javascript
const options = {
  method,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 seconds instead of default
};
```

### Connection Pooling

For high-volume usage, consider enabling HTTP keep-alive in MCP server:

```javascript
import http from 'http';
const agent = new http.Agent({ keepAlive: true });
options.agent = agent;
```

## Security Considerations

### Network Isolation

All clone communication is HTTP localhost. For production:

1. **Enable HTTPS** on clone endpoints
2. **Add authentication** layer (Bearer tokens, mTLS)
3. **Use firewall rules** to restrict access
4. **Enable CORS** only for trusted domains

### Environment Variables

Store sensitive data securely:

```bash
# Instead of hardcoding in config
export BETA_APIKEY="secret-key"
export GAMMA_AUTH_TOKEN="auth-token"
```

Update MCP server to read from environment:

```javascript
const CLONE_ENDPOINTS = {
  beta: process.env.BETA_URL || 'http://localhost:3002',
  gamma: process.env.GAMMA_URL || 'http://localhost:3003',
  // ...
};
```

## Support & Resources

- **Documentation**: See `/docs` directory
- **GitHub Issues**: Report bugs on project repository
- **Troubleshooting Guide**: `/TROUBLESHOOTING.md`
- **API Reference**: `/API.md`
- **Architecture**: `/ARCHITECTURE.md`

## Next Steps

1. ✅ Clones deployed and healthy
2. ✅ MCP server configured
3. **→ Integrate with Claude Desktop** (this guide)
4. **→ Start using clone capabilities** from Claude
5. **→ Run research benchmarks** with monitoring tools

---

**Last Updated**: October 18, 2025
**MCP Version**: 1.0.0
**Sanctuary Network Version**: 3.0.0
