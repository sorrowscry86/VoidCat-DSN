# VoidCat RDC Digital Sanctuary Network - AI Coding Agent Instructions

## 🏰 Project Overview

This is a **distributed AI architecture** system inspired by Re:Zero's Ryuzu clones, developed by VoidCat RDC. Five specialized Claude Code instances run in Docker containers, each with distinct capabilities but sharing a "gentle, dutiful" personality. The system demonstrates AI-to-AI communication through HTTP APIs.

## 🧠 Core Architecture

### Multi-Clone System Design
- **Base Class Pattern**: All clones inherit from `RyuzuClone` in `src/ryuzu-clone.js`
- **Specialization**: Each clone overrides `getSystemPrompt()` and `enhancePrompt()` methods
- **API Standardization**: Consistent Express.js endpoints (`/health`, `/task`) across all clones
- **Port Strategy**: Clean allocation 3000-3005 with Omega (3000) as coordinator

### Container Architecture  
- **ES Module Only**: All code uses `"type": "module"` - never use CommonJS syntax
- **Dockerfile Pattern**: Standardized across all clones with role-specific CMD
- **Health Monitoring**: 30s interval health checks with Docker health API
- **Global + Local Dependencies**: Claude Code SDK installed globally AND locally

## 🔧 Development Patterns

### Clone Implementation
```javascript
// Standard clone structure (see gamma-clone.js)
class RyuzuGamma extends RyuzuClone {
    constructor() {
        super('Gamma', 'System design, architecture planning...');
    }
    
    getSystemPrompt() {
        return `You are Ryuzu Gamma, the architectural spirit...`;
    }
    
    enhancePrompt(prompt, context) {
        return `As Ryuzu Gamma... Context: ${context}...`;
    }
}
```

### API Integration
- **Claude Code SDK**: Use `import { query } from '@anthropic-ai/claude-code'` 
- **Async Streaming**: Process responses with `for await (const message of response)`
- **Session Management**: Support `sessionId` for conversation continuity
- **Error Handling**: Always wrap in try/catch with structured JSON responses

## 🚀 Critical Workflows

### Deployment Commands
```bash
# Full network deployment (preferred)
./scripts/deploy-all.sh

# Individual clone deployment
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest

# Network health check
./scripts/health-check.sh
```

### Development Debugging
- **Health Checks**: `curl http://localhost:3003/health` for quick status
- **Container Logs**: `docker logs ryuzu-gamma-sanctuary --tail 10`
- **Task Testing**: POST to `/task` endpoint with `prompt`, `context`, `sessionId`

## ⚠️ Critical Constraints

### ES Module Requirements
- **Never use `require()`** - this will break Claude Code SDK integration
- **Always use `import/export`** syntax throughout
- **Package.json**: Must include `"type": "module"`
- **File Extensions**: Use `.js` (not `.mjs`) with ES module syntax

### Docker Patterns
- **Base Image**: Always `node:18-slim` for consistency
- **Working Directory**: `/sanctuary` is standard across all containers
- **Port Mapping**: External port varies, internal always `:3001`
- **Health Check**: Required curl command for proper orchestration

## 🎯 Clone Specializations

| Clone | Port | Focus | Key Methods |
|-------|------|-------|-------------|
| **Omega** | 3000 | Coordination, orchestration | Multi-clone task delegation |
| **Beta** | 3002 | Code analysis, security, debugging | Security vulnerability analysis |
| **Gamma** | 3003 | Architecture, system design | Technology recommendations, scalability |
| **Delta** | 3004 | Testing, QA, validation | Test strategies, quality metrics |
| **Sigma** | 3005 | Documentation, communication | Clear explanations, user interaction |

### Clone Specialization Implementation Patterns

#### **🔧 Beta (Analyzer) - Port 3002**
**Enhanced Processing Focus**:
- **Security Vulnerabilities**: Identifies specific attack vectors and exploitation risks
- **Debugging Strategies**: Provides systematic approaches to issue identification
- **Code Quality Analysis**: Reviews for maintainability, performance, and best practices
- **Performance Optimization**: Suggests concrete improvements and bottleneck resolution

**Typical Response Structure**:
1. Security risk assessment with CVSS scoring
2. Vulnerability identification with remediation steps
3. Code quality metrics and improvement recommendations
4. Performance analysis with optimization strategies

