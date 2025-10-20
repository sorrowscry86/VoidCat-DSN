# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VoidCat RDC Digital Sanctuary Network** is a distributed AI architecture system featuring five specialized Claude Code instances (Omega, Beta, Gamma, Delta, Sigma) running in Docker containers and communicating via HTTP REST APIs. Each clone maintains a "gentle, dutiful" personality while providing distinct technical capabilities. The system integrates with Claude Desktop through the Model Context Protocol (MCP), exposing clone capabilities as 9 standardized tools.

**Status**: Phase 3 Complete (87% done) - Production ready with all 5 clones deployed and operational.

---

## Architecture Overview

### High-Level System Design

The codebase follows a **distributed microservices pattern** with these key components:

1. **Clone Network** (5 specialized Node.js servers)
   - Each clone extends `RyuzuClone` base class (src/ryuzu-clone.js)
   - Runs in isolated Docker container with health monitoring
   - Exposes HTTP REST API on dedicated ports (3000-3005)
   - Implements unique system prompt for specialization

2. **Artifact-Centric Workflow** (Directive 2025.10.08-A1)
   - Centralized version control for work products
   - SHA-256 checksums for integrity verification
   - Lightweight manifests for efficient inter-clone communication
   - Stored in `/tmp/sanctuary-workspace` with UUID-based organization

3. **Context Engineering** (Omega specialty)
   - Optimized context packages with quality metrics
   - Signal-to-noise ratio maximization
   - Quality scoring across three dimensions: objective clarity, data relevance, artifact utilization

4. **MCP Integration** (mcp-server/)
   - Bridges Claude Desktop/Code with clone network
   - Exposes 9 standardized tools via Model Context Protocol
   - Automatic context engineering support

### Port Allocation

| Port | Clone | Role | Purpose |
|------|-------|------|---------|
| 3000 | Omega | Coordinator | Task orchestration, network management, context engineering |
| 3002 | Beta | Analyzer | Code analysis, security review, debugging |
| 3003 | Gamma | Architect | System design, architecture planning, scalability |
| 3004 | Delta | Tester | Quality assurance, testing strategies, validation |
| 3005 | Sigma | Communicator | Documentation, user interaction, training materials |

### Key File Structure

```
src/
├── ryuzu-clone.js              # Base class for all clones - Express server with artifact/context
├── beta-clone.js               # Code analyzer specialization
├── gamma-clone.js              # System architect specialization
├── delta-clone.js              # QA tester specialization
├── sigma-clone.js              # Documentarian specialization
├── omega-clone.js              # Coordinator (context engineering, dashboard, orchestration)
├── artifact-manager.js         # Centralized artifact storage with manifests & checksums
├── context-engineer.js         # Context optimization with quality metrics
├── package.json                # Dependencies (Express, Claude Code SDK, Autogen)
├── dashboard.html              # Real-time network health monitoring UI
└── tests/                       # Test suite (if present)

mcp-server/
├── index.js                    # MCP Protocol server (9 tools, ~500 lines)
├── package.json                # MCP dependencies
├── setup.sh                    # Setup automation
└── validate-setup.sh           # Integration validation

docker/
├── Dockerfile.beta             # Container template for Beta clone
├── Dockerfile.gamma            # Container template for Gamma clone
├── Dockerfile.delta            # Container template for Delta clone
├── Dockerfile.sigma            # Container template for Sigma clone
└── Dockerfile.omega            # Container template for Omega clone

scripts/
├── deploy-all.sh               # Deploy all 5 clones with Docker
└── health-check.sh             # Monitor network health status
```

---

## Development Commands

### Clone Network Deployment

```bash
# Full network deployment (all 5 clones)
chmod +x scripts/deploy-all.sh
./scripts/deploy-all.sh

# Individual clone deployment
cd docker
docker build -f Dockerfile.gamma -t ryuzu-gamma:latest ../src/
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest
```

### Network Health & Monitoring

