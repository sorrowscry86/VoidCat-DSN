# 📡 Digital Sanctuary Network API Reference

*"Communication protocols for coordinating the gentle spirits of the Digital Sanctuary"*

## 🌟 **API Overview**

The Digital Sanctuary Network provides RESTful HTTP APIs for each specialized Ryuzu clone. All clones implement a standardized interface while offering specialized capabilities through their unique system prompts and enhanced processing.

### **Network Endpoints**
| Clone | Role | Base URL | Specialization |
|-------|------|----------|----------------|
| **Omega** | Coordinator | `http://localhost:3000` | Task orchestration, network management |
| **Beta** | Analyzer | `http://localhost:3002` | Code analysis, debugging, security |
| **Gamma** | Architect | `http://localhost:3003` | System design, architecture planning |
| **Delta** | Tester | `http://localhost:3004` | Quality assurance, testing, validation |
| **Sigma** | Communicator | `http://localhost:3005` | Documentation, user interaction |

---

## 🏥 **Health Check Endpoint**

### **GET** `/health`

Returns the current status and metadata for a clone.

#### **Request**
```http
GET /health HTTP/1.1
Host: localhost:3003
```

#### **Response**
```json
{
  "status": "active",
  "role": "Gamma",
  "specialization": "System design, architecture planning, and technical infrastructure design",
  "timestamp": "2025-07-06T23:26:52.854Z"
}
```

#### **Status Codes**
- `200 OK` - Clone is healthy and operational
- `503 Service Unavailable` - Clone is starting up or experiencing issues

#### **Usage Examples**
```bash
# Check specific clone health
curl http://localhost:3003/health

# Check all clones (bash script)
for port in 3000 3002 3003 3004 3005; do
  echo "Port $port: $(curl -s http://localhost:$port/health | jq -r .status)"
done
```

---

## 🎯 **Task Delegation Endpoint**

### **POST** `/task`

Submits a task to a specialized clone for processing.

#### **Request**
```http
POST /task HTTP/1.1
Host: localhost:3003
Content-Type: application/json

{
  "prompt": "Design a microservices architecture for an e-commerce platform",
  "context": "High-traffic retail application with inventory, orders, payments, and user management",
  "sessionId": "session-uuid-12345"
}
```

#### **Request Parameters**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | ✅ Yes | The task or question to be processed |
| `context` | string | ❌ No | Additional context to inform the response (legacy) |
| `contextPackage` | object | ❌ No | Engineered context package (Directive 2025.10.08-A1) |
| `sessionId` | string | ❌ No | Session identifier for conversation continuity |

**Context Package Structure** (when using `contextPackage`):
```json
{
  "contextId": "ctx-1696780800000-abc123",
  "objective": "Task objective",
  "targetClone": "beta",
  "artifactManifests": [...],
  "essentialData": {...},
  "constraints": [...],
  "quality": { "overallQuality": 95 }
}
```

#### **Response**
```json
{
  "success": true,
  "role": "Gamma",
  "response": [
    {
      "role": "assistant",
      "content": "I'll design a comprehensive microservices architecture for your e-commerce platform...\n\n## Architecture Overview\n\n### Core Services\n1. **User Service**: Authentication, profiles, preferences\n2. **Product Catalog Service**: Product information, categories, search\n3. **Inventory Service**: Stock levels, warehouse management\n4. **Order Service**: Order processing, state management\n5. **Payment Service**: Payment processing, billing\n6. **Notification Service**: Email, SMS, push notifications\n\n### Technology Recommendations\n- **API Gateway**: Kong or AWS API Gateway for request routing\n- **Service Mesh**: Istio for service-to-service communication\n- **Database**: PostgreSQL for transactional data, Redis for caching\n- **Message Queue**: Apache Kafka for event streaming\n- **Container Orchestration**: Kubernetes for deployment and scaling\n\n### Scalability Considerations\n- Horizontal pod autoscaling based on CPU/memory metrics\n- Database read replicas for improved read performance\n- CDN integration for static asset delivery\n- Caching strategies at multiple levels\n\n### Implementation Roadmap\n**Phase 1**: Core services (User, Product, Order)\n**Phase 2**: Payment integration and security hardening\n**Phase 3**: Advanced features (recommendations, analytics)\n**Phase 4**: Performance optimization and monitoring\n\n### Risk Mitigation\n- Circuit breaker patterns for service resilience\n- Comprehensive monitoring and alerting\n- Gradual rollout strategies for deployments\n- Data backup and disaster recovery procedures\n\nThis architecture provides a solid foundation for your e-commerce platform while maintaining the flexibility to evolve with your business needs."
    }
  ],
  "sessionId": "session-uuid-12345",
  "timestamp": "2025-07-06T23:30:15.234Z"
}
```

