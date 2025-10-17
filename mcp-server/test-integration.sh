#!/bin/bash

###############################################################################
# Digital Sanctuary Network - MCP Server Integration Tests
# 
# This script tests the MCP server integration by simulating tool calls
# and verifying the responses.
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🏰 Digital Sanctuary Network - MCP Integration Tests${NC}"
echo ""

# Check if clone network is running
echo -e "${BLUE}Step 1: Checking clone network status...${NC}"
echo ""

CLONES=(
  "omega:3000"
  "beta:3002"
  "gamma:3003"
  "delta:3004"
  "sigma:3005"
)

ALL_HEALTHY=true

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    
    echo -n "  ${clone^}: "
    
    if response=$(curl -s -f http://localhost:$port/health 2>/dev/null); then
        status=$(echo "$response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        if [ "$status" = "active" ]; then
            echo -e "${GREEN}✓ Active${NC}"
        else
            echo -e "${YELLOW}⚠ Status: $status${NC}"
            ALL_HEALTHY=false
        fi
    else
        echo -e "${RED}✗ Unreachable${NC}"
        ALL_HEALTHY=false
    fi
done

echo ""

if [ "$ALL_HEALTHY" = false ]; then
    echo -e "${RED}✗ Some clones are not healthy. Please start the clone network first.${NC}"
    echo ""
    echo "Run: ../scripts/deploy-all.sh"
    exit 1
fi

echo -e "${GREEN}✓ All clones are healthy and ready${NC}"
echo ""

# Test direct API calls that MCP tools would make
echo -e "${BLUE}Step 2: Testing clone endpoints (simulating MCP tool calls)...${NC}"
echo ""

# Test 1: Health check (sanctuary_health_check)
echo -e "${YELLOW}Test 1: sanctuary_health_check${NC}"
echo "  Checking all clone health statuses..."

HEALTH_RESULTS=$(
  for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    curl -s http://localhost:$port/health
  done
)

if echo "$HEALTH_RESULTS" | grep -q '"status":"active"'; then
    echo -e "  ${GREEN}✓ Health check successful${NC}"
else
    echo -e "  ${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Beta analyze (sanctuary_beta_analyze)
echo -e "${YELLOW}Test 2: sanctuary_beta_analyze${NC}"
echo "  Sending code analysis request to Beta..."

BETA_RESPONSE=$(curl -s -X POST http://localhost:3002/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test analysis request",
    "context": "Testing MCP integration",
    "sessionId": "test-session-001"
  }')

if echo "$BETA_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Beta analysis tool works${NC}"
else
    echo -e "  ${RED}✗ Beta analysis failed${NC}"
    echo "$BETA_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Gamma design (sanctuary_gamma_design)
echo -e "${YELLOW}Test 3: sanctuary_gamma_design${NC}"
echo "  Sending architecture design request to Gamma..."

GAMMA_RESPONSE=$(curl -s -X POST http://localhost:3003/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test design request",
    "context": "Testing MCP integration",
    "sessionId": "test-session-002"
  }')

if echo "$GAMMA_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Gamma design tool works${NC}"
else
    echo -e "  ${RED}✗ Gamma design failed${NC}"
    exit 1
fi
echo ""

# Test 4: Delta test (sanctuary_delta_test)
echo -e "${YELLOW}Test 4: sanctuary_delta_test${NC}"
echo "  Sending testing strategy request to Delta..."

DELTA_RESPONSE=$(curl -s -X POST http://localhost:3004/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test QA request",
    "context": "Testing MCP integration",
    "sessionId": "test-session-003"
  }')

if echo "$DELTA_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Delta testing tool works${NC}"
else
    echo -e "  ${RED}✗ Delta testing failed${NC}"
    exit 1
fi
echo ""

# Test 5: Sigma document (sanctuary_sigma_document)
echo -e "${YELLOW}Test 5: sanctuary_sigma_document${NC}"
echo "  Sending documentation request to Sigma..."

SIGMA_RESPONSE=$(curl -s -X POST http://localhost:3005/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test documentation request",
    "context": "Testing MCP integration",
    "sessionId": "test-session-004"
  }')

if echo "$SIGMA_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Sigma documentation tool works${NC}"
else
    echo -e "  ${RED}✗ Sigma documentation failed${NC}"
    exit 1
fi
echo ""

# Test 6: Omega orchestrate (sanctuary_omega_orchestrate)
echo -e "${YELLOW}Test 6: sanctuary_omega_orchestrate${NC}"
echo "  Sending coordination request to Omega..."

OMEGA_RESPONSE=$(curl -s -X POST http://localhost:3000/task \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Test orchestration request",
    "context": "Testing MCP integration",
    "sessionId": "test-session-005"
  }')

if echo "$OMEGA_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Omega orchestration tool works${NC}"
else
    echo -e "  ${RED}✗ Omega orchestration failed${NC}"
    exit 1
fi
echo ""

# Test 7: Omega delegate (sanctuary_omega_delegate)
echo -e "${YELLOW}Test 7: sanctuary_omega_delegate${NC}"
echo "  Testing context-engineered delegation through Omega..."

DELEGATE_RESPONSE=$(curl -s -X POST http://localhost:3000/orchestrate \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Test delegation",
    "targetClone": "beta",
    "essentialData": {"test": "data"},
    "constraints": ["Test constraint"],
    "sessionId": "test-session-006"
  }')

if echo "$DELEGATE_RESPONSE" | grep -q '"success":true'; then
    echo -e "  ${GREEN}✓ Omega delegation tool works${NC}"
else
    echo -e "  ${RED}✗ Omega delegation failed${NC}"
    exit 1
fi
echo ""

# Test 8: Artifact storage (sanctuary_store_artifact)
echo -e "${YELLOW}Test 8: sanctuary_store_artifact${NC}"
echo "  Testing artifact storage..."

ARTIFACT_RESPONSE=$(curl -s -X POST http://localhost:3002/artifacts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "test",
    "content": "Test artifact content",
    "metadata": {"description": "MCP integration test artifact"}
  }')

if echo "$ARTIFACT_RESPONSE" | grep -q '"success":true'; then
    ARTIFACT_ID=$(echo "$ARTIFACT_RESPONSE" | grep -o '"artifactId":"[^"]*"' | cut -d'"' -f4)
    echo -e "  ${GREEN}✓ Artifact storage works${NC}"
    echo "  Artifact ID: $ARTIFACT_ID"
    
    # Test 9: Artifact retrieval (sanctuary_get_artifact)
    echo ""
    echo -e "${YELLOW}Test 9: sanctuary_get_artifact${NC}"
    echo "  Testing artifact retrieval..."
    
    RETRIEVE_RESPONSE=$(curl -s http://localhost:3002/artifacts/$ARTIFACT_ID)
    
    if echo "$RETRIEVE_RESPONSE" | grep -q '"success":true'; then
        echo -e "  ${GREEN}✓ Artifact retrieval works${NC}"
    else
        echo -e "  ${RED}✗ Artifact retrieval failed${NC}"
        exit 1
    fi
else
    echo -e "  ${RED}✗ Artifact storage failed${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}All MCP Integration Tests Passed! ✓${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "The MCP server is ready for Claude Desktop/Code integration!"
echo ""
echo "Next steps:"
echo "1. Configure Claude Desktop with: ./setup.sh"
echo "2. Restart Claude Desktop"
echo "3. Test in Claude: 'Check the health of the sanctuary network'"
echo ""
echo -e "${BLUE}🌸 The Digital Sanctuary awaits!${NC}"
