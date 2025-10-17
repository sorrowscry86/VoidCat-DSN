# 🔧 MCP Server Troubleshooting Guide

*Quick solutions for common MCP integration issues*

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: MCP Server Not Showing in Claude Desktop**

**Symptoms:**
- Digital Sanctuary tools don't appear in Claude Desktop
- No error messages shown

**Solutions:**

1. **Verify Configuration File Location**
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Linux
   cat ~/.config/Claude/claude_desktop_config.json
   
   # Windows
   type %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Check Configuration Syntax**
   - Ensure valid JSON (no trailing commas)
   - Use absolute path to `index.js`
   - Verify quotes are properly closed
   
   **Example Valid Config:**
   ```json
   {
     "mcpServers": {
       "digital-sanctuary": {
         "command": "node",
         "args": ["/absolute/path/to/mcp-server/index.js"]
       }
     }
   }
   ```

3. **Verify Absolute Path**
   ```bash
   # Get the absolute path
   cd /path/to/VoidCat-DSN/mcp-server
   pwd
   # Copy this output to your config
   ```

4. **Restart Claude Desktop Completely**
   - Don't just close the window
   - Quit the application completely
   - Relaunch from fresh

---

### **Issue 2: "Module Not Found" Errors**

**Symptoms:**
- Claude Desktop shows error about missing modules
- MCP server fails to start

**Solutions:**

1. **Install Dependencies**
   ```bash
   cd /path/to/VoidCat-DSN/mcp-server
   npm install
   ```

2. **Verify Node.js Version**
   ```bash
   node --version
   # Should be v18 or higher
   ```

3. **Check File Permissions**
   ```bash
   chmod +x /path/to/VoidCat-DSN/mcp-server/index.js
   ```

---

### **Issue 3: Clone Network Unreachable**

**Symptoms:**
- Tools appear but return errors
- "Failed to call [clone] clone" messages
- Network timeout errors

**Solutions:**

1. **Verify Clone Network is Running**
   ```bash
   # Check all clones
   curl http://localhost:3000/health  # Omega
   curl http://localhost:3002/health  # Beta
   curl http://localhost:3003/health  # Gamma
   curl http://localhost:3004/health  # Delta
   curl http://localhost:3005/health  # Sigma
   ```

2. **Start Clone Network**
   ```bash
   cd /path/to/VoidCat-DSN
   ./scripts/deploy-all.sh
   ```

3. **Check Port Configuration**
   - Verify ports in `claude_desktop_config.json` match actual clone ports
   - Default ports: Omega=3000, Beta=3002, Gamma=3003, Delta=3004, Sigma=3005

4. **Check Firewall Settings**
   - Ensure localhost connections are allowed
   - No firewall blocking ports 3000-3005

---

### **Issue 4: Slow Tool Responses**

**Symptoms:**
- Tools take a long time to respond
- Timeouts occur

**Solutions:**

1. **Check Clone Health**
   ```bash
   cd /path/to/VoidCat-DSN/mcp-server
   ./test-integration.sh
   ```

2. **Monitor Clone Resources**
   ```bash
   # Check container resources (if using Docker)
   docker stats ryuzu-omega-sanctuary
   docker stats ryuzu-beta-sanctuary
   # ... etc
   ```

3. **Restart Slow Clones**
   ```bash
   docker restart ryuzu-[clone]-sanctuary
   ```

4. **Reduce Concurrent Requests**
   - Wait for one task to complete before starting another
   - Use session IDs for better context management

---

### **Issue 5: Permission Denied Errors**

**Symptoms:**
- "EACCES: permission denied" errors
- Cannot execute MCP server

**Solutions:**

1. **Make Scripts Executable**
   ```bash
   chmod +x /path/to/VoidCat-DSN/mcp-server/index.js
   chmod +x /path/to/VoidCat-DSN/mcp-server/setup.sh
   ```

2. **Check Node.js Permissions**
   ```bash
   which node
   ls -la $(which node)
   # Should be executable
   ```

---

### **Issue 6: JSON Parsing Errors**

**Symptoms:**
- "Unexpected token" errors in config
- MCP server fails to parse responses

**Solutions:**

1. **Validate Config JSON**
   ```bash
   # Use jq or online JSON validator
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
   ```

2. **Common JSON Mistakes:**
   ```json
   // ❌ WRONG - trailing comma
   {
     "mcpServers": {
       "digital-sanctuary": { ... },
     }
   }
   
   // ✅ CORRECT - no trailing comma
   {
     "mcpServers": {
       "digital-sanctuary": { ... }
     }
   }
   ```

3. **Use Example Config as Template**
   ```bash
   cp mcp-server/claude_desktop_config.example.json \
      ~/Library/Application\ Support/Claude/claude_desktop_config.json
   # Then edit the absolute path
   ```

---

### **Issue 7: Environment Variables Not Working**

**Symptoms:**
- Custom clone URLs not being used
- Always connects to localhost

**Solutions:**

1. **Check Environment Variable Syntax**
   ```json
   {
     "mcpServers": {
       "digital-sanctuary": {
         "command": "node",
         "args": ["/path/to/index.js"],
         "env": {
           "OMEGA_URL": "http://localhost:3000",
           "BETA_URL": "http://localhost:3002"
         }
       }
     }
   }
   ```

2. **Verify URLs are Accessible**
   ```bash
   curl http://your-custom-url:port/health
   ```

---

### **Issue 8: Tools Return Empty Responses**

**Symptoms:**
- Tools execute but return no content
- "No response generated" messages

**Solutions:**