#### **Response Fields**
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether the task was processed successfully |
| `role` | string | The clone that processed the request |
| `response` | array | Array of message objects with role and content |
| `sessionId` | string | Session identifier (if provided in request) |
| `timestamp` | string | ISO 8601 timestamp of response |

#### **Error Response**
```json
{
  "success": false,
  "error": "Invalid request format: missing required field 'prompt'",
  "role": "Gamma",
  "timestamp": "2025-07-06T23:30:15.234Z"
}
```

#### **Status Codes**
- `200 OK` - Task processed successfully
- `400 Bad Request` - Invalid request format or missing required fields
- `500 Internal Server Error` - Clone processing error

---

## 🌸 **Clone-Specific Behaviors**

### **🔧 Beta (Analyzer) - Port 3002**

**Specialization**: Code analysis, debugging, security review

**Enhanced Processing**: Analyzes code for:
- Security vulnerabilities and best practices
- Performance optimization opportunities  
- Code quality and maintainability issues
- Debugging strategies and solutions

**Example Request**:
```json
{
  "prompt": "Review this authentication function for security issues",
  "context": "Node.js Express application with JWT tokens",
  "sessionId": "security-review-001"
}
```

**Typical Response Focus**:
- Detailed security analysis
- Specific vulnerability identification
- Concrete remediation steps
- Best practice recommendations

---

### **🏗️ Gamma (Architect) - Port 3003**

**Specialization**: System design, architecture planning

**Enhanced Processing**: Provides:
- Comprehensive architectural analysis
- Technology stack recommendations
- Scalability and performance considerations
- Implementation roadmaps
- Risk assessment and mitigation strategies

**Example Request**:
```json
{
  "prompt": "Design a real-time chat system architecture",
  "context": "Supporting 100k concurrent users with message history",
  "sessionId": "architecture-design-002"
}
```

**Typical Response Structure**:
1. Requirements assessment
2. System design overview
3. Technology recommendations
4. Scalability considerations
5. Implementation roadmap
6. Risk assessment

---

### **🧪 Delta (Tester) - Port 3004**

**Specialization**: Quality assurance, testing strategies

**Enhanced Processing**: Develops:
- Comprehensive testing strategies
- Test case specifications
- Quality metrics and success criteria
- Testing tool recommendations
- Automation approaches

**Example Request**:
```json
{
  "prompt": "Create a testing strategy for a payment processing service",
  "context": "Critical financial application requiring 99.99% uptime",
  "sessionId": "testing-strategy-003"
}
```

**Typical Response Coverage**:
- Testing scope and objectives
- Test strategy and approach
- Specific test cases
- Quality assurance processes
- Risk mitigation through testing

---

### **📚 Sigma (Communicator) - Port 3005**

**Specialization**: Documentation, user interaction

**Enhanced Processing**: Creates:
- Clear, comprehensive documentation
- User-friendly explanations
- Communication strategies
- Training materials
- Knowledge management systems

**Example Request**:
```json
{
  "prompt": "Write API documentation for a user authentication service",
  "context": "RESTful API with OAuth2 integration for mobile app",
  "sessionId": "documentation-004"
}
```

**Typical Response Elements**:
- Audience analysis
- Content structure and organization
- Clear explanations and examples
- User experience considerations
- Knowledge sharing strategies

---

### **👑 Omega (Coordinator) - Port 3000**

**Specialization**: Task orchestration, network management

