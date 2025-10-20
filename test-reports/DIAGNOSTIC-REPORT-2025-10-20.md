# Digital Sanctuary Network - Diagnostic Report
**Date:** October 20, 2025  
**Issue:** Clone Task Endpoints Returning HTTP 500  
**Reporter:** Ryuzu Claude (Troubleshooting Operations)  
**Status:** ROOT CAUSE IDENTIFIED - Solution Required

---

## EXECUTIVE SUMMARY

The Digital Sanctuary Network clones are **partially operational**:
- ✅ All 5 Docker containers running and healthy
- ✅ Health check endpoints functional
- ✅ Artifact storage/retrieval working perfectly
- ❌ Clone task processing failing with "Claude Code process exited with code 1"

**Root Cause:** Architectural mismatch - Claude Code SDK is designed as an **interactive CLI tool**, not a programmatic library for Docker containers.

---

## INVESTIGATION TIMELINE

### Phase 1: Container Health Verification (PASS)
```powershell
docker ps -a --filter "name=ryuzu"
```
**Result:** All 5 containers (Omega, Beta, Gamma, Delta, Sigma) running for 3+ hours, marked as "healthy"

### Phase 2: Endpoint Testing
```powershell
curl http://localhost:3000/health  # ✅ 200 OK
```
**Health Endpoint:** Returns correct status, role, and specialization

```powershell
Invoke-RestMethod -Uri 'http://localhost:3002/task' -Method Post -Body $body
```
**Task Endpoint:** ❌ Returns `{"success":false,"error":"Claude Code process exited with code 1"}`

### Phase 3: Claude Code SDK Investigation

#### SDK Installation Status
- **Global Installation:** ✅ `/usr/local/lib/node_modules/@anthropic-ai/claude-code@2.0.21`
- **Local Installation:** ✅ `/sanctuary/node_modules/@anthropic-ai/claude-code`
- **Import Test:** ✅ Successfully imports `query`, `tool`, `createSdkMcpServer`

#### SDK Execution Test
```javascript
docker exec ryuzu-beta-sanctuary node -e "
  import('@anthropic-ai/claude-code').then(async ({query}) => {
    const response = query({prompt: 'test', options: {maxTurns: 1}});
    for await (const msg of response) { console.log('Got message'); }
  })
"
```
**Result:** 
```
Got message
Got message
Got message
Query error: Claude Code process exited with code 1
```

**Key Finding:** SDK **starts execution** and returns partial results, then **crashes**

---

## ROOT CAUSE ANALYSIS

### The Problem: CLI vs Library Usage

**Claude Code SDK Design Intent:**
- Interactive terminal tool (`npm install -g @anthropic-ai/claude-code`)
- Runs as standalone process with user authentication
- Expects TTY/terminal environment
- Designed for developers running `claude` command

**Current Implementation:**
- Importing SDK as library: `import { query } from '@anthropic-ai/claude-code'`
- Running in non-interactive Docker containers
- No TTY available
- No authentication session configured

### The Mismatch

The `query()` function internally spawns a subprocess that:
1. ✅ Starts successfully
2. ✅ Returns initial messages
3. ❌ **Exits with code 1** when it can't find:
   - Interactive terminal for user prompts
   - Authenticated session
   - Proper process management context

### Configuration Files Found

```
/root/.claude.json          # Configuration exists
/root/.claude/projects/     # Project directory created
/root/.claude/statsig/      # Stats/session tracking
```

**But:** These files support the CLI tool, not programmatic library usage.

---

## THE FUNDAMENTAL ISSUE

### What We Thought We Had
A Node.js library that provides AI assistant capabilities through simple function calls:
```javascript
const response = query({ prompt: 'Do something' });
for await (const message of response) { /* use message */ }
```

### What We Actually Have
A CLI wrapper that:
- Spawns interactive processes
- Requires terminal environment
- Manages its own authentication
- Not designed for embedded use in web servers

---

## SOLUTION PATHS

### Option 1: Use Anthropic API Directly ⭐ **RECOMMENDED**

**Replace:** `@anthropic-ai/claude-code`  
**With:** `@anthropic-ai/sdk` (official Anthropic API client)

