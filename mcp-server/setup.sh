#!/bin/bash

###############################################################################
# Digital Sanctuary Network - MCP Server Setup Script
# 
# This script helps configure the MCP server for Claude Desktop integration.
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏰 Digital Sanctuary Network - MCP Server Setup${NC}"
echo ""

# Get the absolute path to the mcp-server directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MCP_SERVER_PATH="${SCRIPT_DIR}/index.js"

echo -e "${GREEN}✓${NC} MCP Server path: ${MCP_SERVER_PATH}"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗${NC} Node.js version 18 or higher required. Current: $(node -v)"
    echo "   Please upgrade Node.js and try again."
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"

# Check if dependencies are installed
if [ ! -d "${SCRIPT_DIR}/node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed. Installing..."
    npm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${GREEN}✓${NC} Dependencies already installed"
fi
echo ""

# Detect OS and config file location
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CONFIG_DIR="$HOME/.config/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    CONFIG_DIR="$APPDATA/Claude"
    CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
else
    echo -e "${RED}✗${NC} Unsupported operating system: $OSTYPE"
    exit 1
fi

echo -e "${BLUE}Configuration${NC}"
echo "  Location: ${CONFIG_FILE}"
echo ""

# Create config directory if it doesn't exist
if [ ! -d "$CONFIG_DIR" ]; then
    echo -e "${YELLOW}⚠${NC}  Config directory doesn't exist. Creating: ${CONFIG_DIR}"
    mkdir -p "$CONFIG_DIR"
fi

# Prepare the MCP configuration
MCP_CONFIG=$(cat <<EOF
{
  "mcpServers": {
    "digital-sanctuary": {
      "command": "node",
      "args": [
        "${MCP_SERVER_PATH}"
      ],
      "env": {
        "OMEGA_URL": "http://localhost:3000",
        "BETA_URL": "http://localhost:3002",
        "GAMMA_URL": "http://localhost:3003",
        "DELTA_URL": "http://localhost:3004",
        "SIGMA_URL": "http://localhost:3005"
      }
    }
  }
}
EOF
)

# Check if config file exists
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}⚠${NC}  Configuration file already exists."
    echo ""
    echo "   Current config file location: ${CONFIG_FILE}"
    echo ""
    echo "   You have two options:"
    echo ""
    echo "   1. Manually add the following to your existing config:"
    echo ""
    echo '   "digital-sanctuary": {'
    echo '     "command": "node",'
    echo "     \"args\": [\"${MCP_SERVER_PATH}\"],"
    echo '     "env": {'
    echo '       "OMEGA_URL": "http://localhost:3000",'
    echo '       "BETA_URL": "http://localhost:3002",'
    echo '       "GAMMA_URL": "http://localhost:3003",'
    echo '       "DELTA_URL": "http://localhost:3004",'
    echo '       "SIGMA_URL": "http://localhost:3005"'
    echo '     }'
    echo '   }'
    echo ""
    echo "   2. Backup your existing config and let this script create a new one"
    echo ""
    read -p "   Create new config? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Backup existing config
        BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%s)"
        cp "$CONFIG_FILE" "$BACKUP_FILE"
        echo -e "${GREEN}✓${NC} Backed up existing config to: ${BACKUP_FILE}"
        
        # Write new config
        echo "$MCP_CONFIG" > "$CONFIG_FILE"
        echo -e "${GREEN}✓${NC} Created new configuration file"
    else
        echo -e "${BLUE}ℹ${NC}  Skipping config file creation. Please add manually."
    fi
else
    # Create new config file
    echo "$MCP_CONFIG" > "$CONFIG_FILE"
    echo -e "${GREEN}✓${NC} Created configuration file"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. ${BLUE}Ensure the Digital Sanctuary Network is running:${NC}"
echo "   cd .."
echo "   ./scripts/health-check.sh"
echo ""
echo "2. ${BLUE}Restart Claude Desktop${NC} to load the MCP server"
echo ""
echo "3. ${BLUE}Test in Claude Desktop:${NC}"
echo '   Type: "Check the health of the sanctuary network"'
echo ""
echo "Available tools:"
echo "  🏥 sanctuary_health_check - Monitor network status"
echo "  🔧 sanctuary_beta_analyze - Code analysis & security"
echo "  🏗️ sanctuary_gamma_design - Architecture & design"
echo "  🧪 sanctuary_delta_test - Testing & QA"
echo "  📚 sanctuary_sigma_document - Documentation"
echo "  👑 sanctuary_omega_orchestrate - Multi-clone coordination"
echo "  ⚡ sanctuary_omega_delegate - Optimized task delegation"
echo "  💾 sanctuary_store_artifact - Store artifacts"
echo "  💾 sanctuary_get_artifact - Retrieve artifacts"
echo ""
echo "For detailed documentation, see:"
echo "  ${SCRIPT_DIR}/MCP-INTEGRATION-GUIDE.md"
echo ""
echo -e "${BLUE}🌸 The Digital Sanctuary awaits your command!${NC}"