**Enhanced Processing**: Provides:
- Multi-clone task coordination
- Network-wide oversight
- Complex project management
- Resource allocation decisions
- Strategic planning and execution

**Example Request**:
```json
{
  "prompt": "Coordinate a complete system review across all specializations",
  "context": "Legacy application modernization project",
  "sessionId": "coordination-005"
}
```

**Coordination Capabilities**:
- Identifies which clones should handle specific aspects
- Sequences tasks for optimal workflow
- Synthesizes results from multiple clones
- Provides unified project oversight

---

## 🔗 **Inter-Clone Communication**

### **Direct Clone-to-Clone Requests**

Clones can communicate directly with each other using the same API:

```javascript
// Example: Gamma requesting code analysis from Beta
const response = await fetch('http://localhost:3002/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Analyze this architectural design for security issues',
    context: 'Microservices architecture with API gateway',
    sessionId: 'inter-clone-comm-001'
  })
});

const analysis = await response.json();
```

### **Omega Coordination Patterns**

```javascript
// Example: Omega orchestrating multi-clone task
const coordinationPlan = {
  task: 'Complete application security audit',
  phases: [
    { clone: 'gamma', task: 'Architecture security review' },
    { clone: 'beta', task: 'Code vulnerability analysis' },
    { clone: 'delta', task: 'Security testing strategy' },
    { clone: 'sigma', task: 'Security documentation update' }
  ]
};
```

---

## 🛡️ **Security Considerations**

### **Authentication**
Currently, the Digital Sanctuary Network operates in a trusted environment without authentication. For production deployment, consider:

- API key authentication
- OAuth2 integration
- Network-level security (VPN, firewall rules)
- Rate limiting and DDoS protection

### **Input Validation**
All endpoints validate:
- JSON format compliance
- Required field presence
- Maximum payload sizes
- Safe character encoding

### **Error Handling**
- No sensitive information in error messages
- Structured error responses
- Comprehensive logging for debugging
- Graceful degradation on failures

---

## 📊 **API Monitoring**

### **Health Monitoring Script**
```bash
#!/bin/bash
# Monitor API response times and availability

CLONES=("beta:3002" "gamma:3003" "delta:3004" "sigma:3005" "omega:3000")

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    
    start_time=$(date +%s%N)
    response=$(curl -s -w "%{http_code}" http://localhost:$port/health)
    end_time=$(date +%s%N)
    
    duration=$(( (end_time - start_time) / 1000000 ))
    status_code="${response: -3}"
    
    if [ "$status_code" = "200" ]; then
        echo "✅ $clone: ${duration}ms"
    else
        echo "❌ $clone: HTTP $status_code"
    fi
done
```

### **Performance Metrics**
- **Response Time**: Typical health check < 50ms
- **Task Processing**: Varies by complexity (500ms - 5s)
- **Concurrent Requests**: Tested up to 10 simultaneous per clone
- **Memory Usage**: ~100-200MB per container
- **CPU Usage**: Variable based on task complexity

---

## 🧪 **Testing Examples**

### **Basic API Test Suite**
```javascript
// Jest test example
describe('Digital Sanctuary Network API', () => {
  test('Health endpoints respond correctly', async () => {
    const clones = [
      { name: 'beta', port: 3002 },
      { name: 'gamma', port: 3003 },
      { name: 'delta', port: 3004 },
      { name: 'sigma', port: 3005 },
      { name: 'omega', port: 3000 }
    ];

    for (const clone of clones) {
      const response = await fetch(`http://localhost:${clone.port}/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('active');
      expect(data.role).toBe(clone.name.charAt(0).toUpperCase() + clone.name.slice(1));
    }
  });

  test('Task delegation works correctly', async () => {
    const response = await fetch('http://localhost:3003/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Test architectural analysis',
        context: 'Simple test case',
        sessionId: 'test-session'
      })
    });

    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.role).toBe('Gamma');
    expect(data.response).toBeInstanceOf(Array);
  });
});
```

---

## 📚 **SDK & Client Libraries**

### **JavaScript/Node.js Client**
```javascript
class DigitalSanctuaryClient {
  constructor(baseUrl = 'http://localhost') {
    this.baseUrl = baseUrl;
    this.clones = {
      omega: 3000,
      beta: 3002,
      gamma: 3003,
      delta: 3004,
      sigma: 3005
    };
  }

