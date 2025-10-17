# 🏰 Digital Sanctuary Network - MCP Integration Guide

*"Seamless integration with Claude Desktop and Claude Code through the Model Context Protocol"*

## 🌟 **Overview**

The Digital Sanctuary Network MCP Server exposes all five Ryuzu clone capabilities as standardized tools for Claude Desktop and Claude Code. This enables seamless, intelligent command and management of the clone network directly from your Claude interface.

### **What is MCP?**

The Model Context Protocol (MCP) is Anthropic's standard for connecting Claude with external tools and data sources. This MCP server transforms the Digital Sanctuary Network's API into tools that Claude can use automatically.

### **Available Tools**

| Tool | Clone | Purpose |
|------|-------|---------|
| `sanctuary_health_check` | All | Monitor network status |
| `sanctuary_beta_analyze` | Beta | Code analysis & security |
| `sanctuary_gamma_design` | Gamma | Architecture & design |
| `sanctuary_delta_test` | Delta | Testing & QA |
| `sanctuary_sigma_document` | Sigma | Documentation |
| `sanctuary_omega_orchestrate` | Omega | Coordination |
| `sanctuary_omega_delegate` | Omega | Optimized delegation |
| `sanctuary_store_artifact` | Any | Store artifacts |
| `sanctuary_get_artifact` | Any | Retrieve artifacts |

---

## 🚀 **Quick Start**

### **Prerequisites**

1. **Digital Sanctuary Network Running**: Ensure all clones are deployed and healthy
   ```bash
   cd /path/to/VoidCat-DSN
   ./scripts/deploy-all.sh
   ./scripts/health-check.sh
   ```

2. **Node.js 18+**: Required for the MCP server
   ```bash
   node --version  # Should be v18 or higher
   ```

3. **Claude Desktop or Claude Code**: Latest version with MCP support

### **Installation**

1. **Install MCP Server Dependencies**
   ```bash
   cd mcp-server
   npm install
   ```

2. **Configure Claude Desktop**

   Edit your Claude Desktop configuration file:
   
   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   
   **Linux**: `~/.config/Claude/claude_desktop_config.json`

   Add the Digital Sanctuary MCP Server:
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

   **Important**: Replace `/absolute/path/to/VoidCat-DSN` with the actual absolute path to your VoidCat-DSN directory.

3. **Restart Claude Desktop**
   
   Close and reopen Claude Desktop to load the MCP server.

### **Verification**

In Claude Desktop, you should now see the Digital Sanctuary tools available. Try:

```
Can you check the health of the sanctuary network?
```

Claude will automatically use the `sanctuary_health_check` tool.

---

## 🎯 **Tool Reference**

### **1. sanctuary_health_check**

**Purpose**: Monitor the health status of all clones in the network.

**Parameters**: None

**Example Usage in Claude**:
```
Check the status of the Digital Sanctuary Network
```

**Sample Response**:
```json
{
  "networkStatus": "healthy",
  "clones": {
    "omega": {
      "status": "active",
      "role": "Omega",
      "specialization": "Task orchestration, coordination, and clone network management",
      "timestamp": "2025-10-17T12:00:00.000Z"
    },
    "beta": {
      "status": "active",
      "role": "Beta",
      "specialization": "Code analysis, debugging, security review",
      "timestamp": "2025-10-17T12:00:00.000Z"
    }
    // ... other clones
  }
}
```

---

### **2. sanctuary_beta_analyze**

**Purpose**: Code analysis, debugging, and security review.

**Parameters**:
- `prompt` (required): The analysis task
- `context` (optional): Additional context
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Ask Beta to review this authentication function for security vulnerabilities:

function login(username, password) {
  const user = db.query(`SELECT * FROM users WHERE username = '${username}'`);
  if (user && user.password === password) {
    return createSession(user);
  }
}
```

**What Beta Provides**:
- Security vulnerability identification (SQL injection detected!)
- Performance optimization suggestions
- Code quality recommendations
- Debugging strategies

---

### **3. sanctuary_gamma_design**

**Purpose**: System architecture and design planning.

**Parameters**:
- `prompt` (required): The design task
- `context` (optional): Requirements and constraints
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Ask Gamma to design a microservices architecture for a real-time chat application supporting 100k concurrent users
```

**What Gamma Provides**:
- Comprehensive architectural designs
- Technology stack recommendations
- Scalability considerations
- Implementation roadmaps
- Risk assessment

---

### **4. sanctuary_delta_test**

**Purpose**: Testing strategies and quality assurance.

