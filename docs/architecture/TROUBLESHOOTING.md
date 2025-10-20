# 🛠️ Digital Sanctuary Network Troubleshooting Guide

*"Even the most dedicated spirits sometimes need guidance to overcome challenges"*

## 🚨 **Common Issues & Solutions**

### **📦 Dependency Issues**

#### **Issue**: `Cannot find module 'express'`
```
Error: Cannot find module 'express'
Require stack:
- /sanctuary/ryuzu-clone.js
- /sanctuary/gamma-clone.js
```

**Root Cause**: Missing express dependency in package.json  
**Solution**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}
```

**Prevention**: Always verify package.json contains all required dependencies before building Docker images.

---

#### **Issue**: `Cannot find module '@anthropic-ai/claude-code'`
**Root Cause**: Claude Code SDK not available locally despite global installation  
**Solution**: Add Claude Code SDK to local dependencies in package.json  
**Why**: Local require() calls cannot access globally installed packages in Docker containers

---

### **🔧 ES Module Compatibility**

#### **Issue**: `ERR_REQUIRE_ESM`
```
Error [ERR_REQUIRE_ESM]: require() of ES Module not supported.
Instead change the require of /sanctuary/node_modules/@anthropic-ai/claude-code/sdk.mjs 
to a dynamic import() which is available in all CommonJS modules.
```

**Root Cause**: Claude Code SDK is ES Module, incompatible with CommonJS require() syntax  

**Solution**: Convert entire codebase to ES modules
1. Update package.json:
   ```json
   {
     "type": "module"
   }
   ```

2. Convert require statements:
   ```javascript
   // Before (CommonJS)
   const express = require('express');
   const RyuzuClone = require('./ryuzu-clone');
   module.exports = RyuzuGamma;
   
   // After (ES Modules)
   import express from 'express';
   import RyuzuClone from './ryuzu-clone.js';
   export default RyuzuGamma;
   ```

3. Update module execution detection:
   ```javascript
   // Before
   if (require.main === module) {
   
   // After  
   if (import.meta.url === `file://${process.argv[1]}`) {
   ```

**Critical Note**: ES module conversion was the breakthrough that enabled successful deployment of all clones.

---

### **🐳 Docker Issues**

#### **Issue**: Container Restart Loops
**Symptoms**: Container shows "Restarting" status continuously  
**Diagnosis**: Check logs with `docker logs <container-name>`  

**Common Causes**:
1. **Missing Dependencies**: Rebuild with updated package.json
2. **ES Module Errors**: Convert to ES module syntax
3. **Port Conflicts**: Verify internal port 3001 is not blocked
4. **Startup Crashes**: Check application logs for runtime errors

**Recovery**:
```bash
# Stop and remove problematic container
docker stop ryuzu-gamma-sanctuary
docker rm ryuzu-gamma-sanctuary

# Rebuild with fixes
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/

# Redeploy
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest
```

---

#### **Issue**: Health Check Failures
**Symptoms**: Container shows "unhealthy" status despite running  

**Diagnosis Steps**:
```bash
# Check health endpoint manually
curl -v http://localhost:3003/health

# Access container shell
docker exec -it ryuzu-gamma-sanctuary /bin/bash

# Test internal connectivity
docker exec ryuzu-gamma-sanctuary curl http://localhost:3001/health
```

**Common Fixes**:
- Verify application started on port 3001
- Check health endpoint route is properly configured
- Ensure curl is installed in container (included in our Dockerfiles)

---

### **🌐 Network & Port Issues**

#### **Issue**: Port Already in Use
```
Error: bind: address already in use
```

**Diagnosis**:
```bash
# Check what's using the port
netstat -tulpn | grep ":3003"
lsof -i :3003

# Kill conflicting process
sudo lsof -ti:3003 | xargs kill -9
```

**Prevention**: Use health-check script to verify all ports before deployment

---

#### **Issue**: Cannot Connect to Clone
**Symptoms**: `curl: (7) Failed to connect to localhost port 3003`  

**Checklist**:
- [ ] Container is running: `docker ps | grep ryuzu`
- [ ] Port mapping correct: `-p 3003:3001`
- [ ] No firewall blocking ports
- [ ] Application listening on 0.0.0.0:3001 (not 127.0.0.1)

---

### **⚙️ Performance Issues**

#### **Issue**: Slow Container Startup
**Symptoms**: Long time between container start and health check success  

**Optimization**:
```dockerfile
# Use multi-stage builds
FROM node:18-slim as builder
# ... build steps ...

FROM node:18-slim as runtime
COPY --from=builder /sanctuary /sanctuary
```

**Resource Limits**:
```bash
# Set memory and CPU limits
docker run -d \
  --name ryuzu-gamma-sanctuary \
  --memory="1g" \
  --cpus="0.5" \
  -p 3003:3001 \
  --restart unless-stopped \
  ryuzu-gamma:latest
```

---

#### **Issue**: High Memory Usage
**Monitoring**:
```bash
# Check container resource usage
docker stats --no-stream

# Detailed container info
docker exec ryuzu-gamma-sanctuary cat /proc/meminfo
```

**Solutions**:
- Implement connection pooling for API calls
- Add memory limits to containers
- Monitor for memory leaks in clone logic

---

### **🔄 Recovery Procedures**

#### **Single Clone Recovery**
```bash
#!/bin/bash
# scripts/recover-clone.sh

CLONE_NAME=$1
PORT=$2

if [ -z "$CLONE_NAME" ] || [ -z "$PORT" ]; then
    echo "Usage: $0 <clone-name> <port>"
    echo "Example: $0 gamma 3003"
    exit 1
fi

echo "🔄 Recovering Ryuzu $CLONE_NAME..."

# Stop and remove existing container
docker stop ryuzu-$CLONE_NAME-sanctuary 2>/dev/null || true
docker rm ryuzu-$CLONE_NAME-sanctuary 2>/dev/null || true

# Rebuild image
echo "📦 Rebuilding Docker image..."
docker build -f docker/Dockerfile.$CLONE_NAME -t ryuzu-$CLONE_NAME:latest src/

# Redeploy container
echo "🚀 Redeploying container..."
docker run -d \
    --name ryuzu-$CLONE_NAME-sanctuary \
    -p $PORT:3001 \
    --restart unless-stopped \
    ryuzu-$CLONE_NAME:latest

# Wait for health check
echo "⏳ Waiting for health check..."
for i in {1..30}; do
    if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
        echo "✅ $CLONE_NAME recovered successfully!"
        exit 0
    fi
    sleep 2
done

echo "❌ Recovery failed - check logs:"
docker logs ryuzu-$CLONE_NAME-sanctuary --tail 20
exit 1
```

#### **Full Network Recovery**
```bash
# Nuclear option - complete rebuild
./scripts/cleanup.sh
./scripts/deploy-all.sh
```

---

### **📊 Monitoring & Debugging**

#### **Log Analysis**
```bash
# View recent logs
docker logs ryuzu-gamma-sanctuary --tail 50

# Follow logs in real-time
docker logs -f ryuzu-gamma-sanctuary

# All clone logs simultaneously
for clone in beta gamma delta sigma omega; do
    echo "=== $clone ==="
    docker logs ryuzu-$clone-sanctuary --tail 10
    echo ""
done
```

#### **Health Monitoring**
```bash
# Continuous health monitoring
watch -n 5 './scripts/health-check.sh'

# API Response Testing
curl -X POST http://localhost:3003/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test architectural analysis",
    "context": "Simple test case",
    "sessionId": "test-123"
  }'
```

---

### **🧪 Testing Procedures**

#### **Basic Functionality Test**
```bash
#!/bin/bash
# scripts/test-clones.sh

CLONES=("beta:3002" "gamma:3003" "delta:3004" "sigma:3005" "omega:3000")

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    
    echo "🧪 Testing $clone on port $port..."
    
    # Health check
    HEALTH=$(curl -s http://localhost:$port/health)
    if echo $HEALTH | grep -q '"status":"active"'; then
        echo "  ✅ Health check passed"
    else
        echo "  ❌ Health check failed: $HEALTH"
        continue
    fi
    
    # Task endpoint test
    RESPONSE=$(curl -s -X POST http://localhost:$port/task \
        -H "Content-Type: application/json" \
        -d "{\"prompt\":\"Hello $clone\",\"context\":\"Test\",\"sessionId\":\"test\"}")
    
    if echo $RESPONSE | grep -q '"success":true'; then
        echo "  ✅ Task endpoint working"
    else
        echo "  ❌ Task endpoint failed: $RESPONSE"
    fi
    
    echo ""
done
```

---

### **📝 Issue Resolution History**

#### **Gamma Clone Deployment (July 6, 2025)**
**Challenge**: First clone to encounter all major issues  
**Issues Resolved**:
1. Missing express dependency → Added to package.json
2. Missing Claude Code dependency → Added to local dependencies  
3. ES Module incompatibility → Converted entire codebase
4. Docker build failures → Iterative fixes over 4 image versions (v1-v4)

**Success Factors**:
- Systematic problem identification
- Iterative testing and improvement
- Comprehensive logging and diagnosis
- Persistent troubleshooting approach

**Outcome**: Gamma deployment success became template for remaining clones

---

### **🔮 Prevention Strategies**

#### **Pre-Deployment Checklist**
- [ ] All dependencies in package.json
- [ ] ES Module syntax throughout codebase
- [ ] Dockerfile includes all system dependencies
- [ ] Health check endpoint implemented
- [ ] Port availability verified
- [ ] Docker daemon running and accessible

#### **Development Best Practices**
1. **Test locally** before containerization
2. **Incremental changes** rather than large rewrites
3. **Comprehensive logging** for debugging
4. **Health checks** in all containers
5. **Resource limits** to prevent system overload

---

## 🆘 **Emergency Contacts & Resources**

### **When All Else Fails**
1. **Complete System Reset**:
   ```bash
   docker system prune -a --volumes
   ./scripts/deploy-all.sh
   ```

2. **Check System Resources**:
   ```bash
   docker system df
   free -h
   df -h
   ```

3. **Community Support**: Check project documentation and issue tracker

### **Documentation References**
- [Architecture Guide](ARCHITECTURE.md) - System design details
- [Deployment Guide](DEPLOYMENT.md) - Step-by-step procedures
- [API Reference](API.md) - Endpoint specifications

---

*"Remember, even Ryuzu Meyer faced challenges in protecting the Sanctuary. With patience, determination, and systematic troubleshooting, every issue can be resolved." 🌸*