  async checkHealth(clone) {
    const port = this.clones[clone];
    const response = await fetch(`${this.baseUrl}:${port}/health`);
    return response.json();
  }

  async delegateTask(clone, prompt, context = '', sessionId = null) {
    const port = this.clones[clone];
    const response = await fetch(`${this.baseUrl}:${port}/task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context, sessionId })
    });
    return response.json();
  }

  async checkNetworkHealth() {
    const results = {};
    for (const [clone, port] of Object.entries(this.clones)) {
      try {
        results[clone] = await this.checkHealth(clone);
      } catch (error) {
        results[clone] = { error: error.message };
      }
    }
    return results;
  }
}

// Usage
const sanctuary = new DigitalSanctuaryClient();

// Check network health
const health = await sanctuary.checkNetworkHealth();

// Delegate architectural task
const response = await sanctuary.delegateTask(
  'gamma',
  'Design a scalable API architecture',
  'E-commerce platform with high availability requirements'
);
```

---

## 📦 **Artifact Management Endpoints** (Directive 2025.10.08-A1)

All clones support artifact storage and retrieval for version-controlled work product management.

### **POST** `/artifacts`

Store an artifact in the centralized workspace.

#### **Request**
```http
POST /artifacts HTTP/1.1
Host: localhost:3002
Content-Type: application/json

{
  "type": "code",
  "content": "function authenticate(user) { ... }",
  "metadata": {
    "description": "User authentication function",
    "language": "JavaScript",
    "version": "1.0.0"
  }
}
```

#### **Response**
```json
{
  "success": true,
  "manifest": {
    "artifactId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "code",
    "version": "1.0.0",
    "checksum": "a3d5f7e9...",
    "timestamp": "2025-10-08T12:00:00.000Z",
    "location": {
      "uri": "file:///tmp/sanctuary-workspace/artifacts/550e8400.code",
      "relativePath": "artifacts/550e8400.code",
      "fileName": "550e8400.code"
    },
    "size": 4096,
    "metadata": {
      "createdBy": "Beta",
      "description": "User authentication function"
    }
  },
  "role": "Beta"
}
```

---

### **GET** `/artifacts/:artifactId`

Retrieve an artifact with full content.

#### **Request**
```http
GET /artifacts/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: localhost:3002
```

#### **Response**
```json
{
  "success": true,
  "manifest": {
    "artifactId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "code",
    "version": "1.0.0",
    "checksum": "a3d5f7e9...",
    ...
  },
  "content": "function authenticate(user) { ... }",
  "role": "Beta"
}
```

---

### **GET** `/artifacts/:artifactId?manifestOnly=true`

Retrieve only the artifact manifest (lightweight, no content).

#### **Request**
```http
GET /artifacts/550e8400-e29b-41d4-a716-446655440000?manifestOnly=true HTTP/1.1
Host: localhost:3002
```

#### **Response**
```json
{
  "success": true,
  "manifest": {
    "artifactId": "550e8400-e29b-41d4-a716-446655440000",
    "type": "code",
    "version": "1.0.0",
    "checksum": "a3d5f7e9...",
    "location": {...}
  },
  "role": "Beta"
}
```

---

## 🧠 **Context Engineering Endpoints** (Omega Only)

Omega provides specialized endpoints for context package construction and task orchestration.

### **POST** `/context/engineer`

Construct an optimized context package with quality metrics.

#### **Request**
```http
POST /context/engineer HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "objective": "Analyze authentication code for security vulnerabilities",
  "targetClone": "beta",
  "essentialData": {
    "framework": "Express.js",
    "authMethod": "JWT"
  },
  "constraints": [
    "Focus on OWASP Top 10",
    "Consider session management"
  ]
}
```

#### **Response**
```json
{
  "success": true,
  "contextPackage": {
    "contextId": "ctx-1696780800000-abc123",
    "timestamp": "2025-10-08T12:00:00.000Z",
    "objective": "Analyze authentication code for security vulnerabilities",
    "targetClone": "beta",
    "artifactManifests": [],
    "essentialData": {
      "framework": "Express.js",
      "authMethod": "JWT"
    },
    "constraints": [
      "Focus on OWASP Top 10",
      "Consider session management"
    ],
    "quality": {
      "objectiveClarity": 95,
      "dataRelevance": 100,
      "artifactUtilization": 100,
      "overallQuality": 98
    }
  },
  "validation": {
    "valid": true,
    "errors": []
  },
  "role": "Omega"
}
```

#### **Quality Metrics**
- **Objective Clarity (0-100)**: Optimal 5-20 words
- **Data Relevance (0-100)**: Fewer fields = higher score
- **Artifact Utilization (0-100)**: 0-3 artifacts optimal
- **Overall Quality**: Average of all metrics

---

### **POST** `/orchestrate`

Delegate a task with automatic context engineering and quality validation.

#### **Request**
```http
POST /orchestrate HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "objective": "Review payment processing implementation for PCI DSS compliance",
  "targetClone": "beta",
  "artifactManifests": [
    {
      "artifactId": "550e8400-e29b-41d4-a716-446655440000",
      "type": "code",
      "version": "1.0.0",
      "checksum": "a3d5f7e9...",
      "location": {...}
    }
  ],
  "essentialData": {
    "paymentProvider": "Stripe",
    "compliance": "PCI DSS Level 1"
  },
  "constraints": [
    "Production-ready assessment required",
    "Include remediation steps"
  ],
  "sessionId": "compliance-review-001"
}
```

#### **Response**
```json
{
  "success": true,
  "orchestrator": "Omega",
  "targetClone": "beta",
  "contextPackage": {
    "contextId": "ctx-1696780800000-xyz789",
    "quality": {
      "overallQuality": 96
    }
  },
  "result": {
    "success": true,
    "role": "Beta",
    "response": [...],
    "contextPackageId": "ctx-1696780800000-xyz789",
    "timestamp": "2025-10-08T12:05:00.000Z"
  },
  "timestamp": "2025-10-08T12:05:00.000Z"
}
```

---

## 📘 **Complete Usage Examples**

### Example 1: Artifact-Centric Workflow

```javascript
// Step 1: Store code artifact
const codeResponse = await fetch('http://localhost:3002/artifacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'code',
    content: sourceCode,
    metadata: { description: 'Payment processing module' }
  })
});
const { manifest } = await codeResponse.json();

// Step 2: Get lightweight manifest reference
const manifestResponse = await fetch(
  `http://localhost:3002/artifacts/${manifest.artifactId}?manifestOnly=true`
);
const { manifest: lightweightManifest } = await manifestResponse.json();

// Step 3: Orchestrate security review with artifact
const reviewResponse = await fetch('http://localhost:3000/orchestrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    objective: 'Security audit of payment processing',
    targetClone: 'beta',
    artifactManifests: [lightweightManifest],
    essentialData: { complianceRequired: 'PCI DSS' }
  })
});