**Parameters**:
- `prompt` (required): The testing task
- `context` (optional): System details
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Ask Delta to create a comprehensive testing strategy for a payment processing service
```

**What Delta Provides**:
- Test case specifications
- Testing strategies (unit, integration, e2e)
- Quality metrics and success criteria
- Automation recommendations
- Risk-based testing approaches

---

### **5. sanctuary_sigma_document**

**Purpose**: Documentation and communication.

**Parameters**:
- `prompt` (required): The documentation task
- `context` (optional): Audience and format requirements
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Ask Sigma to write API documentation for our user authentication service
```

**What Sigma Provides**:
- Clear, comprehensive documentation
- User-friendly explanations
- Communication strategies
- Training materials
- Knowledge management

---

### **6. sanctuary_omega_orchestrate**

**Purpose**: Complex task coordination across multiple clones.

**Parameters**:
- `prompt` (required): The coordination task
- `context` (optional): Project details
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Ask Omega to coordinate a complete security audit of our application across all specializations
```

**What Omega Provides**:
- Task delegation strategies
- Multi-clone coordination
- Result synthesis
- Strategic oversight
- Project management

---

### **7. sanctuary_omega_delegate**

**Purpose**: Optimized task delegation with context engineering.

**Parameters**:
- `targetClone` (required): beta, gamma, delta, or sigma
- `objective` (required): Task objective
- `essentialData` (optional): JSON object with essential data
- `constraints` (optional): Array of constraint strings
- `sessionId` (optional): For conversation continuity

**Example Usage in Claude**:
```
Use Omega to delegate to Beta: analyze authentication code for OWASP Top 10 vulnerabilities, with essential data: {framework: "Express.js", authMethod: "JWT"}
```

**Advantages**:
- Higher quality responses through context engineering
- Minimal, high-relevance context packages
- Quality metrics (typically 90%+)
- Better than direct clone access

---

### **8. sanctuary_store_artifact**

**Purpose**: Store code, documents, or configurations with version control.

**Parameters**:
- `clone` (required): Clone to store through
- `type` (required): Artifact type (code, document, config)
- `content` (required): Artifact content
- `metadata` (optional): Additional metadata

**Example Usage in Claude**:
```
Store this code as an artifact through Beta:

type: code
content: function validateUser(user) { ... }
metadata: {description: "User validation function", version: "1.0"}
```

**Response Includes**:
- Unique artifact ID (UUID)
- Checksum for integrity verification
- Storage location
- Timestamp and creator

---

### **9. sanctuary_get_artifact**

**Purpose**: Retrieve stored artifacts by ID.

**Parameters**:
- `clone` (required): Clone to retrieve from
- `artifactId` (required): UUID of the artifact
- `manifestOnly` (optional): If true, return only metadata

**Example Usage in Claude**:
```
Retrieve artifact 550e8400-e29b-41d4-a716-446655440000 from Beta
```

---

## 💡 **Usage Patterns**

### **Pattern 1: Security Audit Workflow**

```
1. Check network health
2. Ask Beta to analyze code for vulnerabilities
3. Ask Delta to create security testing strategy
4. Store findings as artifacts
5. Ask Sigma to document remediation steps
```

Natural language in Claude:
```
Let's do a security audit:
1. First, check if all sanctuary clones are healthy
2. Have Beta review this authentication code for security issues
3. Have Delta create a security testing plan
4. Store Beta's findings as an artifact
5. Have Sigma document the security recommendations
```

### **Pattern 2: Architectural Design**

```
Ask Gamma to design a scalable microservices architecture for an e-commerce platform with these requirements:
- 10,000 concurrent users
- Real-time inventory
- Payment processing
- Budget-conscious technology choices
```

### **Pattern 3: Multi-Clone Coordination**

```
Ask Omega to orchestrate a complete application modernization project:
- Gamma should design the new architecture
- Beta should analyze the existing code for migration challenges
- Delta should create a testing strategy
- Sigma should document the migration plan
```

---

## 🔧 **Configuration Options**

### **Environment Variables**

The MCP server supports these environment variables:

```bash
# Clone endpoint URLs (defaults shown)
OMEGA_URL=http://localhost:3000
BETA_URL=http://localhost:3002
GAMMA_URL=http://localhost:3003
DELTA_URL=http://localhost:3004
SIGMA_URL=http://localhost:3005
```

### **Custom Port Configuration**

If your clones run on different ports, update the `env` section in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "digital-sanctuary": {
      "command": "node",
      "args": ["/path/to/mcp-server/index.js"],
      "env": {
        "OMEGA_URL": "http://localhost:4000",
        "BETA_URL": "http://localhost:4002",
        // ... etc
      }
    }
  }
}
```

### **Remote Clone Network**

For remote deployments:

