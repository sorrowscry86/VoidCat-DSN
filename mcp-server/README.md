# Digital Sanctuary Network - MCP Server

Model Context Protocol server for seamless integration with Claude Desktop and Claude Code.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Claude Desktop**:
   
   Add to your `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "digital-sanctuary": {
         "command": "node",
         "args": ["/absolute/path/to/VoidCat-DSN/mcp-server/index.js"]
       }
     }
   }
   ```

3. **Ensure clone network is running**:
   ```bash
   cd ..
   ./scripts/health-check.sh
   ```

4. **Restart Claude Desktop**

## Available Tools

- `sanctuary_health_check` - Monitor network status
- `sanctuary_beta_analyze` - Code analysis & security
- `sanctuary_gamma_design` - Architecture & design
- `sanctuary_delta_test` - Testing & QA
- `sanctuary_sigma_document` - Documentation
- `sanctuary_omega_orchestrate` - Multi-clone coordination
- `sanctuary_omega_delegate` - Optimized task delegation
- `sanctuary_store_artifact` - Store work products
- `sanctuary_get_artifact` - Retrieve artifacts

## Documentation

See [MCP-INTEGRATION-GUIDE.md](MCP-INTEGRATION-GUIDE.md) for complete documentation.

## Requirements

- Node.js 18+
- Running Digital Sanctuary Network (all clones operational)
- Claude Desktop or Claude Code with MCP support

---

**VoidCat RDC Digital Sanctuary Network** 🌸
