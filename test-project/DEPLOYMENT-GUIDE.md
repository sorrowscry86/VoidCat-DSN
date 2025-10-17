# 🚀 Digital Sanctuary Network - Production Deployment Guide

## Quick Start for New Projects

### 1. Verify Network Status
```powershell
# Check all clones are running
docker ps | findstr ryuzu

# Test health endpoints
curl http://localhost:3000/health  # Omega
curl http://localhost:3002/health  # Beta
curl http://localhost:3003/health  # Gamma
curl http://localhost:3004/health  # Delta
curl http://localhost:3005/health  # Sigma
```

### 2. Choose Your Project Pattern

#### Small Project (< 1 day)
- Use 1-2 specialized clones + Omega coordination
- Direct task assignment to most relevant clone

#### Medium Project (1-5 days)  
- Use 3-4 clones with Omega orchestration
- Parallel processing with coordination

#### Large Project (1-2 weeks)
- Deploy full 5-clone network
- Sequential and parallel workflows

### 3. Task Assignment Template

```json
{
  "prompt": "Your specific task description",
  "context": "Project context and requirements", 
  "sessionId": "your-project-session-id"
}
```

### 4. Clone Specialization Guide

| Need | Primary Clone | Port | Expertise |
|------|---------------|------|-----------|
| Architecture Design | Gamma | 3003 | System design, tech stack, scalability |
| Security Analysis | Beta | 3002 | Vulnerabilities, performance, debugging |
| Testing Strategy | Delta | 3004 | QA, test plans, validation |
| Documentation | Sigma | 3005 | User guides, API docs, UI/UX |
| Project Coordination | Omega | 3000 | Task delegation, integration |

### 5. API Usage Examples

```powershell
# Send task to Gamma for architecture
$body = @{
  prompt = "Design microservices architecture for e-commerce platform"
  context = "High-traffic retail with real-time inventory"
  sessionId = "project-arch-001"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3003/task" -Method POST -Body $body -ContentType "application/json"
```

## 🎯 **Ready for Production!** 

Your Digital Sanctuary Network is fully operational and ready to enhance any development project with distributed AI coordination.
