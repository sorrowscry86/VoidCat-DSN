#!/bin/bash

###############################################################################
# Digital Sanctuary Network - MCP Server Validation Script
# 
# Validates that the MCP server is properly configured and ready to use
###############################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Validating MCP Server Setup...${NC}"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

ISSUES_FOUND=0

# Check Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✅ $NODE_VERSION${NC}"
    else
        echo -e "${RED}❌ $NODE_VERSION (need v18+)${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${RED}❌ Not found${NC}"
    echo "   Install Node.js 18+ from https://nodejs.org/"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    echo -e "${GREEN}✅ $(npm --version)${NC}"
else
    echo -e "${YELLOW}⚠ Not found${NC}"
fi

# Check dependencies
echo -n "Dependencies: "
if [ -d "node_modules" ] && [ -d "node_modules/@modelcontextprotocol" ]; then
    echo -e "${GREEN}✅ Installed${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
    echo "   Run: npm install"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check index.js
echo -n "index.js: "
if [ -f "index.js" ]; then
    if [ -x "index.js" ]; then
        echo -e "${GREEN}✅ Exists and executable${NC}"
    else
        echo -e "${YELLOW}⚠ Exists but not executable${NC}"
        echo "   Run: chmod +x index.js"
    fi
else
    echo -e "${RED}❌ Not found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check package.json
echo -n "package.json: "
if [ -f "package.json" ]; then
    if grep -q '"type": "module"' package.json; then
        echo -e "${GREEN}✅ Valid (ES modules)${NC}"
    else
        echo -e "${YELLOW}⚠ Missing 'type: module'${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo -e "${RED}❌ Not found${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo -e "${BLUE}Clone Network Status:${NC}"

# Check clone network
CLONES=(
  "Omega:3000"
  "Beta:3002"
  "Gamma:3003"
  "Delta:3004"
  "Sigma:3005"
)

CLONES_HEALTHY=0
CLONES_TOTAL=${#CLONES[@]}

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    
    echo -n "  $clone (port $port): "
    
    if response=$(curl -s -f http://localhost:$port/health 2>/dev/null); then
        status=$(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$status" = "active" ]; then
            echo -e "${GREEN}✅ Active${NC}"
            CLONES_HEALTHY=$((CLONES_HEALTHY + 1))
        else
            echo -e "${YELLOW}⚠ Status: $status${NC}"
        fi
    else
        echo -e "${RED}❌ Unreachable${NC}"
    fi
done

echo ""
echo -e "${BLUE}Configuration:${NC}"

# Detect OS and config location
if [[ "$OSTYPE" == "darwin"* ]]; then
    CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    CONFIG_FILE="$HOME/.config/Claude/claude_desktop_config.json"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    CONFIG_FILE="$APPDATA/Claude/claude_desktop_config.json"
else
    CONFIG_FILE="Unknown OS"
fi

echo "  Config location: $CONFIG_FILE"

if [ -f "$CONFIG_FILE" ]; then
    echo -n "  Config file: "
    
    # Check if it's valid JSON (basic check)
    if command -v jq &> /dev/null; then
        if jq empty "$CONFIG_FILE" 2>/dev/null; then
            echo -e "${GREEN}✅ Valid JSON${NC}"
            
            # Check if digital-sanctuary is configured
            if jq -e '.mcpServers["digital-sanctuary"]' "$CONFIG_FILE" &>/dev/null; then
                echo -e "  ${GREEN}✅ Digital Sanctuary configured${NC}"
            else
                echo -e "  ${YELLOW}⚠ Digital Sanctuary not configured${NC}"
                echo "     Run: ./setup.sh"
            fi
        else
            echo -e "${RED}❌ Invalid JSON${NC}"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    else
        echo -e "${YELLOW}⚠ Cannot validate (jq not installed)${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ Config file not found${NC}"
    echo "     Run: ./setup.sh"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$CLONES_HEALTHY" -eq 0 ]; then
    echo -e "${RED}❌ No clones are running!${NC}"
    echo ""
    echo "Start the clone network:"
    echo "  cd .."
    echo "  ./scripts/deploy-all.sh"
    echo ""
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
elif [ "$CLONES_HEALTHY" -lt "$CLONES_TOTAL" ]; then
    echo -e "${YELLOW}⚠ Only $CLONES_HEALTHY of $CLONES_TOTAL clones are healthy${NC}"
    echo ""
    echo "Some clones need attention. Check their status:"
    echo "  cd .."
    echo "  ./scripts/health-check.sh"
    echo ""
else
    echo -e "${GREEN}✅ All $CLONES_TOTAL clones are healthy!${NC}"
    echo ""
fi

if [ "$ISSUES_FOUND" -eq 0 ]; then
    echo -e "${GREEN}✅ Validation Successful!${NC}"
    echo ""
    echo "The MCP server is ready for Claude Desktop integration."
    echo ""
    echo "Next steps:"
    echo "  1. Configure Claude Desktop: ./setup.sh"
    echo "  2. Restart Claude Desktop"
    echo "  3. Test: 'Check the health of the sanctuary network'"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Validation Failed!${NC}"
    echo ""
    echo "Found $ISSUES_FOUND issue(s). Please fix them and run validation again."
    echo ""
    echo "For help, see: TROUBLESHOOTING.md"
    echo ""
    exit 1
fi