```bash
# Check all clones health status
chmod +x scripts/health-check.sh
./scripts/health-check.sh

# Check individual clone
curl http://localhost:3003/health

# View container logs
docker logs ryuzu-gamma-sanctuary --tail 20

# List all running clones
docker ps --filter "name=ryuzu-"

# Restart a clone
docker restart ryuzu-gamma-sanctuary
```

### MCP Server Setup

```bash
# Install MCP dependencies
cd mcp-server
npm install

# Validate MCP integration
./validate-setup.sh

# Test integration with clone network
./test-integration.sh

# Configure Claude Desktop config
# Windows: %APPDATA%\Claude\claude_desktop_config.json
# macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
# Linux: ~/.config/Claude/claude_desktop_config.json
```

### Direct Clone Interaction

```bash
# Test a clone's task endpoint
curl -X POST http://localhost:3003/task \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Design a scalable API", "context": "E-commerce platform", "sessionId": "test-001"}'

# Store an artifact
curl -X POST http://localhost:3002/artifacts \
  -H "Content-Type: application/json" \
  -d '{"type": "code", "content": "...", "metadata": {"description": "..."}}'

# Retrieve artifact
curl http://localhost:3002/artifacts/{artifactId}

# Get lightweight manifest only
curl "http://localhost:3002/artifacts/{artifactId}?manifestOnly=true"
```

---

## Critical Technical Constraints

### ES Module Architecture

⚠️ **This codebase is ES Modules only - never use CommonJS**

- Every file uses `import`/`export` syntax (NOT `require()`)
- `package.json` declares `"type": "module"` (required)
- File extensions are `.js` (not `.mjs`)
- This constraint is necessary for Claude Code SDK compatibility

### Clone Implementation Patterns

All clones follow this structure:

```javascript
class RyuzuGamma extends RyuzuClone {
    constructor() {
        super('Gamma', 'System design, architecture planning...');
    }

    getSystemPrompt() {
        // Specialized system prompt for this clone
    }

    enhancePrompt(prompt, context) {
        // Enhance user input with specialization
    }
}
```

### Docker Patterns

- Base image: `node:18-slim` (consistent across all clones)
- Working directory: `/sanctuary`
- Internal port: `:3001` (mapped to external port 300x)
- Health check: Required curl command every 30 seconds with 10s timeout
- Restart policy: `unless-stopped` for automatic recovery

### API Standardization

All clones expose these core endpoints:

```
GET  /health                    # Status check (response: status, role, specialization)
POST /task                      # Process task (request: prompt, context, sessionId)
POST /artifacts                 # Store artifact (request: type, content, metadata)
GET  /artifacts/:id             # Retrieve artifact (query: manifestOnly=true/false)
```

Omega also provides:

```
POST /context/engineer          # Construct optimized context package
POST /orchestrate               # Delegate task with automatic context engineering
GET  /dashboard/health          # Real-time network status (Server-Sent Events)
```

---

## Workflow Patterns

### Common Development Tasks

**Understanding the architecture**: Read src/ryuzu-clone.js first - all clones inherit from this base class

**Adding a new endpoint**: Extend RyuzuClone's setupRoutes() method and override in specialized clone

**Debugging a clone**: Use `docker logs` combined with curl to test endpoints directly

**Testing inter-clone communication**: Use explicit HTTP requests to other clones' `/task` endpoints

**Implementing artifact management**: All clones have ArtifactManager instantiated in constructor

**Context engineering workflows**: Use Omega's `/context/engineer` or `/orchestrate` endpoints

### Multi-Clone Orchestration

Typical workflow for complex projects:

1. **Requirements → Omega** (coordination planning via POST /task)
2. **Design Phase → Gamma** (architecture with Beta support for security analysis)
3. **Implementation** (distributed per clone expertise)
4. **Testing → Delta** (comprehensive test strategy)
5. **Documentation → Sigma** (throughout process)
6. **Delivery → Omega** (consolidates all outputs)

---

## Key Integrations & Dependencies