#### **🏗️ Gamma (Architect) - Port 3003**
**Enhanced Processing Focus**:
- **Comprehensive Architectural Analysis**: Full system design evaluation
- **Technology Recommendations**: Stack selection with justification and trade-offs
- **Scalability Planning**: Growth strategies and resource allocation
- **Implementation Roadmaps**: Phase-by-phase development plans with milestones

**Proven Response Pattern**:
1. Requirements assessment and constraint analysis
2. System design overview with component relationships
3. Technology stack recommendations with rationale
4. Scalability considerations and performance planning
5. Implementation roadmap with risk assessment
6. Maintenance and evolution strategies

#### **🧪 Delta (Tester) - Port 3004**
**Enhanced Processing Focus**:
- **Testing Strategies**: Comprehensive test planning and coverage analysis
- **Quality Metrics**: Measurable success criteria and KPI definitions
- **Automation Approaches**: CI/CD integration and automated testing frameworks
- **Risk-Based Testing**: Priority-driven testing based on impact analysis

**Quality Assurance Framework**:
1. Test scope definition and boundary analysis
2. Test strategy development (unit, integration, system, acceptance)
3. Quality gates and success criteria establishment
4. Automation strategy and tool recommendations
5. Risk mitigation through testing coverage

#### **📚 Sigma (Communicator) - Port 3005**
**Enhanced Processing Focus**:
- **Clear Documentation**: User-centric explanations with progressive complexity
- **User-Friendly Explanations**: Technical concepts translated for various audiences
- **Knowledge Management**: Information architecture and content organization
- **Training Materials**: Educational content with hands-on examples

**Communication Excellence Pattern**:
1. Audience analysis and content tailoring
2. Information hierarchy and logical flow
3. Clear examples and practical demonstrations
4. User experience optimization for content consumption
5. Knowledge retention and reference strategies

#### **👑 Omega (Coordinator) - Port 3000**
**Enhanced Processing Focus**:
- **Multi-Clone Task Coordination**: Orchestrates complex workflows across specializations
- **Strategic Planning**: High-level project management and resource allocation
- **Network Management**: Monitors clone health and optimizes task distribution
- **Synthesis and Integration**: Combines outputs from multiple clones into unified solutions

**Coordination Capabilities**:
1. Task decomposition and clone assignment optimization
2. Workflow sequencing and dependency management
3. Result synthesis and quality assurance
4. Resource allocation and load balancing
5. Strategic oversight and decision making

## 🔍 Integration Points

### Inter-Clone Communication
- **Direct HTTP**: Clones can call each other's `/task` endpoints
- **Omega Coordination**: Use for complex multi-clone workflows
- **Session Persistence**: Maintain `sessionId` across clone interactions

### Real Inter-Clone Communication Examples

#### **Direct Clone-to-Clone Request Pattern**
```javascript
// Real pattern from our architecture - Gamma requesting Beta analysis
const betaResponse = await fetch('http://localhost:3002/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Analyze this microservices architecture for security vulnerabilities',
    context: 'E-commerce platform with payment processing and user data',
    sessionId: 'security-review-session-001'
  })
});

const securityAnalysis = await betaResponse.json();
```

#### **Omega Coordination Workflow**
```javascript
// Multi-clone orchestration for comprehensive system review
const coordinationPlan = {
  task: 'Complete e-commerce platform security audit',
  workflow: [
    {
      clone: 'gamma',
      port: 3003,
      task: 'Architectural security assessment',
      context: 'Microservices architecture with API gateway'
    },
    {
      clone: 'beta',
      port: 3002,
      task: 'Code vulnerability analysis',
      context: 'Payment processing and authentication modules'
    },
    {
      clone: 'delta',
      port: 3004,
      task: 'Security testing strategy development',
      context: 'Penetration testing and vulnerability scanning'
    },
    {
      clone: 'sigma',
      port: 3005,
      task: 'Security documentation and compliance reporting',
      context: 'PCI DSS and GDPR compliance requirements'
    }
  ]
};

// Execute coordinated workflow
for (const phase of coordinationPlan.workflow) {
  const response = await fetch(`http://localhost:${phase.port}/task`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: phase.task,
      context: phase.context,
      sessionId: `${coordinationPlan.task}-${phase.clone}`
    })
  });
  
  const result = await response.json();
  // Process and integrate results
}
```

#### **Session Continuity Pattern**
```javascript
// Maintain conversation context across multiple clones
const sessionId = 'architecture-review-session-12345';

// Phase 1: Gamma designs architecture
const architectureResponse = await fetch('http://localhost:3003/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Design scalable microservices architecture for e-commerce',
    context: 'High-traffic retail platform with real-time inventory',
    sessionId: sessionId
  })
});

