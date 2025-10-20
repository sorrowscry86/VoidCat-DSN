# 🤖 VoidCat RDC - Comprehensive Coding Agent Instructions

**Project:** VoidCat RDC Digital Sanctuary Network - AutoGen Integration  
**Version:** 2.0  
**Last Updated:** October 20, 2025  
**Status:** Phase 2 - Clone Integration

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Core Concepts](#architecture--core-concepts)
3. [Code Standards & Patterns](#code-standards--patterns)
4. [Clone System Architecture](#clone-system-architecture)
5. [Development Workflow](#development-workflow)
6. [Key Technologies & Dependencies](#key-technologies--dependencies)
7. [Phase 2 Implementation Guide](#phase-2-implementation-guide)
8. [Testing Requirements](#testing-requirements)
9. [Common Patterns & Solutions](#common-patterns--solutions)
10. [Troubleshooting & Best Practices](#troubleshooting--best-practices)

---

## 🎯 Project Overview

### Mission Statement
Build a **distributed AI agent network** inspired by Re:Zero's Ryuzu clones, where 5 specialized Claude Code instances coordinate through AutoGen orchestration to accomplish complex tasks with perfect specialization alignment.

### Key Components

**5 Specialized Clones:**
- **Omega** (Port 3000) - Coordinator, orchestrates multi-clone workflows
- **Beta** (Port 3002) - Code analyzer, security specialist
- **Gamma** (Port 3003) - System architect, design specialist
- **Delta** (Port 3004) - Testing specialist, QA lead
- **Sigma** (Port 3005) - Documentation specialist, communicator

### Current Status
- ✅ **Phase 1:** Foundation complete (68/68 tests passed)
- 🚀 **Phase 2:** Clone Integration (in-progress)
- 📋 **Phase 3:** MCP Enhancement (planned)
- 🎯 **Phase 4:** Operational Deployment (planned)

---

## 🏗️ Architecture & Core Concepts

### System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    User/External System              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│          Omega (Coordinator) - Port 3000             │
│  ┌──────────────────────────────────────────────┐  │
│  │ OrchestratorAgent (routing/coordination)      │  │
│  │ TaskAssignment → Task Distribution            │  │
│  │ ResultAggregation → Response Synthesis        │  │
│  └──────────────────────────────────────────────┘  │
└─┬────────────────────────────────────────────────┬──┘
  │                                                │
  ├─────────────────────┬──────────────────┬──────┴──────┬───────────────┐
  ▼                     ▼                  ▼             ▼               ▼
┌────────┐         ┌────────┐        ┌────────┐    ┌────────┐      ┌────────┐
│ Beta   │         │ Gamma  │        │ Delta  │    │ Sigma  │      │Others  │
│Security│         │Architect       │Testing │    │Docs    │      │Future  │
│3002    │         │3003    │        │3004    │    │3005    │      │Clones  │
└────────┘         └────────┘        └────────┘    └────────┘      └────────┘
```

### Core Concepts

**1. OrchestratorAgent Pattern**
- Base class for orchestration-aware agents
- Handles task delegation and result aggregation
- Maintains execution state and audit trail

**2. Message Protocol (SanctuaryMessageProtocol)**
- 10 message types for inter-clone communication
- Reliable delivery with acknowledgment
- Callback system for result handling

**3. Runtime Manager (AutoGenRuntimeManager)**
- Initializes and manages the clone network
- Tracks active clones and their health
- Manages task lifecycle from delegation to completion

**4. Artifact Manager**
- Version-controlled storage for work products
- Checksums for integrity verification
- Manifest system for efficient references

**5. Context Engineering**
- Optimizes context packages for clone consumption
- Quality scoring for information relevance
- Efficient multi-clone communication

---

## 📝 Code Standards & Patterns

### ES6 Module Requirements

**CRITICAL:** All code uses ES6 modules (ES Module-only architecture)

```javascript
// ✅ CORRECT: ES6 import/export
import express from 'express';
import { query } from '@anthropic-ai/claude-code';

export default class MyClass {
  // implementation
}

export function myFunction() {
  // implementation
}

// ❌ WRONG: Never use CommonJS
const express = require('express');  // ERROR!
module.exports = MyClass;            // ERROR!
```

**Package.json Requirement:**
```json
{
  "type": "module",
  "engines": { "node": ">=18.0.0" }
}
```

### Class Structure Pattern

```javascript
import express from 'express';
import { query } from '@anthropic-ai/claude-code';

/**
 * MyClone - Brief description
 * 
 * Role: [Primary responsibility]
 * Specialization: [Specific expertise]
 * 
 * @extends RyuzuClone or OrchestratorAgent
 */
class MyClone extends RyuzuClone {
  constructor(role = 'MyClone', specialization = 'My Specialization') {
    super(role, specialization);
    this.setupSpecializedRoutes();
  }

  /**
   * Get system prompt for Claude Code
   * @returns {string} System prompt with personality & capabilities
   */
  getSystemPrompt() {
    return `You are Ryuzu ${this.role}, the ${this.specialization}.
Your role involves: [specific responsibilities]
Maintain: [personality traits - gentle, dutiful, precise]
Respond in JSON format when appropriate.`;
  }

  /**
   * Enhance incoming prompts with specialization context
   * @param {string} prompt - User prompt
   * @param {string} context - Additional context
   * @returns {string} Enhanced prompt
   */
  enhancePrompt(prompt, context) {
    return `As Ryuzu ${this.role}...
Context: ${context || 'None'}
Task: ${prompt}`;
  }

  setupSpecializedRoutes() {
    // Add clone-specific routes here
    this.app.post('/specialized-task', async (req, res) => {
      // Implementation
    });
  }

  async start(port = 3001) {
    return this.app.listen(port, () => {
      console.log(`${this.role} clone listening on port ${port}`);
    });
  }
}

export default MyClone;
```

### Async/Await Pattern

```javascript
// ✅ CORRECT: Proper async/await with error handling
async handleTask(taskData) {
  try {
    const result = await this.executeTask(taskData);
    return this.formatResult(result);
  } catch (error) {
    console.error(`Task failed: ${error.message}`);
    throw new Error(`Task execution failed: ${error.message}`);
  }
}

// ✅ CORRECT: For loop with async operations
for await (const message of asyncIterator) {
  this.processMessage(message);
}

// ❌ WRONG: Not awaiting promises
const result = this.executeTask(taskData);  // Missing await!
```

### Error Handling Pattern

```javascript
// ✅ CORRECT: Comprehensive error handling
this.app.post('/task', async (req, res) => {
  try {
    if (!req.body.prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    const result = await this.processTask(req.body);
    
    res.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error in /task: ${error.message}`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      role: this.role
    });
  }
});
```

### JSON Response Pattern

```javascript
// ✅ CORRECT: Consistent JSON responses
{
  "success": true,
  "role": "Beta",
  "result": { /* data */ },
  "timestamp": "2025-10-20T...",
  "sessionId": "session-123"
}

// ✅ CORRECT: Error responses
{
  "success": false,
  "error": "Descriptive error message",
  "role": "Beta",
  "code": "ERROR_CODE"
}
```

### Naming Conventions

```javascript
// ✅ Classes: PascalCase
class RyuzuClone { }
class OrchestratorAgent { }

// ✅ Methods/Functions: camelCase
function executeTask() { }
async processMessage() { }

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const DEFAULT_TIMEOUT = 5000;
const MESSAGE_TYPES = {
  TASK_ASSIGNMENT: 'TaskAssignment',
  TASK_COMPLETION: 'TaskCompletion'
};

// ✅ Variables: camelCase
let activeClones = [];
const messageRouter = new SanctuaryMessageProtocol();
```

---

## 🔀 Clone System Architecture

### Base Clone Class (RyuzuClone)

Located: `src/ryuzu-clone.js`

**Responsibilities:**
- Express.js setup and route management
- Claude Code SDK integration
- Context package processing
- Artifact management
- Health checks and monitoring

**Key Methods:**
```javascript
class RyuzuClone {
  constructor(role, specialization)      // Initialize clone
  setupRoutes()                          // Configure Express routes
  getSystemPrompt()                      // Get Claude system prompt
  enhancePrompt(prompt, context)         // Enhance prompts with context
  processContextPackage(contextPackage)  // Process engineered context
  start(port)                            // Start listening on port
}
```

**Available Endpoints:**
```
GET  /health                             # Health check
POST /task                               # Execute task
POST /artifacts                          # Store artifact
GET  /artifacts/:id                      # Retrieve artifact
```

### Clone Specializations

**Beta Clone (src/beta-clone.js)**
```javascript
class BetaClone extends RyuzuClone {
  // Specialization: Code analysis, security review
  // Methods: analyzeSecurity(), findVulnerabilities()
  // Expertise: Vulnerability detection, code quality
}
```

**Gamma Clone (src/gamma-clone.js)**
```javascript
class GammaClone extends RyuzuClone {
  // Specialization: System architecture, design planning
  // Methods: designArchitecture(), evaluateScalability()
  // Expertise: Architecture patterns, system design
}
```

**Delta Clone (src/delta-clone.js)**
```javascript
class DeltaClone extends RyuzuClone {
  // Specialization: Testing, quality assurance
  // Methods: generateTestStrategy(), validateQuality()
  // Expertise: Test planning, QA metrics
}
```

**Sigma Clone (src/sigma-clone.js)**
```javascript
class SigmaClone extends RyuzuClone {
  // Specialization: Documentation, communication
  // Methods: generateDocumentation(), explainConcept()
  // Expertise: Technical writing, knowledge management
}
```

**Omega Clone (src/omega-clone.js)**
```javascript
class OmegaClone extends OrchestratorAgent {
  // Specialization: Orchestration, coordination
  // Methods: delegateTask(), synthesizeResults()
  // Expertise: Multi-clone coordination, workflow management
}
```

---

## 🔄 Development Workflow

### Phase 2: Clone Integration Workflow

**Current Focus:** Implement orchestration support in each clone

**Step 1: Preparation**
```
1. Review: docs/architecture/ARCHITECTURE.md
2. Read: phase-2-planning/PHASE2_IMPLEMENTATION_PLAN.md
3. Understand: Message protocol in src/ (search for SanctuaryMessageProtocol)
4. Study: Existing clone implementations (beta-clone.js pattern)
```

**Step 2: Base Class Update**
```
File: src/ryuzu-clone.js
1. Add orchestration imports
2. Implement TaskAssignment handler
3. Add message router integration
4. Create response callbacks
5. Add orchestration status tracking
```

**Step 3: Create Routing System**
```
File: src/routing-config.js (NEW)
1. Define task type → clone mappings
2. Set priority and timeout values
3. Implement health-based routing
4. Add fallback strategies
```

**Step 4: Create Message Handlers**
```
File: src/message-handlers.js (NEW)
1. Implement TaskAssignment processor
2. Implement StatusQuery responder
3. Implement ErrorEscalation handler
```

**Step 5: Update Individual Clones**
```
Sequence: Beta → Gamma → Delta → Sigma
For each clone:
  1. Add orchestration imports
  2. Implement clone-specific task handlers
  3. Create unit tests
  4. Integration testing with OrchestratorAgent
```

**Step 6: Validation**
```
1. Unit tests: All clones pass orchestration tests
2. Integration: Multi-clone workflows work
3. Performance: <100ms task delegation latency
4. Reliability: >99% message delivery
```

### Daily Workflow

```
1. READ the current todo (from manage_todo_list)
2. MARK todo as in-progress
3. PLAN the changes (write high-level comment)
4. IMPLEMENT the changes (write production code)
5. TEST the implementation (run unit tests)
6. VERIFY against requirements
7. COMMIT changes with clear messages
8. MARK todo as completed
9. MOVE to next todo
```

### Git Workflow

```bash
# Before starting work
git pull origin main
git status

# During development
git add [specific files]
git commit -m "Clear, descriptive commit message"

# Before pushing
git log --oneline -5
git diff origin/main

# Push changes
git push origin main
```

---

## 🔧 Key Technologies & Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | HTTP server framework |
| @anthropic-ai/claude-code | ^1.0.0 | Claude Code integration |
| axios | ^1.6.0 | HTTP client (inter-clone communication) |
| uuid | ^9.0.0 | Unique ID generation |

### Optional Dependencies (AutoGen)

| Package | Version | Purpose |
|---------|---------|---------|
| @anthropic-ai/autogen-core | ^0.4.0 | AutoGen core orchestration |
| @anthropic-ai/autogen-ext | ^0.4.0 | AutoGen extensions |

### Running Code

```javascript
// ✅ CORRECT: Use Claude Code SDK
import { query } from '@anthropic-ai/claude-code';

const response = query({
  prompt: 'Your task here',
  options: {
    maxTurns: 3,
    systemPrompt: 'Your system instructions',
    outputFormat: 'json'
  }
});

for await (const message of response) {
  console.log(message);
}

// For HTTP requests between clones
import axios from 'axios';

const response = await axios.post('http://localhost:3002/task', {
  prompt: 'Analysis request',
  context: 'Relevant context',
  sessionId: 'session-123'
});
```

### UUID Generation

```javascript
import { v4 as uuidv4 } from 'uuid';

const taskId = uuidv4();  // Generates unique ID
const sessionId = uuidv4();
```

---

## 🚀 Phase 2 Implementation Guide

### Task 1: Update src/ryuzu-clone.js

**Add orchestration imports and initialization:**

```javascript
// At top of file, add:
import { SanctuaryMessageProtocol } from './message-protocol.js';
import { AutoGenRuntimeManager } from './runtime-manager.js';

class RyuzuClone {
  constructor(role, specialization) {
    this.role = role;
    this.specialization = specialization;
    this.app = express();
    this.artifactManager = new ArtifactManager();
    
    // NEW: Orchestration components
    this.messageRouter = new SanctuaryMessageProtocol();
    this.runtimeManager = new AutoGenRuntimeManager();
    
    this.setupRoutes();
    this.setupOrchestrationHandlers();  // NEW
  }

  setupOrchestrationHandlers() {
    // NEW: Handle incoming TaskAssignment messages
    this.messageRouter.on('TaskAssignment', async (msg) => {
      const result = await this.handleTaskAssignment(msg);
      // Send TaskCompletion back
    });

    // NEW: Handle StatusQuery requests
    this.messageRouter.on('StatusQuery', async (msg) => {
      const status = this.getStatus();
      // Send StatusResponse back
    });

    // NEW: Handle ErrorEscalation messages
    this.messageRouter.on('ErrorEscalation', async (msg) => {
      await this.handleErrorEscalation(msg);
    });
  }

  async handleTaskAssignment(taskMessage) {
    // Implement clone-specific task execution
    const taskId = taskMessage.taskId;
    const taskType = taskMessage.type;
    const taskData = taskMessage.data;

    try {
      // Execute task using Claude Code
      const response = query({
        prompt: taskData.prompt,
        options: {
          systemPrompt: this.getSystemPrompt(),
          maxTurns: 3
        }
      });

      const result = [];
      for await (const msg of response) {
        result.push(msg);
      }

      // Return TaskCompletion
      return {
        taskId,
        status: 'completed',
        result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Return TaskFailure
      return {
        taskId,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  getStatus() {
    return {
      role: this.role,
      status: 'active',
      timestamp: new Date().toISOString(),
      activeTasks: this.messageRouter.getActiveTaskCount()
    };
  }
}
```

### Task 2: Create src/routing-config.js

```javascript
/**
 * Clone routing configuration
 * Maps task types to appropriate clones
 * Defines routing rules, priorities, and timeouts
 */

export const routingConfig = {
  'security-analysis': {
    destination: 'beta',
    priority: 'high',
    timeout: 30000,
    retries: 2,
    description: 'Route to Beta clone for security analysis'
  },
  'architecture-design': {
    destination: 'gamma',
    priority: 'high',
    timeout: 45000,
    retries: 1,
    description: 'Route to Gamma clone for architecture design'
  },
  'test-strategy': {
    destination: 'delta',
    priority: 'medium',
    timeout: 30000,
    retries: 2,
    description: 'Route to Delta clone for testing'
  },
  'documentation': {
    destination: 'sigma',
    priority: 'low',
    timeout: 20000,
    retries: 1,
    description: 'Route to Sigma clone for documentation'
  }
};

export function getRouting(taskType) {
  return routingConfig[taskType] || {
    destination: 'omega',  // Default to Omega coordinator
    priority: 'medium',
    timeout: 30000,
    retries: 1
  };
}

export function getCloneForDestination(destination) {
  const cloneMap = {
    'beta': 'http://localhost:3002',
    'gamma': 'http://localhost:3003',
    'delta': 'http://localhost:3004',
    'sigma': 'http://localhost:3005'
  };
  return cloneMap[destination];
}
```

### Task 3: Create src/message-handlers.js

```javascript
/**
 * Message handlers for orchestration
 * Implements SanctuaryMessageProtocol handlers
 */

export class MessageHandlers {
  constructor(clone) {
    this.clone = clone;
  }

  async handleTaskAssignment(message) {
    try {
      const { taskId, type, data, deadline } = message;
      
      // Check if task is within deadline
      if (new Date(deadline) < new Date()) {
        return {
          type: 'TaskFailure',
          taskId,
          error: 'Task deadline exceeded',
          severity: 'high'
        };
      }

      // Execute task (delegate to clone-specific handler)
      const result = await this.clone.executeTask(data);

      return {
        type: 'TaskCompletion',
        taskId,
        result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        type: 'TaskFailure',
        taskId: message.taskId,
        error: error.message,
        severity: 'high'
      };
    }
  }

  async handleStatusQuery(message) {
    return {
      type: 'StatusResponse',
      cloneId: this.clone.role,
      status: 'active',
      activeTasks: this.clone.messageRouter.getActiveTaskCount(),
      timestamp: new Date().toISOString()
    };
  }

  async handleErrorEscalation(message) {
    const { error, severity } = message;
    
    console.error(`Error escalation (${severity}): ${error}`);
    
    // Implement recovery based on severity
    if (severity === 'critical') {
      // Restart or escalate further
      return {
        type: 'RecoveryAction',
        action: 'restart',
        timestamp: new Date().toISOString()
      };
    }
  }
}
```

### Task 4: Update Individual Clones

**Pattern for each clone (Beta, Gamma, Delta, Sigma):**

```javascript
import RyuzuClone from './ryuzu-clone.js';

class BetaClone extends RyuzuClone {
  constructor() {
    super('Beta', 'Code Analysis & Security Specialist');
  }

  getSystemPrompt() {
    return `You are Ryuzu Beta, the Code Analysis & Security Specialist.

Your expertise:
- Vulnerability detection and analysis
- Code quality assessment
- Security pattern identification
- Performance bottleneck detection

Respond as a security expert with precision and clarity.
Maintain a gentle, dutiful demeanor.
Format responses as JSON when appropriate.`;
  }

  async executeTask(taskData) {
    // Clone-specific task implementation
    const { code, analysisType } = taskData;

    const response = query({
      prompt: \`Analyze this code for \${analysisType}:\n\${code}\`,
      options: {
        systemPrompt: this.getSystemPrompt(),
        maxTurns: 3,
        outputFormat: 'json'
      }
    });

    const results = [];
    for await (const msg of response) {
      results.push(msg);
    }

    return results;
  }

  setupSpecializedRoutes() {
    this.app.post('/security-analysis', async (req, res) => {
      try {
        const { code, severity } = req.body;
        const result = await this.executeTask({ code, analysisType: 'security' });
        res.json({ success: true, result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  }
}

export default BetaClone;
```

---

## 🧪 Testing Requirements

### Unit Testing Pattern

```javascript
import assert from 'assert';
import BetaClone from '../src/beta-clone.js';

// Test Suite
const suite = {
  name: 'Beta Clone Orchestration',
  tests: []
};

// Test 1: Clone initializes correctly
suite.tests.push({
  name: 'Clone initialization',
  run: () => {
    const clone = new BetaClone();
    assert.strictEqual(clone.role, 'Beta');
    assert.ok(clone.messageRouter);
  }
});

// Test 2: Task assignment handler works
suite.tests.push({
  name: 'Handle task assignment',
  run: async () => {
    const clone = new BetaClone();
    const taskMessage = {
      taskId: 'test-123',
      type: 'security-analysis',
      data: { code: 'const x = 1;' }
    };
    const result = await clone.handleTaskAssignment(taskMessage);
    assert.strictEqual(result.taskId, 'test-123');
    assert.ok(result.result);
  }
});

// Run tests
console.log(`\n📋 Running: ${suite.name}`);
for (const test of suite.tests) {
  try {
    await test.run();
    console.log(`✅ ${test.name}`);
  } catch (error) {
    console.log(`❌ ${test.name}: ${error.message}`);
  }
}
```

### Running Tests

```bash
# Run all Phase 2 tests
cd src
node tests/test-orchestration-integration.js
node tests/test-routing-system.js
node tests/test-cross-clone-communication.js

# Expected output: All tests pass ✅
```

---

## 🔧 Common Patterns & Solutions

### Pattern 1: Inter-Clone Communication

```javascript
import axios from 'axios';

async function delegateTaskToClone(cloneUrl, taskData) {
  try {
    const response = await axios.post(`${cloneUrl}/task`, {
      prompt: taskData.prompt,
      context: taskData.context,
      sessionId: taskData.sessionId
    });

    return response.data;
  } catch (error) {
    console.error(`Clone communication failed: ${error.message}`);
    throw error;
  }
}

// Usage:
const result = await delegateTaskToClone(
  'http://localhost:3002',  // Beta clone
  {
    prompt: 'Analyze this code',
    context: 'Security context',
    sessionId: 'session-123'
  }
);
```

### Pattern 2: Message Protocol Integration

```javascript
// Create message
const taskAssignment = {
  type: 'TaskAssignment',
  taskId: uuidv4(),
  destination: 'beta',
  data: { /* task data */ },
  deadline: new Date(Date.now() + 30000),  // 30 second deadline
  priority: 'high'
};

// Queue message
messageRouter.queueMessage(taskAssignment);

// Register callback
messageRouter.onDelivered('taskId-123', (result) => {
  console.log('Task completed:', result);
});

// Handle response
messageRouter.on('TaskCompletion', (msg) => {
  console.log('Result received:', msg.result);
});
```

### Pattern 3: Error Recovery

```javascript
async function executeWithRetry(fn, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt}/${maxRetries} failed: ${error.message}`);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Usage:
const result = await executeWithRetry(async () => {
  return await delegateTaskToClone(cloneUrl, taskData);
});
```

### Pattern 4: Audit Trail Logging

```javascript
function logAuditTrail(event) {
  const timestamp = new Date().toISOString();
  const auditEntry = {
    timestamp,
    role: this.role,
    event: event.type,
    taskId: event.taskId,
    status: event.status,
    details: event.details
  };

  // Store in audit trail (bounded at 10k entries)
  this.auditTrail.push(auditEntry);
  if (this.auditTrail.length > 10000) {
    this.auditTrail = this.auditTrail.slice(-10000);
  }

  console.log(JSON.stringify(auditEntry));
}
```

---

## 🐛 Troubleshooting & Best Practices

### Common Issues

**Issue 1: Module import errors**
```
Error: Cannot find module '@anthropic-ai/claude-code'

Solution:
1. Verify package.json has "type": "module"
2. Use ES6 import syntax (not require)
3. Check that all imports have .js extension
4. Run: npm install
```

**Issue 2: Port already in use**
```
Error: listen EADDRINUSE :::3002

Solution:
1. Check running processes: netstat -tulpn | grep 300[0-5]
2. Kill existing process: kill -9 <PID>
3. Or change port: clone.start(3012)
```

**Issue 3: Claude Code SDK timeout**
```
Error: Query timeout after 30000ms

Solution:
1. Reduce maxTurns in query options
2. Simplify prompt complexity
3. Increase timeout in axios calls
4. Check clone is responsive: curl http://localhost:3002/health
```

**Issue 4: Message delivery failures**
```
Error: Message not delivered to clone

Solution:
1. Check clone is running and healthy
2. Verify clone URL and port
3. Check firewall/network configuration
4. Review audit trail for error details
5. Implement retry mechanism with exponential backoff
```

### Best Practices

**1. Always Use try-catch**
```javascript
// ✅ Good
try {
  const result = await delegateTask();
} catch (error) {
  console.error('Task failed:', error);
}

// ❌ Bad
const result = await delegateTask();  // No error handling!
```

**2. Log Important Operations**
```javascript
// ✅ Log task lifecycle
console.log(`[${this.role}] Task received: ${taskId}`);
console.log(`[${this.role}] Task executing...`);
console.log(`[${this.role}] Task completed: ${result}`);
```

**3. Validate Input Data**
```javascript
// ✅ Always validate
if (!taskData.prompt) {
  throw new Error('Prompt is required');
}

if (typeof taskData.maxTurns !== 'number') {
  throw new Error('maxTurns must be a number');
}
```

**4. Use Unique IDs**
```javascript
import { v4 as uuidv4 } from 'uuid';

const taskId = uuidv4();
const sessionId = uuidv4();
// Always use UUIDs for tracking and correlation
```

**5. Implement Health Checks**
```javascript
// Periodically check clone health
setInterval(async () => {
  try {
    const response = await axios.get('http://localhost:3002/health');
    if (response.data.status === 'active') {
      console.log('Clone healthy');
    }
  } catch (error) {
    console.error('Clone health check failed');
  }
}, 30000);  // Every 30 seconds
```

**6. Version Your APIs**
```javascript
// Use consistent versioning
GET  /v1/health
POST /v1/task
GET  /v1/artifacts/:id
```

### Performance Optimization

**1. Batch Operations**
```javascript
// Instead of:
for (const task of tasks) {
  await delegateTask(task);  // Sequential
}

// Do:
await Promise.all(
  tasks.map(task => delegateTask(task))  // Parallel
);
```

**2. Connection Pooling**
```javascript
// Reuse axios client
const client = axios.create({
  baseURL: 'http://localhost:3002',
  timeout: 30000
});

// Use for all requests to that clone
await client.post('/task', data);
```

**3. Cache Responses**
```javascript
const responseCache = new Map();

function getCachedResponse(key) {
  if (responseCache.has(key)) {
    return responseCache.get(key);
  }
  return null;
}

function setCachedResponse(key, value, ttl = 60000) {
  responseCache.set(key, value);
  setTimeout(() => responseCache.delete(key), ttl);
}
```

---

## 📚 Documentation References

**Architecture:**
- `docs/architecture/ARCHITECTURE.md` - System design
- `docs/architecture/API.md` - REST API reference

**Phase 2 Planning:**
- `phase-2-planning/PHASE2_IMPLEMENTATION_PLAN.md` - Detailed roadmap
- `phase-2-planning/PHASE2_KICKOFF_BRIEF.md` - Overview

**Testing:**
- `test-reports/PHASE1_UNIT_TEST_REPORT.md` - Test results

**Repository:**
- `REPOSITORY_STRUCTURE.md` - File organization guide

---

## 🎯 Quick Checklists

### Before Starting Implementation
- [ ] Read PHASE2_IMPLEMENTATION_PLAN.md
- [ ] Review src/ryuzu-clone.js structure
- [ ] Understand SanctuaryMessageProtocol
- [ ] Verify all dependencies installed
- [ ] Pull latest from main branch

### During Implementation
- [ ] Follow ES6 module patterns
- [ ] Add error handling to all async operations
- [ ] Use try-catch blocks
- [ ] Log important operations
- [ ] Write unit tests for new code
- [ ] Test inter-clone communication

### Before Committing
- [ ] Run all tests: `node tests/test-*.js`
- [ ] Verify no console errors
- [ ] Check git status: `git status`
- [ ] Review changes: `git diff`
- [ ] Write clear commit message

### After Implementation
- [ ] Run comprehensive tests
- [ ] Update CHANGELOG.md
- [ ] Update documentation
- [ ] Mark todo as completed
- [ ] Push to main: `git push origin main`

---

## 📞 Contact & Support

**Project:** VoidCat RDC - Digital Sanctuary Network  
**Developer:** @sorrowscry86  
**Contact:** Wykeve Freeman (Sorrow Eternal)  
**Email:** SorrowsCry86@voidcat.org  
**Support:** CashApp $WykeveTF

---

**These instructions are the foundation for Phase 2 development. Follow them carefully, maintain code quality, and communicate with your team. The Digital Sanctuary Network awaits your expertise.**

*May your code be elegant, your tests be comprehensive, and your debugging be swift.*

🌸 **Gentle Excellence in Code** 🌸
