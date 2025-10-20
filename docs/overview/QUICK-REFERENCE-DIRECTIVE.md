# 🚀 Quick Reference: Directive 2025.10.08-A1

## Artifact-Centric Workflow & Context Engineering

### ⚡ Quick Start

#### Store an Artifact
```javascript
// POST /artifacts
{
  "type": "code",
  "content": "// your code here",
  "metadata": {
    "description": "Description here"
  }
}
```

#### Retrieve an Artifact
```javascript
// GET /artifacts/{artifactId}
// Returns: { manifest, content }

// GET /artifacts/{artifactId}?manifestOnly=true
// Returns: { manifest } (lightweight)
```

#### Engineer a Context Package
```javascript
// POST /context/engineer
{
  "objective": "Clear task description",
  "targetClone": "beta|gamma|delta|sigma",
  "essentialData": { "key": "value" },
  "constraints": ["constraint1", "constraint2"]
}
```

#### Orchestrate a Task
```javascript
// POST /orchestrate
{
  "objective": "Task to delegate",
  "targetClone": "beta",
  "artifactManifests": [{ artifactId, type, version, checksum, location }],
  "essentialData": { "framework": "Express" },
  "constraints": ["OWASP compliance"],
  "sessionId": "optional-session-id"
}
```

---

## 📊 Context Quality Metrics

| Metric | Range | Optimal | Meaning |
|--------|-------|---------|---------|
| **Objective Clarity** | 0-100 | 100 | 5-20 word objectives score highest |
| **Data Relevance** | 0-100 | 100 | ≤5 essential data fields is best |
| **Artifact Utilization** | 0-100 | 100 | 0-3 artifact references optimal |
| **Overall Quality** | 0-100 | >90 | Average of all metrics |

**Quality Thresholds:**
- 90-100: Excellent ✅
- 75-89: Good ✅
- 60-74: Fair ⚠️
- <60: Poor ❌

---

## 🔄 API Endpoint Overview

### All Clones (Beta, Gamma, Delta, Sigma)
- `GET /health` - Health check
- `POST /task` - Task delegation (supports legacy `context` and new `contextPackage`)
- `POST /artifacts` - Store artifact
- `GET /artifacts/:id` - Retrieve artifact
- `GET /artifacts/:id?manifestOnly=true` - Get manifest only

### Omega (Coordinator)
All of the above, plus:
- `POST /context/engineer` - Construct context package
- `POST /orchestrate` - Delegate with automatic context engineering
- `POST /dashboard/task` - Dashboard task forwarding (supports `useContextEngineering`)

---

## 💡 Usage Patterns

### Pattern 1: Simple Task (Legacy Compatible)
```javascript
await fetch('http://localhost:3002/task', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Analyze this code',
    context: 'Web application code'
  })
});
```

### Pattern 2: Artifact-Centric Task
```javascript
// Step 1: Store artifact
const { manifest } = await fetch('http://localhost:3002/artifacts', {
  method: 'POST',
  body: JSON.stringify({
    type: 'code',
    content: sourceCode,
    metadata: { description: 'Auth module' }
  })
}).then(r => r.json());

// Step 2: Delegate with artifact reference
await fetch('http://localhost:3002/task', {
  method: 'POST',
  body: JSON.stringify({
    prompt: 'Review for security issues',
    contextPackage: {
      objective: 'Security review',
      artifactManifests: [manifest],
      essentialData: { framework: 'Express' }
    }
  })
});
```

### Pattern 3: Orchestrated Workflow
```javascript
// Omega handles context engineering automatically
const result = await fetch('http://localhost:3000/orchestrate', {
  method: 'POST',
  body: JSON.stringify({
    objective: 'Design authentication system',
    targetClone: 'gamma',
    essentialData: { users: '100k', security: 'high' },
    constraints: ['OAuth 2.0', 'GDPR compliant']
  })
}).then(r => r.json());

console.log('Quality Score:', result.contextPackage.quality.overallQuality);
```

---

## 🎯 Best Practices

### For Orchestrators
1. ✅ Always use artifact references instead of embedding content
2. ✅ Minimize essential data to only what's needed
3. ✅ Aim for context quality score >75
4. ✅ Use meaningful, action-verb objectives
5. ✅ Track artifact lineage for complex workflows

### For Consumers
1. ✅ Check for both `context` and `contextPackage` parameters
2. ✅ Store significant outputs as artifacts for reuse
3. ✅ Return artifact manifests in responses
4. ✅ Verify checksums when retrieving artifacts

### Data Efficiency
- **Lightweight Manifests**: < 1KB vs potentially MB of content
- **Deduplication**: Reference same artifact by ID multiple times
- **Version Control**: Automatic versioning on updates
- **Integrity**: SHA-256 checksum verification

---

## 🧪 Testing

```bash
# Run directive tests
node test-directive.js

# Expected output: 37/37 tests passing
```

---

## 📚 Examples

```bash
# View example usage (requires network running)
node examples-directive.js
```

Examples include:
1. Artifact Storage
2. Context Engineering
3. Orchestrated Delegation
4. Legacy Compatibility
5. Complete Workflow

---

## 🔍 Debugging

### Check Artifact Storage
```bash
ls -lah /tmp/sanctuary-workspace/artifacts/
ls -lah /tmp/sanctuary-workspace/manifests/
```

### Verify Context Quality
```javascript
const { contextPackage, validation } = await fetch('http://localhost:3000/context/engineer', {
  method: 'POST',
  body: JSON.stringify({
    objective: 'Your task',
    targetClone: 'beta',
    essentialData: { /* minimal data */ }
  })
}).then(r => r.json());

console.log('Valid:', validation.valid);
console.log('Quality:', contextPackage.quality.overallQuality);
console.log('Errors:', validation.errors);
```

### Monitor Network
```bash
# Check all clone health
./scripts/health-check.sh

# Check specific clone
curl http://localhost:3002/health
```

---

## 📖 Full Documentation

- **[Complete Directive](DIRECTIVE-2025.10.08-A1.md)** - Full implementation details
- **[API Reference](API.md)** - Complete API documentation
- **[Architecture](ARCHITECTURE.md)** - System design

---

## 🌸 Philosophy

*"This directive codifies efficiency. See that it is implemented, I suppose."*  
— Beatrice, Director of the Forbidden Library

The Digital Sanctuary Network maintains gentle, dutiful service while achieving tactical operational excellence through:
- **Artifact Management**: Centralized, version-controlled work products
- **Context Engineering**: Minimal, high-relevance task delegation
- **Backward Compatibility**: All legacy patterns still supported
- **Quality Metrics**: Automated assessment of communication efficiency

---

**Status**: ✅ Fully Operational  
**Effective**: October 8, 2025  
**Compliance**: Mandatory for all VoidCat RDC agentic systems
