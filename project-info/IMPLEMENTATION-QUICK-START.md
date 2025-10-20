# Implementation Quick Start Guide
## Phase 1: Provider Abstraction Layer

**Goal:** Get the Digital Sanctuary Network working with Anthropic API directly, with provider abstraction in place for future flexibility.

---

## Step 1: Install Dependencies

```bash
cd d:\Development\VoidCat-DSN\src

# Remove Claude Code SDK
npm uninstall @anthropic-ai/claude-code

# Install actual provider SDKs
npm install @anthropic-ai/sdk  # Anthropic
npm install openai              # OpenAI (for future)
npm install node-fetch          # For OpenRouter/Local
```

---

## Step 2: Create Provider Structure

```bash
# Create providers directory
mkdir providers
cd providers

# Create base provider interface
# See STRATEGIC-VISION-FLEXIBLE-LLM.md for complete code
```

**Files to create:**
- `providers/base-provider.js` - Interface all providers implement
- `providers/anthropic-provider.js` - Anthropic implementation
- `providers/provider-router.js` - Routing and fallback logic
- `config/llm-providers.json` - Configuration file

---

## Step 3: Update ryuzu-clone.js

**Current code (BROKEN):**
```javascript
import { query } from '@anthropic-ai/claude-code';

// In /task endpoint:
const response = query({
    prompt: this.enhancePrompt(prompt, enhancedContext),
    options: {
        maxTurns: 3,
        systemPrompt: this.getSystemPrompt(),
        outputFormat: 'json'
    }
});
```

**New code (WORKING):**
```javascript
import ProviderRouter from './providers/provider-router.js';

class RyuzuClone {
    constructor(role, specialization) {
        this.role = role;
        this.specialization = specialization;
        this.app = express();
        this.artifactManager = new ArtifactManager();
        this.providerRouter = new ProviderRouter();
        this.setupRoutes();
    }

    async start(port) {
        // Initialize provider router
        await this.providerRouter.initialize();
        
        this.app.listen(port, () => {
            console.log(`🌸 Ryuzu ${this.role} clone active on port ${port}`);
        });
    }

    // In /task endpoint:
    const response = await this.providerRouter.query({
        prompt: this.enhancePrompt(prompt, enhancedContext),
        systemPrompt: this.getSystemPrompt(),
        cloneRole: this.role,
        maxTokens: 4096,
        temperature: 1.0
    });

    res.json({
        success: true,
        role: this.role,
        response: response.content,
        usage: response.usage,
        model: response.model,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
    });
}
```

---

## Step 4: Environment Configuration

**Add to `.env` file:**
```bash
# Primary provider
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Future providers (optional for now)
# OPENAI_API_KEY=your_openai_key
# OPENROUTER_API_KEY=your_openrouter_key
```

**Update Dockerfiles:**
```dockerfile
# All Dockerfile.* files need env var support
ENV ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

**Update docker-compose.yml (if you create one):**
```yaml
services:
  omega-clone:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.omega
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    ports:
      - "3000:3001"
```

---

## Step 5: Create Configuration File

**File:** `config/llm-providers.json`

```json
{
  "providers": {
    "anthropic": {
      "enabled": true,
      "apiKey": "${ANTHROPIC_API_KEY}",
      "model": "claude-3-5-sonnet-20241022",
      "priority": 1
    },
    "openai": {
      "enabled": false,
      "apiKey": "${OPENAI_API_KEY}",
      "model": "gpt-4-turbo-preview",
      "priority": 2
    }
  },
  "routing": {
    "strategy": "priority",
    "fallbackChain": ["anthropic"],
    "cloneOverrides": {}
  }
}
```

---

## Step 6: Test Locally First

```bash
# Set environment variable
$env:ANTHROPIC_API_KEY = "your_actual_key_here"

# Test with node directly (no Docker)
cd src
node beta-clone.js