### Claude Code SDK
- Import: `import { query } from '@anthropic-ai/claude-code'`
- Async streaming: `for await (const message of response)`
- Session management: Supports `sessionId` for conversation continuity
- Error handling: Wrap in try/catch with structured JSON responses

### Express.js
- Framework for HTTP API servers
- All clones use standard Express patterns
- Middleware order: JSON parsing → error handling → route definitions

### Model Context Protocol (MCP)
- 9 standardized tools exposing clone capabilities
- Bridges Claude Desktop/Code with clone network
- See `mcp-server/MCP-INTEGRATION-GUIDE.md` for full reference

### Artifact & Context Management
- `src/artifact-manager.js`: Version control with checksums
- `src/context-engineer.js`: Quality-scored context optimization
- Used by all clones for storing/retrieving work products

### Docker Health Checks
- Interval: 30 seconds (balance between responsiveness and resource usage)
- Timeout: 10 seconds (allows Claude Code processing delays)
- Retries: 3 attempts (prevents false negatives)
- Start period: 5 seconds (grace period for initialization)

---

## Testing & Validation

### Health Check Script

The `scripts/health-check.sh` provides systematic network validation:

```bash
./scripts/health-check.sh
# Expected output: All 5 clones report status "active"
```

### Manual Clone Testing

```bash
# Test individual clone endpoints
for port in 3000 3002 3003 3004 3005; do
  echo "Testing port $port:"
  curl -s http://localhost:$port/health | jq .
done
```

### Artifact Workflow Validation

```bash
# Store artifact
ARTIFACT_ID=$(curl -s -X POST http://localhost:3002/artifacts \
  -H "Content-Type: application/json" \
  -d '{"type":"test","content":"test data"}' | jq -r '.manifest.artifactId')

# Retrieve artifact
curl http://localhost:3002/artifacts/$ARTIFACT_ID

# Verify lightweight manifest
curl "http://localhost:3002/artifacts/$ARTIFACT_ID?manifestOnly=true"
```

### MCP Integration Verification

```bash
# Validate MCP server setup
cd mcp-server
./validate-setup.sh  # Should report 9 tools defined

# Test integration
./test-integration.sh  # Should verify all clones reachable
```

---

## Clone Specializations

### Beta (Analyzer) - Port 3002
Focus: Code analysis, security review, debugging
- Security vulnerability assessment with CVSS scoring
- Code quality metrics and maintainability analysis
- Performance optimization recommendations
- Debugging strategies and systematic approaches

### Gamma (Architect) - Port 3003
Focus: System design, architecture planning
- Comprehensive architectural analysis
- Technology stack recommendations with trade-offs
- Scalability planning and resource allocation
- Implementation roadmaps with milestone breakdown

### Delta (Tester) - Port 3004
Focus: Quality assurance, testing strategies
- Test coverage analysis and strategy planning
- Quality metrics and success criteria definition
- Automation approaches and CI/CD integration
- Risk-based testing prioritization

### Sigma (Communicator) - Port 3005
Focus: Documentation, user interaction
- Clear, user-centric documentation generation
- Technical concepts translated for various audiences
- Knowledge management and information architecture
- Training materials with hands-on examples

### Omega (Coordinator) - Port 3000
Focus: Task orchestration, network management
- Multi-clone task coordination and workflow sequencing
- Strategic planning and resource allocation
- Network health monitoring and optimization
- Synthesis of multi-clone outputs into unified solutions

---

## Common Issues & Resolutions

### Port Conflicts
```bash
# Windows: Check if port in use
netstat -ano | findstr ":3003"

# Linux: Check if port in use
lsof -i :3003

# Solution: Stop conflicting process or use different port
```

### ES Module Errors
- Verify `package.json` has `"type": "module"`
- Never use `require()` - always use `import`
- All files must use `.js` extension with ES6 syntax