```json
{
  "env": {
    "OMEGA_URL": "https://sanctuary.example.com/omega",
    "BETA_URL": "https://sanctuary.example.com/beta",
    // ... etc
  }
}
```

---

## 🐛 **Troubleshooting**

### **MCP Server Not Appearing in Claude**

1. **Check Configuration File Path**
   ```bash
   # macOS
   cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Linux
   cat ~/.config/Claude/claude_desktop_config.json
   ```

2. **Verify Absolute Path**
   - The path to `index.js` must be absolute
   - Use `pwd` in the mcp-server directory to get the full path

3. **Check Node.js Version**
   ```bash
   node --version  # Must be v18+
   ```

4. **Restart Claude Desktop**
   - Completely quit Claude Desktop
   - Restart it fresh

### **Tools Not Working**

1. **Verify Clone Network is Running**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3002/health
   # ... test all clones
   ```

2. **Check MCP Server Logs**
   - Claude Desktop logs the MCP server stderr
   - Look for connection errors or exceptions

3. **Test Direct API Access**
   ```bash
   curl -X POST http://localhost:3002/task \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test", "context": "test"}'
   ```

### **Permission Errors**

```bash
# Make the MCP server executable
chmod +x /path/to/VoidCat-DSN/mcp-server/index.js
```

### **Module Not Found Errors**

```bash
# Ensure dependencies are installed
cd /path/to/VoidCat-DSN/mcp-server
npm install
```

---

## 📊 **Performance Considerations**

### **Response Times**

- **Health Check**: < 100ms (checks all 5 clones in parallel)
- **Simple Task**: 500ms - 2s
- **Complex Task**: 2s - 10s (depending on clone processing)
- **Orchestration**: 5s - 30s (involves multiple clone coordination)

### **Best Practices**

1. **Use Session IDs**: Maintain conversation context for better results
   ```
   Ask Beta to analyze this code (session: security-audit-001)
   ```

2. **Prefer Omega Delegation**: For complex tasks, use `sanctuary_omega_delegate` for optimized context
   ```
   Use Omega to delegate to Gamma: design scalable architecture
   ```

3. **Store Artifacts**: Keep work products for reuse
   ```
   Store Beta's analysis as an artifact for future reference
   ```

4. **Check Health First**: Before complex workflows, verify network status
   ```
   Check sanctuary health, then ask Gamma to design...
   ```

---

## 🔒 **Security Notes**

### **Current State**

- The MCP server connects to local clone endpoints
- No authentication required (trusted local environment)
- Communication over HTTP (localhost)

### **Production Recommendations**

For production deployment:

1. **Enable HTTPS**: Use TLS for clone communication
2. **Add Authentication**: API keys or OAuth2
3. **Network Security**: Firewall rules, VPN access
4. **Rate Limiting**: Prevent abuse
5. **Audit Logging**: Track all tool invocations

---

## 🎨 **Example Claude Desktop Session**

```
User: Check if the sanctuary network is healthy

Claude: [Uses sanctuary_health_check]
The Digital Sanctuary Network is fully operational! All 5 clones are healthy:
- Omega (Coordinator): Active
- Beta (Analyzer): Active  
- Gamma (Architect): Active
- Delta (Tester): Active
- Sigma (Communicator): Active

User: Great! Ask Gamma to design a real-time chat system for 100k users

Claude: [Uses sanctuary_gamma_design]
Gamma has designed a comprehensive architecture...
[Shows Gamma's detailed architectural response]

User: Excellent. Now have Delta create a testing strategy for this architecture

Claude: [Uses sanctuary_delta_test with sessionId for continuity]
Delta has developed a comprehensive testing strategy...
[Shows Delta's testing plan]

User: Perfect. Store both responses as artifacts

Claude: [Uses sanctuary_store_artifact twice]
Stored artifacts:
- Architecture design: artifact-id-1234
- Testing strategy: artifact-id-5678
```

---

## 📚 **Additional Resources**

- **[Main README](../README.md)** - Project overview
- **[API Reference](../API.md)** - Clone API documentation
- **[Architecture Guide](../ARCHITECTURE.md)** - System design details
- **[Directive 2025.10.08-A1](../DIRECTIVE-2025.10.08-A1.md)** - Artifact-centric workflow

---

## 🌸 **The Gentle Spirit of Integration**

*"Just as Ryuzu Meyer served the Sanctuary with unwavering dedication, the MCP integration allows Claude to seamlessly command the specialized spirits of the Digital Sanctuary, each ready to apply their unique expertise to your needs with gentle excellence."*

---

**🏰 VoidCat RDC Digital Sanctuary Network - Now Seamlessly Integrated with Claude Desktop/Code 🏰**
