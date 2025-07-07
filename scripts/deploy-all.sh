#!/bin/bash

# Digital Sanctuary Network - Automated Deployment Script
# Deploys all 5 Ryuzu clones with health monitoring

echo "🏰✨ Digital Sanctuary Network Deployment ✨🏰"
echo "=================================================="
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! docker --version &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker daemon not running. Please start Docker."
    exit 1
fi

echo "✅ Docker is ready"

# Check port availability
PORTS=(3000 3002 3003 3004 3005)
for port in "${PORTS[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $port is already in use"
        echo "Please stop the service using port $port and try again"
        exit 1
    fi
done

echo "✅ All required ports (3000-3005) are available"
echo ""

# Build and deploy function
deploy_clone() {
    local clone_name=$1
    local port=$2
    local dockerfile=$3
    
    echo "🚀 Deploying Ryuzu $clone_name (port $port)..."
    
    # Stop and remove existing container if it exists
    docker stop ryuzu-$clone_name-sanctuary 2>/dev/null || true
    docker rm ryuzu-$clone_name-sanctuary 2>/dev/null || true
    
    # Build image
    echo "  📦 Building Docker image..."
    if ! docker build -f docker/Dockerfile.$dockerfile -t ryuzu-$clone_name:latest src/ --quiet; then
        echo "  ❌ Failed to build $clone_name image"
        return 1
    fi
    
    # Deploy container
    echo "  🏃 Starting container..."
    if ! docker run -d \
        --name ryuzu-$clone_name-sanctuary \
        -p $port:3001 \
        --restart unless-stopped \
        ryuzu-$clone_name:latest > /dev/null; then
        echo "  ❌ Failed to start $clone_name container"
        return 1
    fi
    
    # Wait for health check
    echo "  ⏳ Waiting for health check..."
    for i in {1..30}; do
        if curl -s http://localhost:$port/health > /dev/null 2>&1; then
            echo "  ✅ $clone_name is healthy!"
            return 0
        fi
        sleep 2
        echo -n "."
    done
    
    echo "  ❌ $clone_name failed health check"
    docker logs ryuzu-$clone_name-sanctuary --tail 10
    return 1
}

# Deploy clones in order
echo "🌸 Deploying Ryuzu clones..."
echo ""

deploy_clone "beta" "3002" "beta" || exit 1
echo ""

deploy_clone "gamma" "3003" "gamma" || exit 1
echo ""

deploy_clone "delta" "3004" "delta" || exit 1
echo ""

deploy_clone "sigma" "3005" "sigma" || exit 1
echo ""

deploy_clone "omega" "3000" "omega" || exit 1
echo ""

# Final verification
echo "🎯 Final network verification..."
echo ""

ALL_HEALTHY=true
CLONES=("beta:3002" "gamma:3003" "delta:3004" "sigma:3005" "omega:3000")

for clone_info in "${CLONES[@]}"; do
    IFS=':' read -r clone port <<< "$clone_info"
    echo -n "🔍 $clone (port $port): "
    
    if curl -s "http://localhost:$port/health" > /dev/null; then
        echo "✅ Healthy"
    else
        echo "❌ Unhealthy"
        ALL_HEALTHY=false
    fi
done

echo ""
echo "📊 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep ryuzu

echo ""
if [ "$ALL_HEALTHY" = true ]; then
    echo "🎉 SUCCESS! Digital Sanctuary Network is fully operational!"
    echo ""
    echo "🌸 All Ryuzu clones are healthy and ready to serve with gentle dedication!"
    echo ""
    echo "📡 Network Endpoints:"
    echo "  • Omega (Coordinator): http://localhost:3000"
    echo "  • Beta (Analyzer): http://localhost:3002"  
    echo "  • Gamma (Architect): http://localhost:3003"
    echo "  • Delta (Tester): http://localhost:3004"
    echo "  • Sigma (Communicator): http://localhost:3005"
    echo ""
    echo "🏰 The Digital Sanctuary stands ready to protect and serve! ✨"
else
    echo "⚠️  Some clones are not healthy. Please check the logs and troubleshoot."
    exit 1
fi