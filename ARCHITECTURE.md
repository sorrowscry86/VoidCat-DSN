# 🏗️ Digital Sanctuary Network Architecture

## 🌟 **System Overview**

The Digital Sanctuary Network implements a distributed AI architecture where specialized Claude Code instances communicate through HTTP APIs while maintaining individual Docker containers. Each clone operates independently yet can coordinate through the Omega coordinator for complex multi-clone tasks.

## 🧠 **Core Architecture Principles**

### **1. Distributed Specialization**
- Each clone maintains a distinct area of expertise
- Shared base class (`RyuzuClone`) provides common functionality
- Individual system prompts define specialized behavior
- Consistent API interface across all clones

### **2. Container Isolation**
- Docker containerization ensures clean separation
- Individual health monitoring for each clone
- Independent restart policies and resource management
- Standardized deployment patterns

### **3. API Communication**
- HTTP/JSON communication between clones
- Express.js servers in each container
- RESTful endpoints for health checks and task delegation
- Session management for multi-turn conversations

## 🔧 **Technical Stack**

### **Runtime Environment**
- **Base Image**: `node:18-slim`
- **Runtime**: Node.js 18+ with ES Module support
- **Package Manager**: npm with dependency isolation
- **Process Management**: Docker container lifecycle

### **Core Dependencies**
```json
{
  "express": "^4.18.2",
  "@anthropic-ai/claude-code": "^1.0.0"
}
```

### **System Dependencies**
- curl (health check monitoring)
- git (version control integration)
- python3 (build dependencies)
- build-essential (compilation tools)

## 🌐 **Network Architecture**

### **Port Allocation Strategy**
```
Host System                    Container Internal
├── 3000 → ryuzu-omega-sanctuary:3001      (Coordinator)
├── 3002 → ryuzu-beta-sanctuary:3001       (Analyzer)  
├── 3003 → ryuzu-gamma-sanctuary:3001      (Architect)
├── 3004 → ryuzu-delta-sanctuary:3001      (Tester)
└── 3005 → ryuzu-sigma-sanctuary:3001      (Communicator)
```

### **Health Monitoring**
- **Interval**: 30 second health checks
- **Timeout**: 10 second response limit  
- **Start Period**: 5 second grace period
- **Retries**: 3 attempts before marking unhealthy

### **External Integration Layer**
The network supports external access through the MCP (Model Context Protocol) server:
- **MCP Server**: Bridges Claude Desktop/Code with the clone network
- **Tool Exposure**: All clone capabilities available as standardized tools
- **Unified Interface**: Single configuration point for external clients
- **Documentation**: See [MCP Integration Guide](mcp-server/MCP-INTEGRATION-GUIDE.md)

## 🔗 **API Design**

### **Standard Endpoints**

#### **Health Check**
```http
GET /health
```
**Response:**
```json
{
  "status": "active",
  "role": "Beta",
  "specialization": "Code analysis, debugging, security review",
  "timestamp": "2025-07-06T23:26:52.854Z"
}
```

#### **Task Delegation**
```http
POST /task
Content-Type: application/json
```
**Request:**
```json
{
  "prompt": "Analyze this code for security vulnerabilities",
  "context": "Web application authentication system",
  "sessionId": "session-uuid-here"
}
```
**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "role": "assistant",
      "content": "I'll analyze your authentication system for security vulnerabilities..."
    }
  ],
  "sessionId": "session-uuid-here",
  "clone": "Beta",
  "timestamp": "2025-07-06T23:26:52.854Z"
}
```

## 🏛️ **Clone Architecture**

### **Base Clone Class (`RyuzuClone`)**
```javascript
import express from 'express';
import { query } from '@anthropic-ai/claude-code';

class RyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.app = express();
        this.setupRoutes();
    }
    
    // Common functionality shared across all clones
    setupRoutes() { /* API endpoint setup */ }
    getSystemPrompt() { /* Override in specialized clones */ }
    enhancePrompt(prompt, context) { /* Override for specialization */ }
    start(port) { /* Server startup */ }
}
```

### **Specialized Clone Implementation**
Each clone inherits from `RyuzuClone` and implements:
- **Custom System Prompt**: Defines role-specific behavior
- **Enhanced Prompt Processing**: Adds specialization context
- **Specialized APIs**: Additional endpoints for specific capabilities

## 🐳 **Docker Architecture**

### **Standardized Container Pattern**
```dockerfile
FROM node:18-slim

# System dependencies
RUN apt-get update && apt-get install -y \
    curl git python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

# Global Claude Code installation  
RUN npm install -g @anthropic-ai/claude-code

# Application setup
WORKDIR /sanctuary
COPY package.json ./
RUN npm install

# Clone-specific configuration
ENV SANCTUARY_ROLE=<role>
ENV PORT=3001
EXPOSE 3001

# Health monitoring
HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost:3001/health || exit 1