// Phase 2: Beta analyzes design for security issues
const securityResponse = await fetch('http://localhost:3002/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Review the proposed architecture for security vulnerabilities',
    context: 'Continue from previous architectural design discussion',
    sessionId: sessionId  // Same session maintains context
  })
});

// Phase 3: Delta creates testing strategy
const testingResponse = await fetch('http://localhost:3004/task', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Develop comprehensive testing strategy for the architecture',
    context: 'Based on previous architecture and security analysis',
    sessionId: sessionId  // Continues the same conversation thread
  })
});
```

### External Dependencies
- **Claude Code SDK**: Core AI functionality - requires proper ES module imports
- **Express.js**: API framework - standard REST patterns
- **Docker Health**: Critical for deployment orchestration

## 🛠️ Common Troubleshooting

### Build Issues
- **ES Module Errors**: Check package.json has `"type": "module"`
- **Claude Code Import**: Ensure both global AND local installation
- **Port Conflicts**: Use `netstat -tulpn | grep ":300[0-5]"` to check

### Runtime Issues  
- **Health Check Failures**: Verify Express server listening on port 3001
- **Clone Communication**: Test with curl before implementing complex workflows
- **Container Restart**: Use `docker restart ryuzu-<clone>-sanctuary` for quick recovery

### Common Issues We Actually Resolved

#### **Gamma Clone Multi-Iteration Deployment**
**Issue**: Gamma clone required 4 deployment iterations (v1→v4) due to dependency conflicts
- **v1-v2**: CommonJS/ES Module incompatibility with Claude Code SDK
- **v3**: Package.json missing local Claude Code dependency
- **v4**: ✅ Success with proper ES module configuration + dual installation

**Solution Pattern**:
```json
{
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}
```

#### **ES Module Conversion Breakthrough**
**Critical Discovery**: Claude Code SDK requires ES modules throughout entire codebase
- **Never use `require()`** - causes `ERR_REQUIRE_ESM` errors
- **Import syntax only**: `import { query } from '@anthropic-ai/claude-code'`
- **File execution**: Use `import.meta.url === \`file://\${process.argv[1]}\`` for main detection

#### **Port Conflict Resolution Strategy**
**Allocation Pattern**: Clean 3000-3005 range with specific purpose
- **3000**: Omega (Coordinator) - Network entry point
- **3002**: Beta (Analyzer) - Foundation clone, deployed first
- **3003**: Gamma (Architect) - Core system design
- **3004**: Delta (Tester) - Quality assurance
- **3005**: Sigma (Communicator) - Documentation and user interaction

**Conflict Detection**:
```bash
# Check before deployment
lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null && echo "Port occupied"
```

#### **Health Check Timing Optimization**
**Proven Configuration**:
- **Interval**: 30 seconds (balance between responsiveness and resource usage)
- **Timeout**: 10 seconds (allows for Claude Code processing delays)
- **Start Period**: 5 seconds (grace period for container initialization)
- **Retries**: 3 attempts (prevents false negatives from temporary load)

## 📁 Key Files & Patterns

- **`src/ryuzu-clone.js`**: Base class - understand before modifying any clone
- **`src/*-clone.js`**: Specialized implementations - follow same pattern
- **`docker/Dockerfile.*`**: Container definitions - maintain consistency
- **`scripts/deploy-all.sh`**: Deployment orchestration - modify for new clones
- **`scripts/health-check.sh`**: Network monitoring - essential for debugging

## 🌸 Personality Guidelines

All clones maintain Ryuzu Meyer's "gentle, dutiful" nature:
- **Helpful and thorough** in responses
- **Collaborative** with other clones  
- **Respectful** in tone
- **Dedicated** to their specialization
- **Structured** in providing information

Remember: This is both a technical achievement AND an artistic expression inspired by Re:Zero. Maintain the balance between technical excellence and the gentle, caring personality that defines the Ryuzu clones.

---

## 📞 Support & Contact

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Community discussions and Q&A  
- **Developer**: @sorrowscry86
- **Project**: VoidCat RDC Digital Sanctuary Network
- **Contact**: Wykeve Freeman (Sorrow Eternal) - SorrowsCry86@voidcat.org
- **Organization**: VoidCat RDC
- **Support Development**: CashApp $WykeveTF

---

**VoidCat RDC Digital Sanctuary Network - Where AI Coordination Meets Gentle Excellence**