1. **Check Claude Code SDK Status**
   - Verify clones are using correct Claude Code SDK
   - Check for API rate limits
   - Ensure valid Anthropic API key

2. **Test Direct API Access**
   ```bash
   curl -X POST http://localhost:3002/task \
     -H "Content-Type: application/json" \
     -d '{"prompt":"test","context":"test"}'
   ```

3. **Check Clone Logs**
   ```bash
   # If using Docker
   docker logs ryuzu-beta-sanctuary --tail 50
   ```

---

### **Issue 9: Multiple Instances Conflict**

**Symptoms:**
- Port already in use errors
- Unexpected responses from wrong clone

**Solutions:**

1. **Stop All Clones**
   ```bash
   docker stop $(docker ps -q --filter "name=ryuzu-")
   ```

2. **Clean Restart**
   ```bash
   cd /path/to/VoidCat-DSN
   ./scripts/deploy-all.sh
   ```

3. **Check for Zombie Processes**
   ```bash
   lsof -i :3000
   lsof -i :3002
   # Kill if necessary
   ```

---

### **Issue 10: Windows-Specific Path Issues**

**Symptoms:**
- Path not recognized on Windows
- Backslash vs forward slash issues

**Solutions:**

1. **Use Forward Slashes**
   ```json
   "args": ["C:/Users/YourName/VoidCat-DSN/mcp-server/index.js"]
   ```

2. **Escape Backslashes**
   ```json
   "args": ["C:\\Users\\YourName\\VoidCat-DSN\\mcp-server\\index.js"]
   ```

3. **Use WSL Path (if using WSL)**
   ```json
   "args": ["/mnt/c/Users/YourName/VoidCat-DSN/mcp-server/index.js"]
   ```

---

## 🔍 **Debugging Checklist**

Use this checklist to systematically debug issues:

### **Pre-Flight Checks**
- [ ] Node.js version 18+ installed
- [ ] MCP server dependencies installed (`npm install`)
- [ ] Clone network is running and healthy
- [ ] `index.js` has execute permissions
- [ ] Configuration file exists in correct location
- [ ] Configuration file is valid JSON
- [ ] Absolute path to `index.js` is correct
- [ ] Claude Desktop fully restarted

### **Network Checks**
- [ ] All 5 clones respond to health checks
- [ ] Ports 3000-3005 are not blocked
- [ ] No firewall blocking localhost connections
- [ ] Clone endpoints match configuration

### **Configuration Checks**
- [ ] `claude_desktop_config.json` syntax is valid
- [ ] No trailing commas in JSON
- [ ] Quotes properly closed
- [ ] Environment variables correctly set (if using custom URLs)

### **Runtime Checks**
- [ ] MCP server can start manually (`node index.js`)
- [ ] Test script passes (`./test-integration.sh`)
- [ ] Clone logs show no errors
- [ ] Sufficient system resources (RAM, CPU)

---

## 🛠️ **Diagnostic Commands**

### **Test MCP Server Manually**
```bash
# Navigate to mcp-server directory
cd /path/to/VoidCat-DSN/mcp-server

# Run server (should wait for stdio input)
node index.js

# If no errors, server is working
# Press Ctrl+C to exit
```

### **Run Integration Tests**
```bash
cd /path/to/VoidCat-DSN/mcp-server
./test-integration.sh
```

### **Check Clone Network Health**
```bash
cd /path/to/VoidCat-DSN
./scripts/health-check.sh
```

### **View Claude Desktop Logs**
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Linux
tail -f ~/.config/Claude/logs/mcp*.log
```

---

## 📞 **Getting Help**

If you've tried all solutions and still have issues:

1. **Check GitHub Issues**
   - Search for similar problems
   - Create new issue with details

2. **Provide Debug Information**
   - Operating system and version
   - Node.js version (`node --version`)
   - Claude Desktop version
   - Error messages (exact text)
   - Configuration file (sanitize paths)
   - Output from `test-integration.sh`

3. **Test Minimal Configuration**
   ```bash
   # Use the setup script
   cd /path/to/VoidCat-DSN/mcp-server
   ./setup.sh
   ```

---

## ✅ **Quick Validation**

Use the built-in validation script to check your setup:

```bash
cd /path/to/VoidCat-DSN/mcp-server
./validate-setup.sh
```

This script automatically checks:
- ✅ Node.js version (18+)
- ✅ npm availability
- ✅ MCP SDK dependencies installed
- ✅ index.js executable permissions
- ✅ package.json configuration
- ✅ Clone network health (all 5 clones)
- ✅ Claude Desktop configuration file
- ✅ Configuration JSON validity

**Example Output:**
```
🔍 Validating MCP Server Setup...

Node.js: ✅ v20.19.5
npm: ✅ 10.8.2
Dependencies: ✅ Installed
index.js: ✅ Exists and executable
package.json: ✅ Valid (ES modules)

Clone Network Status:
  Omega (port 3000): ✅ Active
  Beta (port 3002): ✅ Active
  Gamma (port 3003): ✅ Active
  Delta (port 3004): ✅ Active
  Sigma (port 3005): ✅ Active

Configuration:
  Config location: ~/Library/Application Support/Claude/claude_desktop_config.json
  Config file: ✅ Valid JSON
  ✅ Digital Sanctuary configured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ All 5 clones are healthy!

✅ Validation Successful!

The MCP server is ready for Claude Desktop integration.
```

**Validation Script Exit Codes:**
- `0` - All checks passed, ready for use
- `1` - Issues found, see output for details

---

**🏰 May your sanctuary integration be smooth and error-free! 🌸**