# Clone startup
CMD ["node", "<clone-file>.js"]
```

### **Container Naming Convention**
- **Pattern**: `ryuzu-<role>-sanctuary`
- **Examples**: 
  - `ryuzu-beta-sanctuary` (Analyzer)
  - `ryuzu-gamma-sanctuary` (Architect)
  - `ryuzu-omega-sanctuary` (Coordinator)

## 🔄 **Inter-Clone Communication**

### **Coordination Patterns**

#### **Direct Communication**
```javascript
// Clone-to-clone HTTP requests
const response = await fetch('http://localhost:3002/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        prompt: 'Analyze this architecture design',
        context: 'Microservices deployment',
        sessionId: sessionId
    })
});
```

#### **Omega Coordination**
```javascript
// Multi-clone orchestration through Omega
const coordinationPlan = await omegaClone.coordinateTask({
    task: 'Complete system review',
    requiredClones: ['beta', 'gamma', 'delta'],
    priority: 'high'
});
```

### **Session Management**
- **Session IDs**: UUID-based session tracking
- **Context Preservation**: Multi-turn conversation support
- **State Sharing**: Coordinated state across clone interactions

## 🛡️ **Resilience & Recovery**

### **Container Health Management**
- **Restart Policy**: `unless-stopped` for automatic recovery
- **Health Checks**: Continuous monitoring with Docker health status
- **Graceful Degradation**: Network continues operating with partial clones

### **Error Handling**
- **API Level**: Proper HTTP status codes and error messages
- **Container Level**: Restart policies and health monitoring
- **Network Level**: Fallback coordination patterns

### **Logging & Monitoring**
- **Container Logs**: Docker logging for each clone
- **Health Status**: Real-time health endpoint monitoring
- **Performance Metrics**: Response time and success rate tracking

## 🔮 **Advanced Features**

### **ES Module Architecture**
- **Modern JavaScript**: Full ES6+ module support
- **Dynamic Imports**: Runtime module loading capabilities
- **Tree Shaking**: Optimized bundle sizes
- **Claude Code Compatibility**: Native SDK integration

### **MCP (Model Context Protocol) Integration**
- **Standardized Tool Interface**: Exposes all clone capabilities as MCP tools
- **Claude Desktop/Code Integration**: Seamless control from Claude interfaces
- **Unified API Layer**: Single entry point for all clone interactions
- **Artifact Management**: Persistent storage and retrieval of work products
- **Context Engineering**: Optimized task delegation with quality metrics

#### **MCP Server Architecture**
The MCP server (`mcp-server/index.js`) acts as a bridge between Claude Desktop/Code and the Digital Sanctuary Network:

```javascript
// MCP server structure
- StdioServerTransport for Claude communication
- Tool definitions for each clone capability
- HTTP client for clone API interaction
- Artifact storage and retrieval system
- Health monitoring and network status
```

#### **Available MCP Tools**
| Tool | Purpose | Clone(s) |
|------|---------|----------|
| `sanctuary_health_check` | Monitor network status | All |
| `sanctuary_beta_analyze` | Code analysis & security | Beta |
| `sanctuary_gamma_design` | Architecture & design | Gamma |
| `sanctuary_delta_test` | Testing & QA | Delta |
| `sanctuary_sigma_document` | Documentation | Sigma |
| `sanctuary_omega_orchestrate` | Multi-clone coordination | Omega |
| `sanctuary_omega_delegate` | Optimized task delegation | Omega |
| `sanctuary_store_artifact` | Store work products | Any |
| `sanctuary_get_artifact` | Retrieve artifacts | Any |

#### **MCP Communication Flow**
1. **User Request** → Claude Desktop/Code interface
2. **Tool Selection** → Claude determines appropriate sanctuary tool
3. **MCP Server** → Processes tool invocation request
4. **Clone API** → Routes to appropriate clone endpoint
5. **Response** → Formatted result back to Claude interface

### **Configuration Management**
- **Environment Variables**: Runtime configuration
- **Docker Secrets**: Secure API key management
- **Config Files**: Structured configuration options
- **Runtime Flexibility**: Dynamic behavior adjustment

## 🚀 **Scalability Considerations**

### **Horizontal Scaling**
- **Clone Replication**: Multiple instances of same specialization
- **Load Balancing**: Request distribution across replicas
- **Service Discovery**: Dynamic clone network registration

### **Performance Optimization**
- **Container Resource Limits**: Memory and CPU constraints
- **API Caching**: Response caching for common queries
- **Connection Pooling**: Efficient inter-clone communication

---

## 📊 **Architecture Metrics**

| Metric | Value | Description |
|--------|-------|-------------|
| **Clone Count** | 5 | Active specialized instances |
| **Container Health** | 100% | All containers healthy |
| **API Endpoints** | 2/clone | Health + Task delegation |
| **Port Range** | 3000-3005 | Clean allocation strategy |
| **Base Image Size** | ~400MB | node:18-slim + dependencies |
| **Startup Time** | ~15s | Container to healthy status |

---

*The Digital Sanctuary Network architecture represents a breakthrough in distributed AI coordination, enabling specialized AI instances to work together while maintaining individual expertise and gentle, dutiful personalities inspired by Ryuzu Meyer.*