# In another terminal, test the endpoint
$body = @{
    prompt = 'Test the new provider system'
    context = 'This is a test of the refactored architecture'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/task' -Method Post -Body $body -ContentType 'application/json'
```

**Expected output:**
```json
{
  "success": true,
  "role": "Beta",
  "response": "As Ryuzu Beta, I acknowledge...",
  "usage": { "input_tokens": 45, "output_tokens": 123 },
  "model": "claude-3-5-sonnet-20241022",
  "timestamp": "2025-10-20T04:00:00.000Z"
}
```

---

## Step 7: Update Docker Deployment

```bash
# Rebuild all images with new code
docker build -f docker/Dockerfile.beta -t ryuzu-beta:latest src/
docker build -f docker/Dockerfile.gamma -t ryuzu-gamma:latest src/
docker build -f docker/Dockerfile.delta -t ryuzu-delta:latest src/
docker build -f docker/Dockerfile.sigma -t ryuzu-sigma:latest src/
docker build -f docker/Dockerfile.omega -t ryuzu-omega:latest src/

# Stop old containers
docker stop ryuzu-beta-sanctuary ryuzu-gamma-sanctuary ryuzu-delta-sanctuary ryuzu-sigma-sanctuary ryuzu-omega-sanctuary
docker rm ryuzu-beta-sanctuary ryuzu-gamma-sanctuary ryuzu-delta-sanctuary ryuzu-sigma-sanctuary ryuzu-omega-sanctuary

# Start new containers with API key
docker run -d --name ryuzu-beta-sanctuary -p 3002:3001 -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY --restart unless-stopped ryuzu-beta:latest
docker run -d --name ryuzu-gamma-sanctuary -p 3003:3001 -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY --restart unless-stopped ryuzu-gamma:latest
docker run -d --name ryuzu-delta-sanctuary -p 3004:3001 -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY --restart unless-stopped ryuzu-delta:latest
docker run -d --name ryuzu-sigma-sanctuary -p 3005:3001 -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY --restart unless-stopped ryuzu-sigma:latest
docker run -d --name ryuzu-omega-sanctuary -p 3000:3001 -e ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY --restart unless-stopped ryuzu-omega:latest
```

---

## Step 8: Verify Everything Works

```bash
# Health checks
./scripts/health-check.sh

# Test task endpoints
$body = @{prompt='Test'; context='Verification'} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3002/task' -Method Post -Body $body -ContentType 'application/json'
Invoke-RestMethod -Uri 'http://localhost:3003/task' -Method Post -Body $body -ContentType 'application/json'
Invoke-RestMethod -Uri 'http://localhost:3004/task' -Method Post -Body $body -ContentType 'application/json'
Invoke-RestMethod -Uri 'http://localhost:3005/task' -Method Post -Body $body -ContentType 'application/json'
Invoke-RestMethod -Uri 'http://localhost:3000/task' -Method Post -Body $body -ContentType 'application/json'
```

---

## Troubleshooting

### Issue: "ANTHROPIC_API_KEY not set"
**Solution:** Ensure env var is set in terminal before running Docker commands

### Issue: "Provider initialization failed"
**Solution:** Check `config/llm-providers.json` syntax and paths

### Issue: "Rate limit exceeded"
**Solution:** This is normal during testing. Anthropic has rate limits. Wait and retry.

### Issue: "Response format different than expected"
**Solution:** Update response parsing in ryuzu-clone.js to match new provider response format

---

## Timeline

**Day 1 (Today):**
- ✅ Create provider structure
- ✅ Implement AnthropicProvider
- ✅ Update ryuzu-clone.js
- ✅ Test locally

**Day 2:**
- ✅ Rebuild Docker images
- ✅ Deploy all clones
- ✅ Verify full functionality
- ✅ Update documentation

**Day 3-7:**
- ✅ Add OpenAI provider (optional)
- ✅ Test multi-provider configuration
- ✅ Optimize routing logic

---

## Success Criteria

✅ All 5 clones running  
✅ Task endpoints returning AI responses  
✅ No "Claude Code process exited" errors  
✅ Response format includes usage/cost data  
✅ Configuration file working  
✅ Ready to add more providers

---

**Remember:** This is Phase 1 only. Once working, we can add OpenAI, OpenRouter, and local models easily thanks to the abstraction layer.