### Clone Not Responding
```bash
# Check container status
docker ps --filter "name=ryuzu-gamma-sanctuary"

# View logs for errors
docker logs ryuzu-gamma-sanctuary --tail 50

# Restart container
docker restart ryuzu-gamma-sanctuary
```

### MCP Tools Not Appearing in Claude Desktop
1. Verify config file exists at correct location for OS
2. Restart Claude Desktop completely (not just refresh)
3. Confirm all 5 clones healthy: `./scripts/health-check.sh`
4. Check mcp-server logs for connection errors

### Artifact Checksum Mismatch
- Artifacts are verified using SHA-256 checksums
- If integrity fails, artifact may be corrupted
- Store new version with updated metadata

---

## Codebase Context

### Project Maturity
- **Phase 1** (✅ Complete): Beta clone foundation
- **Phase 2** (✅ Complete): Full network deployment (July 6, 2025)
- **Phase 3** (✅ Complete): Operational refinement with artifact/context engineering (October 8, 2025)
- **Phase 4** (🔄 Planned): Integration expansion and extended capabilities

### Key Architectural Achievements
1. **ES Module Conversion**: Overcame CommonJS compatibility challenges with Claude Code SDK
2. **Docker Containerization**: Standardized deployment across all clones with health monitoring
3. **Artifact Management**: Version-controlled work products with SHA-256 verification
4. **Context Engineering**: Multi-metric quality scoring for optimal inter-clone communication
5. **MCP Integration**: Seamless Claude Desktop/Code access via standardized protocol

### Related Documentation
- **ARCHITECTURE.md**: Complete system design and integration layers
- **API.md**: Full REST API reference with examples
- **DIRECTIVE-2025.10.08-A1.md**: Artifact-centric workflow specification
- **MCP-INTEGRATION-GUIDE.md**: Claude Desktop/Code integration details
- **README.md**: Project overview and quick start guide
- **.github/copilot-instructions.md**: AI coding agent guidelines

---

## Quick Reference: Common Commands

```bash
# Deployment
./scripts/deploy-all.sh                                    # Deploy all clones
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/  # Build single clone
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 --restart unless-stopped ryuzu-gamma:latest  # Run clone

# Monitoring
./scripts/health-check.sh                                  # Check all clones
curl http://localhost:3003/health                          # Check single clone
docker ps --filter "name=ryuzu-"                          # List running clones
docker logs ryuzu-gamma-sanctuary --tail 20                # View logs

# Testing
curl -X POST http://localhost:3003/task \                 # Test task endpoint
  -H "Content-Type: application/json" \
  -d '{"prompt": "test", "sessionId": "test-001"}'

# MCP
cd mcp-server && npm install                              # Setup MCP
./validate-setup.sh                                        # Verify MCP
./test-integration.sh                                      # Test integration

# Docker Management
docker restart ryuzu-gamma-sanctuary                       # Restart clone
docker stop ryuzu-gamma-sanctuary                          # Stop clone
docker rm ryuzu-gamma-sanctuary                            # Remove clone
docker logs ryuzu-gamma-sanctuary --tail 50 -f            # Follow logs
```

---

## When Modifying the Codebase

**Before making changes**: Always understand how clones inherit from RyuzuClone base class.

**When adding features**: Ensure they work across all 5 clone specializations if they're core features.

**For new endpoints**: Add to RyuzuClone base class if universal, or override in specific clones for specialization.

**For dependencies**: Update both `src/package.json` AND `mcp-server/package.json` if applicable.

**For Docker changes**: Update ALL Dockerfile.* files consistently to maintain uniformity.

**For API changes**: Update both the implementation AND `API.md` documentation.

---

## Support & Resources

- **Issues**: Report via GitHub Issues
- **Questions**: Check relevant documentation file first
- **Troubleshooting**: See TROUBLESHOOTING.md for detailed issue resolution
- **Architecture Questions**: Review ARCHITECTURE.md for system design details
- **API Questions**: Consult API.md for endpoint reference
- **Contact**: SorrowsCry86@voidcat.org (Developer: @sorrowscry86)