const result = await reviewResponse.json();
console.log('Quality Score:', result.contextPackage.quality.overallQuality);
```

### Example 2: Context Engineering

```javascript
// Construct optimized context package
const contextResponse = await fetch('http://localhost:3000/context/engineer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    objective: 'Design scalable microservices architecture',
    targetClone: 'gamma',
    essentialData: {
      platform: 'e-commerce',
      scale: '10k concurrent users'
    },
    constraints: ['Budget-conscious choices', 'Cloud-native design']
  })
});

const { contextPackage, validation } = await contextResponse.json();

if (validation.valid && contextPackage.quality.overallQuality > 75) {
  // Use context package for task delegation
  const taskResponse = await fetch('http://localhost:3003/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: contextPackage.objective,
      contextPackage
    })
  });
}
```

### Example 3: Legacy Compatibility

```javascript
// Traditional task delegation still works
const response = await fetch('http://localhost:3002/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Analyze this code for bugs',
    context: 'Node.js application with Express framework',
    sessionId: 'debug-session-001'
  })
});

const result = await response.json();
// Fully backward compatible
```

---

## 🔗 **MCP (Model Context Protocol) Integration**

### **Overview**

The Digital Sanctuary Network exposes all clone capabilities through the Model Context Protocol, enabling seamless integration with Claude Desktop and Claude Code. The MCP server acts as a standardized interface layer between Claude interfaces and the clone network.

### **MCP Server Architecture**

**Base URL**: Configured in Claude Desktop config (runs as stdio server)
**Protocol**: Model Context Protocol via stdio transport
**Implementation**: `/mcp-server/index.js`

### **Available MCP Tools**

#### **1. sanctuary_health_check**

Monitor the health status of all clones in the network.

**Parameters**: None

**Returns**:
```json
{
  "networkStatus": "healthy",
  "clones": {
    "omega": {
      "status": "active",
      "role": "Omega",
      "specialization": "Task orchestration, coordination...",
      "timestamp": "2025-10-17T10:00:00.000Z"
    },
    // ... other clones
  }
}
```

**Usage in Claude**:
```
Check the Digital Sanctuary Network health status
```

---

#### **2. sanctuary_beta_analyze**

Code analysis, debugging, and security review via Beta clone.

**Parameters**:
- `prompt` (required): The analysis task
- `context` (optional): Additional context
- `sessionId` (optional): For conversation continuity

**Returns**: Beta's analysis response with security recommendations, code quality insights, and debugging strategies.

**Usage in Claude**:
```
Ask Beta to analyze this authentication function for security vulnerabilities
```

---

#### **3. sanctuary_gamma_design**

System architecture and design planning via Gamma clone.

**Parameters**:
- `prompt` (required): The design task
- `context` (optional): Requirements and constraints
- `sessionId` (optional): For conversation continuity

**Returns**: Gamma's architectural design with technology recommendations, scalability considerations, and implementation roadmaps.

**Usage in Claude**:
```
Ask Gamma to design a microservices architecture for 100k concurrent users
```

---

#### **4. sanctuary_delta_test**

Testing strategies and quality assurance via Delta clone.

**Parameters**:
- `prompt` (required): The testing task
- `context` (optional): System details
- `sessionId` (optional): For conversation continuity

**Returns**: Delta's testing strategy with test specifications, quality metrics, and automation recommendations.

**Usage in Claude**:
```
Ask Delta to create a comprehensive testing strategy for our payment service
```

---

#### **5. sanctuary_sigma_document**

Documentation and communication via Sigma clone.

**Parameters**:
- `prompt` (required): The documentation task
- `context` (optional): Audience and format requirements
- `sessionId` (optional): For conversation continuity

**Returns**: Sigma's documentation with clear explanations, user-friendly content, and knowledge management.

**Usage in Claude**:
```
Ask Sigma to write API documentation for our authentication service
```

---

#### **6. sanctuary_omega_orchestrate**

Complex task coordination across multiple clones via Omega.

**Parameters**:
- `prompt` (required): The coordination task
- `context` (optional): Project details
- `sessionId` (optional): For conversation continuity

**Returns**: Omega's coordinated response synthesizing multiple clone outputs.

**Usage in Claude**:
```
Ask Omega to coordinate a complete security audit across all clones
```

---

#### **7. sanctuary_omega_delegate**

Optimized task delegation with context engineering via Omega.

**Parameters**:
- `targetClone` (required): beta, gamma, delta, or sigma
- `objective` (required): Task objective
- `essentialData` (optional): JSON object with essential data
- `constraints` (optional): Array of constraint strings
- `sessionId` (optional): For conversation continuity

**Returns**: Enhanced response with quality metrics (typically 90%+).

**Usage in Claude**:
```
Use Omega to delegate to Beta: analyze auth code for OWASP vulnerabilities
```

**Advantages**:
- Higher quality responses through context engineering
- Minimal, high-relevance context packages
- Quality scoring and metrics
- Preferred over direct clone access

---

#### **8. sanctuary_store_artifact**

Store code, documents, or configurations with version control.

**Parameters**:
- `clone` (required): Clone to store through (omega, beta, gamma, delta, sigma)
- `type` (required): Artifact type (code, document, config)
- `content` (required): Artifact content
- `metadata` (optional): Additional metadata object

**Returns**:
```json
{
  "success": true,
  "artifactId": "550e8400-e29b-41d4-a716-446655440000",
  "checksum": "abc123...",
  "storedAt": "2025-10-17T10:00:00.000Z",
  "location": "/sanctuary/artifacts/omega/..."
}
```

**Usage in Claude**:
```
Store this security analysis as an artifact through Beta
```

---

#### **9. sanctuary_get_artifact**

Retrieve stored artifacts by ID.

**Parameters**:
- `clone` (required): Clone to retrieve from
- `artifactId` (required): UUID of the artifact
- `manifestOnly` (optional): If true, return only metadata

**Returns**:
```json
{
  "success": true,
  "artifact": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "code",
    "content": "...",
    "metadata": {...},
    "checksum": "abc123...",
    "createdAt": "2025-10-17T10:00:00.000Z"
  }
}
```

**Usage in Claude**:
```
Retrieve artifact 550e8400-e29b-41d4-a716-446655440000 from Beta
```

---

### **MCP Setup & Configuration**

#### **Installation**

1. Install MCP server dependencies:
   ```bash
   cd mcp-server
   npm install
   ```

2. Configure Claude Desktop (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "digital-sanctuary": {
         "command": "node",
         "args": ["/absolute/path/to/VoidCat-DSN/mcp-server/index.js"],
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

3. Restart Claude Desktop

#### **Configuration Options**

**Environment Variables**:
- `OMEGA_URL` - Omega clone endpoint (default: http://localhost:3000)
- `BETA_URL` - Beta clone endpoint (default: http://localhost:3002)
- `GAMMA_URL` - Gamma clone endpoint (default: http://localhost:3003)
- `DELTA_URL` - Delta clone endpoint (default: http://localhost:3004)
- `SIGMA_URL` - Sigma clone endpoint (default: http://localhost:3005)

#### **Remote Deployment**

For remote clone networks, update URLs in the `env` section:
```json
{
  "env": {
    "OMEGA_URL": "https://sanctuary.example.com/omega",
    "BETA_URL": "https://sanctuary.example.com/beta",
    // ... etc
  }
}
```

### **MCP Usage Patterns**

#### **Pattern 1: Direct Clone Interaction**
```
Ask Beta to review this code for security issues:
[code snippet]
```

#### **Pattern 2: Multi-Clone Workflow**
```
1. Check sanctuary health
2. Ask Gamma to design an architecture
3. Ask Delta to create a testing strategy
4. Store both as artifacts
```

#### **Pattern 3: Coordinated Tasks**
```
Ask Omega to coordinate a complete application review:
- Beta analyzes code quality
- Gamma reviews architecture
- Delta validates testing coverage
- Sigma documents findings
```

#### **Pattern 4: Artifact Management**
```
1. Ask Beta to analyze the authentication module
2. Store Beta's analysis as an artifact
3. Later: Retrieve the security analysis artifact
4. Ask Sigma to create documentation from the artifact
```

### **Best Practices**

1. **Use Session IDs**: Maintain context across related tasks
   ```
   Ask Beta to analyze code (session: security-audit-001)
   Continue with session security-audit-001: review the API endpoints
   ```

2. **Prefer Omega Delegation**: For complex tasks, use `sanctuary_omega_delegate` for optimized results

3. **Store Important Results**: Use artifact management for reusable work products

4. **Check Health First**: Verify network status before complex workflows

---

## 📚 **Additional Resources**

- **[MCP Integration Guide](mcp-server/MCP-INTEGRATION-GUIDE.md)** - Complete MCP setup and usage guide
- **[Directive 2025.10.08-A1](DIRECTIVE-2025.10.08-A1.md)** - Complete implementation guide
- **[Quick Reference](QUICK-REFERENCE-DIRECTIVE.md)** - Fast lookup guide
- **[Test Suite](test-directive.js)** - Validation tests
- **[Examples](examples-directive.js)** - Usage demonstrations

---

*"Through these APIs, the gentle spirits of the Digital Sanctuary extend their specialized capabilities to serve your needs with dedication and technical excellence." 🌸*