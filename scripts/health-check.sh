#!/bin/bash

# Digital Sanctuary Network - Health Check Script
# Monitors the status of all Ryuzu clones

echo "🌸 Digital Sanctuary Network Health Check"
echo "=========================================="
echo ""

# Define clones and their ports
CLONES=("beta:3002" "gamma:3003" "delta:3004" "sigma:3005" "omega:3000")
ALL_HEALTHY=true

echo "🔍 Checking individual clone health..."
echo ""

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    echo -n "  🌸 Ryuzu $clone (port $port): "
    
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        # Get detailed health info
        HEALTH_DATA=$(curl -s "http://localhost:$port/health")
        STATUS=$(echo $HEALTH_DATA | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        ROLE=$(echo $HEALTH_DATA | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
        
        if [ "$STATUS" = "active" ]; then
            echo "✅ Healthy ($ROLE active)"
        else
            echo "⚠️  Status: $STATUS"
            ALL_HEALTHY=false
        fi
    else
        echo "❌ Unreachable"
        ALL_HEALTHY=false
    fi
done

echo ""
echo "📊 Docker Container Status:"
if docker ps --filter "name=ryuzu" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q ryuzu; then
    docker ps --filter "name=ryuzu" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "  ❌ No Ryuzu containers found"
    ALL_HEALTHY=false
fi

echo ""
echo "🧠 Memory Usage:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker ps --filter "name=ryuzu" --format "{{.Names}}") 2>/dev/null || echo "  ℹ️  No container stats available"

echo ""
if [ "$ALL_HEALTHY" = true ]; then
    echo "🎉 SUCCESS: All clones are healthy and operational!"
    echo ""
    echo "🏰 The Digital Sanctuary Network is fully functional:"
    echo "  • All 5 Ryuzu clones responding correctly"
    echo "  • Health endpoints returning proper status"
    echo "  • Docker containers running as expected"
    echo ""
    echo "🌸 Ready to serve with gentle dedication! ✨"
    exit 0
else
    echo "⚠️  ISSUES DETECTED:"
    echo "  • Some clones are not responding properly"
    echo "  • Check individual container logs for details"
    echo "  • Consider running deployment script to recover"
    echo ""
    echo "🔧 Troubleshooting commands:"
    echo "  docker logs ryuzu-<clone>-sanctuary"
    echo "  ./scripts/deploy-all.sh"
    echo ""
    exit 1
fi