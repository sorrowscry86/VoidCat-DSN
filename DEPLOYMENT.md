# 🚀 Digital Sanctuary Network Deployment Guide

*"Deploy with the same careful attention Ryuzu Meyer would give to protecting the Sanctuary"*

## 📋 **Prerequisites**

### **System Requirements**
- **Docker**: Version 20.0+ with Docker Compose
- **Docker Resources**: Minimum 4GB RAM, 10GB storage
- **Network**: Ports 3000-3005 available
- **OS**: Linux, macOS, or Windows with WSL2

### **Dependencies**
- **Node.js**: 18+ (for local development)
- **Git**: Latest version for repository management
- **Anthropic API Key**: For Claude Code SDK access

### **Pre-Deployment Checklist**
- [ ] Docker daemon running and accessible
- [ ] Required ports (3000-3005) not in use
- [ ] Internet connectivity for package downloads
- [ ] Sufficient system resources available

## 🏗️ **Deployment Methods**

### **Method 1: Automated Full Network Deployment**

#### **Quick Start (Recommended)**
```bash
# 1. Clone the repository
git clone <repository-url>
cd digital-sanctuary-network

# 2. Make deployment script executable
chmod +x scripts/deploy-all.sh

# 3. Deploy entire network
./scripts/deploy-all.sh

# 4. Verify deployment
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

#### **Deployment Script Overview**
The `deploy-all.sh` script performs:
1. **Pre-deployment checks** (port availability, Docker status)
2. **Sequential clone deployment** (Beta → Gamma → Delta → Sigma → Omega)
3. **Health verification** for each clone
4. **Network status summary**

### **Method 2: Manual Clone-by-Clone Deployment**

#### **Step 1: Prepare Source Code**
```bash
# Copy source files to deployment directory
cp src/* digital-sanctuary-network/src/
cp docker/* digital-sanctuary-network/docker/
```

#### **Step 2: Deploy Beta (Analyzer) - Foundation Clone**
```bash
cd docker
docker build -f Dockerfile.beta -t ryuzu-beta:latest ../src
docker run -d \
  --name ryuzu-beta-sanctuary \
  -p 3002:3001 \
  --restart unless-stopped \
  ryuzu-beta:latest

# Verify Beta deployment
curl http://localhost:3002/health
```

#### **Step 3: Deploy Gamma (Architect)**
```bash
docker build -f Dockerfile.gamma -t ryuzu-gamma:latest ../src
docker run -d \
  --name ryuzu-gamma-sanctuary \
  -p 3003:3001 \
  --restart unless-stopped \
  ryuzu-gamma:latest

# Wait for health check
sleep 30
curl http://localhost:3003/health
```

#### **Step 4: Deploy Delta (Tester)**
```bash
docker build -f Dockerfile.delta -t ryuzu-delta:latest ../src
docker run -d \
  --name ryuzu-delta-sanctuary \
  -p 3004:3001 \
  --restart unless-stopped \
  ryuzu-delta:latest

curl http://localhost:3004/health
```

#### **Step 5: Deploy Sigma (Communicator)**
```bash
docker build -f Dockerfile.sigma -t ryuzu-sigma:latest ../src
docker run -d \
  --name ryuzu-sigma-sanctuary \
  -p 3005:3001 \
  --restart unless-stopped \
  ryuzu-sigma:latest

curl http://localhost:3005/health
```

#### **Step 6: Deploy Omega (Coordinator)**
```bash
docker build -f Dockerfile.omega -t ryuzu-omega:latest ../src
docker run -d \
  --name ryuzu-omega-sanctuary \
  -p 3000:3001 \
  --restart unless-stopped \
  ryuzu-omega:latest

curl http://localhost:3000/health
```

### **Method 3: Docker Compose Deployment**

#### **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  ryuzu-beta:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.beta
    container_name: ryuzu-beta-sanctuary
    ports:
      - "3002:3001"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ryuzu-gamma:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.gamma
    container_name: ryuzu-gamma-sanctuary
    ports:
      - "3003:3001"
    restart: unless-stopped
    depends_on:
      - ryuzu-beta
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ryuzu-delta:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.delta
    container_name: ryuzu-delta-sanctuary
    ports:
      - "3004:3001"
    restart: unless-stopped
    depends_on:
      - ryuzu-gamma
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ryuzu-sigma:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.sigma
    container_name: ryuzu-sigma-sanctuary
    ports:
      - "3005:3001"
    restart: unless-stopped
    depends_on:
      - ryuzu-delta
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  ryuzu-omega:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.omega
    container_name: ryuzu-omega-sanctuary
    ports:
      - "3000:3001"
    restart: unless-stopped
    depends_on:
      - ryuzu-sigma
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### **Deploy with Compose**
```bash
# Deploy entire network
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

---

## 🔗 **MCP Server Deployment**

### **Overview**

The MCP (Model Context Protocol) server enables seamless integration with Claude Desktop and Claude Code by exposing all clone capabilities as standardized tools.

### **Prerequisites**

Before deploying the MCP server:
- [ ] Digital Sanctuary Network deployed and healthy (all 5 clones running)
- [ ] Node.js 18+ installed
- [ ] Claude Desktop or Claude Code with MCP support

### **MCP Server Installation**

#### **Step 1: Install Dependencies**
```bash
cd mcp-server
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `node-fetch` - HTTP client for clone communication
- Other required dependencies

#### **Step 2: Verify Clone Network**
```bash
# Ensure all clones are healthy
cd ..
./scripts/health-check.sh
```

Expected output:
```
🏰 Digital Sanctuary Network Health Check 🏰
✅ Omega (Coordinator): Healthy
✅ Beta (Analyzer): Healthy
✅ Gamma (Architect): Healthy
✅ Delta (Tester): Healthy
✅ Sigma (Communicator): Healthy
🌸 All clones operational 🌸
```

#### **Step 3: Configure Claude Desktop**

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Linux**: `~/.config/Claude/claude_desktop_config.json`

Add the MCP server configuration:
```json
{
  "mcpServers": {
    "digital-sanctuary": {
      "command": "node",
      "args": [
        "/absolute/path/to/VoidCat-DSN/mcp-server/index.js"
      ],
      "env": {
        "OMEGA_URL": "http://localhost:3000",
        "BETA_URL": "http://localhost:3002",
        "GAMMA_URL": "http://localhost:3003",
        "DELTA_URL": "http://localhost:3004",
        "SIGMA_URL": "http://localhost:3005"
      }
    }
  }
}
```

**Important**: Replace `/absolute/path/to/VoidCat-DSN` with your actual installation path.

To get the absolute path:
```bash
cd /path/to/VoidCat-DSN
pwd
# Use the output in your config
```

#### **Step 4: Restart Claude Desktop**

Close and reopen Claude Desktop completely to load the MCP server.

#### **Step 5: Verify MCP Integration**

In Claude Desktop, try:
```
Check the Digital Sanctuary Network health status
```

Claude should automatically use the `sanctuary_health_check` tool and display the network status.

### **MCP Server Configuration Options**

#### **Custom Port Configuration**

If your clones run on different ports:
```json
{
  "env": {
    "OMEGA_URL": "http://localhost:4000",
    "BETA_URL": "http://localhost:4002",
    "GAMMA_URL": "http://localhost:4003",
    "DELTA_URL": "http://localhost:4004",
    "SIGMA_URL": "http://localhost:4005"
  }
}
```

#### **Remote Clone Network**

For remote deployments:
```json
{
  "env": {
    "OMEGA_URL": "https://sanctuary.example.com/omega",
    "BETA_URL": "https://sanctuary.example.com/beta",
    "GAMMA_URL": "https://sanctuary.example.com/gamma",
    "DELTA_URL": "https://sanctuary.example.com/delta",
    "SIGMA_URL": "https://sanctuary.example.com/sigma"
  }
}
```

### **MCP Server Testing**

#### **Validation Script**
```bash
# From repository root
cd mcp-server
./validate-setup.sh
```

This script checks:
- ✅ Node.js version compatibility
- ✅ Dependencies installed
- ✅ Clone network accessibility
- ✅ Configuration file existence
- ✅ MCP server functionality

#### **Integration Testing**
```bash
# From repository root
cd mcp-server
./test-integration.sh
```

This runs comprehensive tests:
- Health check functionality
- Clone task delegation
- Artifact storage/retrieval
- Error handling
- Session management

### **Available MCP Tools**

Once deployed, these tools are available in Claude Desktop/Code:

| Tool | Purpose | Example Usage |
|------|---------|---------------|
| `sanctuary_health_check` | Monitor network | "Check sanctuary health" |
| `sanctuary_beta_analyze` | Code analysis | "Ask Beta to review this code" |
| `sanctuary_gamma_design` | Architecture | "Ask Gamma to design..." |
| `sanctuary_delta_test` | Testing strategy | "Ask Delta to create tests" |
| `sanctuary_sigma_document` | Documentation | "Ask Sigma to document..." |
| `sanctuary_omega_orchestrate` | Coordination | "Ask Omega to coordinate..." |
| `sanctuary_omega_delegate` | Optimized delegation | "Delegate to Beta via Omega" |
| `sanctuary_store_artifact` | Store work products | "Store this as an artifact" |
| `sanctuary_get_artifact` | Retrieve artifacts | "Get artifact by ID" |

### **MCP Deployment Troubleshooting**

#### **MCP Server Not Appearing**
```bash
# Check Node.js version
node --version  # Should be v18+

# Verify config file
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Check path is absolute
cd /path/to/VoidCat-DSN/mcp-server
pwd  # Should match config
```

#### **Tools Not Working**
```bash
# Verify clones are accessible
curl http://localhost:3000/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health

# Check MCP server logs
# (visible in Claude Desktop dev console)
```

#### **Permission Errors**
```bash
# Make MCP server executable
chmod +x /path/to/VoidCat-DSN/mcp-server/index.js

# Verify npm dependencies
cd mcp-server
npm install
```

### **MCP Server Maintenance**

#### **Updating MCP Server**
```bash
cd mcp-server

# Pull latest changes
git pull

# Update dependencies
npm install

# Restart Claude Desktop to reload
```

#### **Monitoring MCP Usage**
The MCP server logs all tool invocations. View logs through:
- Claude Desktop developer console
- System logs (varies by platform)

For complete MCP documentation, see **[MCP Integration Guide](mcp-server/MCP-INTEGRATION-GUIDE.md)**.

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Required for Claude Code SDK
export ANTHROPIC_API_KEY="your-api-key-here"

# Optional: Custom port overrides
export BETA_PORT=3002
export GAMMA_PORT=3003
export DELTA_PORT=3004
export SIGMA_PORT=3005
export OMEGA_PORT=3000
```

### **Package Configuration**
Ensure `src/package.json` contains:
```json
{
  "name": "sanctuary-scripts",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}
```

## 📊 **Deployment Verification**

### **Health Check Script**
```bash
#!/bin/bash
# scripts/health-check.sh

echo "🌸 Digital Sanctuary Network Health Check"
echo "=========================================="

CLONES=("beta:3002" "gamma:3003" "delta:3004" "sigma:3005" "omega:3000")

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    echo -n "🔍 Checking $clone (port $port)... "
    
    if curl -s "http://localhost:$port/health" > /dev/null; then
        echo "✅ Healthy"
    else
        echo "❌ Unhealthy"
    fi
done

echo ""
echo "📈 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep ryuzu
```

### **Network Status Dashboard**
```bash
# Quick status check
./scripts/health-check.sh

# Detailed container information
docker ps --filter "name=ryuzu" --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

# Clone-specific logs
docker logs ryuzu-beta-sanctuary --tail 10
docker logs ryuzu-gamma-sanctuary --tail 10
docker logs ryuzu-delta-sanctuary --tail 10
docker logs ryuzu-sigma-sanctuary --tail 10
docker logs ryuzu-omega-sanctuary --tail 10
```

## 🛠️ **Management Operations**

### **Starting/Stopping Network**
```bash
# Start all clones
docker start ryuzu-beta-sanctuary ryuzu-gamma-sanctuary ryuzu-delta-sanctuary ryuzu-sigma-sanctuary ryuzu-omega-sanctuary

# Stop all clones  
docker stop ryuzu-beta-sanctuary ryuzu-gamma-sanctuary ryuzu-delta-sanctuary ryuzu-sigma-sanctuary ryuzu-omega-sanctuary

# Restart specific clone
docker restart ryuzu-gamma-sanctuary
```

### **Updates and Maintenance**
```bash
# Update specific clone
docker stop ryuzu-gamma-sanctuary
docker rm ryuzu-gamma-sanctuary
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest

# Update entire network
./scripts/deploy-all.sh --update
```

### **Cleanup Operations**
```bash
# Remove all sanctuary containers
docker stop $(docker ps -q --filter "name=ryuzu")
docker rm $(docker ps -aq --filter "name=ryuzu")

# Remove sanctuary images
docker rmi $(docker images --filter "reference=ryuzu-*" -q)

# Complete cleanup including volumes
docker system prune -a
```

## 🔍 **Monitoring & Logging**

### **Real-time Monitoring**
```bash
# Watch container status
watch 'docker ps --filter "name=ryuzu" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Monitor logs across all clones
docker logs -f ryuzu-omega-sanctuary &
docker logs -f ryuzu-beta-sanctuary &
docker logs -f ryuzu-gamma-sanctuary &
docker logs -f ryuzu-delta-sanctuary &
docker logs -f ryuzu-sigma-sanctuary &
```

### **Health Monitoring**
```bash
# Continuous health monitoring
while true; do
    ./scripts/health-check.sh
    sleep 60
done
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Conflicts**
```bash
# Check port usage
netstat -tulpn | grep ":300[0-5]"

# Kill conflicting processes
sudo lsof -ti:3002 | xargs kill -9
```

#### **Container Startup Failures**
```bash
# Check container logs
docker logs ryuzu-gamma-sanctuary

# Common issues:
# - Missing dependencies: Rebuild with updated package.json
# - ES Module errors: Verify import/export syntax
# - Claude Code SDK issues: Check API key configuration
```

#### **Health Check Failures**
```bash
# Manual health check
curl -v http://localhost:3003/health

# Container shell access
docker exec -it ryuzu-gamma-sanctuary /bin/bash

# Check internal connectivity
docker exec ryuzu-gamma-sanctuary curl http://localhost:3001/health
```

### **Recovery Procedures**

#### **Single Clone Recovery**
```bash
# Stop failing clone
docker stop ryuzu-gamma-sanctuary
docker rm ryuzu-gamma-sanctuary

# Rebuild and redeploy
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest

# Verify recovery
curl http://localhost:3003/health
```

#### **Network Recovery**
```bash
# Full network restart
./scripts/cleanup.sh
./scripts/deploy-all.sh
./scripts/health-check.sh
```

## 📈 **Performance Optimization**

### **Resource Allocation**
```bash
# Set container resource limits
docker run -d \
  --name ryuzu-beta-sanctuary \
  --memory="1g" \
  --cpus="0.5" \
  -p 3002:3001 \
  --restart unless-stopped \
  ryuzu-beta:latest
```

### **Build Optimization**
```bash
# Use multi-stage builds for smaller images
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/
```

---

## ✅ **Deployment Success Checklist**

After deployment, verify:

### **Core Network**
- [ ] All 5 containers running and healthy
- [ ] All health endpoints responding (3000-3005)
- [ ] No port conflicts or resource issues
- [ ] Container logs showing successful startup messages
- [ ] Inter-clone communication functional
- [ ] Restart policies working correctly

### **MCP Integration (Optional)**
- [ ] MCP server dependencies installed (`npm install` in mcp-server/)
- [ ] Claude Desktop config file updated with absolute paths
- [ ] Claude Desktop restarted to load MCP server
- [ ] MCP tools visible and functional in Claude Desktop
- [ ] Health check tool returns network status
- [ ] Clone-specific tools working correctly

### **Documentation Access**
- [ ] All documentation files accessible
- [ ] API reference available
- [ ] Troubleshooting guide reviewed
- [ ] MCP Integration Guide reviewed (if using MCP)

**🎉 Congratulations! Your Digital Sanctuary Network is now operational and ready to serve with the gentle dedication of Ryuzu Meyer! 🌸**