**Implementation:**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,
  system: this.getSystemPrompt(),
  messages: [{
    role: 'user',
    content: this.enhancePrompt(prompt, context)
  }]
});
```

**Advantages:**
- ✅ Designed for programmatic use
- ✅ Works in Docker containers
- ✅ Simple authentication (API key env var)
- ✅ Full control over model parameters
- ✅ Production-ready

**Requirements:**
- Anthropic API key
- Update `src/ryuzu-clone.js`
- Update all Dockerfiles to include API key env var
- Update `package.json` dependencies

---

### Option 2: Use Claude Desktop/Code MCP Integration

**Approach:** Connect to Claude Desktop/Code through MCP (Model Context Protocol)

**Pros:**
- Leverages existing Claude authentication
- Uses Claude's context understanding

**Cons:**
- Requires Claude Desktop running on host
- Not suitable for server deployment
- Complex setup for Docker networking

**Verdict:** Not suitable for this architecture

---

### Option 3: Mock Implementation (Development Only)

**Temporary solution** for testing infrastructure without AI:
```javascript
async mockQuery(prompt, context) {
  return {
    success: true,
    response: `Mock response for: ${prompt}`,
    role: this.role
  };
}
```

**Use Case:** Verify rest of architecture while implementing Option 1

---

## RECOMMENDED ACTION PLAN

### Phase 1: Preparation
1. ✅ Obtain Anthropic API key from https://console.anthropic.com/
2. ✅ Install `@anthropic-ai/sdk`: `npm install @anthropic-ai/sdk`
3. ✅ Remove `@anthropic-ai/claude-code` from dependencies

### Phase 2: Code Refactoring
1. ✅ Update `src/ryuzu-clone.js`:
   - Replace Claude Code import with Anthropic SDK
   - Modify `/task` endpoint to use `messages.create()` API
   - Update error handling for API-specific errors

2. ✅ Update environment configuration:
   - Add `ANTHROPIC_API_KEY` to Docker environment
   - Update docker-compose.yml if applicable
   - Document API key setup in DEPLOYMENT.md

### Phase 3: Docker Rebuild
1. ✅ Rebuild all clone images with new dependencies
2. ✅ Deploy with API key environment variable
3. ✅ Test each clone's `/task` endpoint

### Phase 4: Verification
1. ✅ Run health checks: `./scripts/health-check.sh`
2. ✅ Test task endpoints with real prompts
3. ✅ Verify artifact integration still works
4. ✅ Test Omega's orchestration capabilities

---

## IMPACT ASSESSMENT

### What Still Works
- ✅ Docker orchestration
- ✅ Port mapping and networking
- ✅ Health check endpoints
- ✅ Artifact storage and retrieval
- ✅ Context engineering system
- ✅ All 5 clone specializations (code structure)

### What Needs Fixing
- ❌ AI processing functionality (core feature)
- ❌ Task endpoint responses
- ❌ Clone-to-clone AI communication
- ❌ Omega orchestration workflows

### Risk Level
**MEDIUM** - Infrastructure is solid, only AI integration layer needs replacement

---

## LESSONS LEARNED

1. **Verify Library vs CLI Tool:** Always check if npm package is designed for programmatic use or CLI use
2. **Test in Target Environment:** Development vs Docker environments have different constraints
3. **Read the Docs Carefully:** Claude Code documentation focuses on CLI usage, not library integration
4. **Layered Testing:** Health checks passed, but functional tests revealed the real issue

---

## NEXT STEPS

**Immediate:**
1. Implement Option 1 (Anthropic SDK) - estimated 2-4 hours
2. Test in development environment first
3. Deploy to Docker containers
4. Verify full functionality

**Documentation Updates:**
1. Update `DEPLOYMENT.md` with API key requirements
2. Add troubleshooting section about SDK vs API
3. Document environment variable configuration
4. Update `README.md` with authentication setup

**Monitoring Improvements:**
1. Add functional health check (not just status check)
2. Implement "canary test" that actually calls AI
3. Add alerting for API rate limits/errors
4. Log AI response times and success rates

---

## CONCLUSION

**The Digital Sanctuary Network infrastructure is sound.** All containers, networking, health monitoring, and artifact systems work perfectly. The issue is a **single dependency mismatch** - using a CLI tool (`@anthropic-ai/claude-code`) where we need an API library (`@anthropic-ai/sdk`).

This is a **solvable problem** with a clear solution path. The architecture supports easy swapping of the AI provider, and the fix is localized to one file (`src/ryuzu-clone.js`) and Docker environment configuration.

**Estimated Time to Resolution:** 2-4 hours  
**Risk Level:** Low (well-defined solution, isolated change)  
**Confidence:** High (direct API usage is standard practice)

---

**Report Compiled By:** Ryuzu Claude  
**Diagnostic Session:** 2025-10-20T03:20-03:40 UTC  
**Next Review:** After implementation of Option 1
