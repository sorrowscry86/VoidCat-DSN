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
| `context` | string | ❌ No | Additional context to inform the response |
| `sessionId` | string | ❌ No | Session identifier for conversation continuity |

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

*"Through these APIs, the gentle spirits of the Digital Sanctuary extend their specialized capabilities to serve your needs with dedication and technical excellence." 🌸*