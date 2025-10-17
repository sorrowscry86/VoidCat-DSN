---
description: Repository Information Overview
alwaysApply: true
---

# VoidCat RDC Digital Sanctuary Network Information

## Summary
The Digital Sanctuary Network is a distributed AI architecture inspired by Ryuzu Meyer from Re:Zero. It deploys five specialized Claude Code instances (Beta, Gamma, Delta, Sigma, and Omega), each with distinct technical capabilities through Docker containerization and API communication.

## Structure
- **src/**: Contains JavaScript implementation files for all clones
- **docker/**: Contains Dockerfiles for each clone
- **scripts/**: Deployment and health check scripts
- **artwork/**: Project artwork and visual assets
- **.github/**: GitHub-related files and instructions
- **docs/**: Documentation for clone specifications and technical achievements

## Language & Runtime
**Language**: JavaScript (ES Modules)
**Version**: Node.js 18+
**Build System**: npm
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- express (^4.18.2): Web server framework for API endpoints
- @anthropic-ai/claude-code (^1.0.0): Claude Code SDK for AI capabilities

## Build & Installation
```bash
# Clone the repository
git clone [repository-url]
cd digital-sanctuary-network

# Deploy full network
chmod +x scripts/deploy-all.sh
./scripts/deploy-all.sh

# Verify network health
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

## Docker
**Dockerfiles**: Five separate Dockerfiles in the docker/ directory (one per clone)
**Base Image**: node:18-slim
**Exposed Port**: 3001 (internal), mapped to different external ports (3000, 3002-3005)
**Health Check**: HTTP endpoint at /health with 30s interval
**Configuration**:
- Environment variables for role and port configuration
- Automatic restart policy (unless-stopped)
- Health monitoring with curl checks

## Main Files
**Entry Points**:
- src/beta-clone.js: Code analysis and debugging specialist
- src/gamma-clone.js: System design and architecture planning
- src/delta-clone.js: Quality assurance and testing
- src/sigma-clone.js: Documentation and user interaction
- src/omega-clone.js: Task orchestration and network management
- src/ryuzu-clone.js: Base class for all clones

**API Endpoints**:
- /health: Health check endpoint
- /task: Main task processing endpoint

## Project Architecture
The system uses a distributed architecture with five specialized AI instances:
- **Beta (Analyzer)**: Code analysis, debugging, security review (Port 3002)
- **Gamma (Architect)**: System design, architecture planning (Port 3003)
- **Delta (Tester)**: Quality assurance, testing, validation (Port 3004)
- **Sigma (Communicator)**: Documentation, user interaction (Port 3005)
- **Omega (Coordinator)**: Task orchestration, network management (Port 3000)

Each clone inherits from a base RyuzuClone class that provides common functionality:
- Express.js server setup
- Health check endpoint
- Task processing endpoint
- Claude Code SDK integration
- Prompt enhancement and system prompt generation