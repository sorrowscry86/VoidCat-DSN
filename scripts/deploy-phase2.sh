#!/bin/bash

###############################################################################
# Phase 2 Deployment Script - VoidCat RDC Digital Sanctuary Network
# 
# Deploys all 5 clones with orchestration support
# Features: Health monitoring, clone coordination verification, auto-recovery
# 
# Usage: ./deploy-phase2.sh [build|start|stop|health|full]
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="$WORKSPACE_DIR/src"
DOCKER_DIR="$WORKSPACE_DIR/docker"
CLONES=("beta" "gamma" "delta" "sigma" "omega")
PORTS=(3002 3003 3004 3005 3000)
REGISTRY="voidcat-rdc"

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║ $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

###############################################################################
# Build Functions
###############################################################################

build_all_clones() {
    print_header "Building Phase 2 Docker Images"
    
    for i in "${!CLONES[@]}"; do
        clone="${CLONES[$i]}"
        dockerfile="$DOCKER_DIR/Dockerfile.$clone"
        image_name="$REGISTRY-$clone:phase2-latest"
        
        if [ ! -f "$dockerfile" ]; then
            print_error "Dockerfile not found: $dockerfile"
            exit 1
        fi
        
        print_info "Building $clone..."
        docker build \
            -f "$dockerfile" \
            -t "$image_name" \
            --build-arg NODE_ENV=production \
            "$SRC_DIR" || {
            print_error "Failed to build $clone"
            exit 1
        }
        
        print_success "Built $image_name"
    done
}

###############################################################################
# Start Functions
###############################################################################

start_all_clones() {
    print_header "Starting Phase 2 Clone Network"
    
    for i in "${!CLONES[@]}"; do
        clone="${CLONES[$i]}"
        port="${PORTS[$i]}"
        image_name="$REGISTRY-$clone:phase2-latest"
        container_name="ryuzu-$clone-phase2"
        
        print_info "Starting $clone on port $port..."
        
        # Stop existing container if running
        if docker ps -a --format '{{.Names}}' | grep -q "^$container_name$"; then
            print_info "Stopping existing container: $container_name"
            docker stop "$container_name" 2>/dev/null || true
            docker rm "$container_name" 2>/dev/null || true
        fi
        
        # Start new container
        docker run -d \
            --name "$container_name" \
            -p "$port:3001" \
            -e NODE_ENV=production \
            -e CLONE_ROLE="$clone" \
            --restart unless-stopped \
            --health-cmd="curl -f http://localhost:3001/health || exit 1" \
            --health-interval=30s \
            --health-timeout=10s \
            --health-start-period=5s \
            --health-retries=3 \
            "$image_name" || {
            print_error "Failed to start $clone"
            exit 1
        }
        
        print_success "Started $container_name on port $port"
    done
    
    print_info "Waiting for clones to become healthy..."
    sleep 10
    
    verify_clone_health
}

###############################################################################
# Health Check Functions
###############################################################################

verify_clone_health() {
    print_header "Verifying Clone Health Status"
    
    local all_healthy=true
    
    for i in "${!CLONES[@]}"; do
        clone="${CLONES[$i]}"
        port="${PORTS[$i]}"
        url="http://localhost:$port/health"
        
        print_info "Checking $clone health at $url..."
        
        if curl -s -f "$url" > /dev/null 2>&1; then
            response=$(curl -s "$url")
            print_success "$clone is healthy: $response"
        else
            print_error "$clone health check failed"
            all_healthy=false
        fi
    done
    
    if [ "$all_healthy" = true ]; then
        print_success "All clones are healthy!"
        return 0
    else
        print_error "Some clones are not healthy"
        return 1
    fi
}

verify_orchestration() {
    print_header "Verifying Clone Orchestration"
    
    print_info "Testing inter-clone communication..."
    
    # Test Omega to Beta communication
    response=$(curl -s -X POST http://localhost:3000/task \
        -H "Content-Type: application/json" \
        -d '{
            "prompt": "Test orchestration",
            "context": "Phase 2 verification",
            "sessionId": "phase2-test-001"
        }')
    
    if echo "$response" | grep -q '"success":true'; then
        print_success "Orchestration test passed"
    else
        print_error "Orchestration test failed: $response"
        return 1
    fi
}

###############################################################################
# Stop Functions
###############################################################################

stop_all_clones() {
    print_header "Stopping Phase 2 Clone Network"
    
    for clone in "${CLONES[@]}"; do
        container_name="ryuzu-$clone-phase2"
        
        if docker ps -a --format '{{.Names}}' | grep -q "^$container_name$"; then
            print_info "Stopping $container_name..."
            docker stop "$container_name"
            print_success "Stopped $container_name"
        fi
    done
}

###############################################################################
# Main Script Logic
###############################################################################

main() {
    local command="${1:-full}"
    
    case "$command" in
        build)
            check_prerequisites
            build_all_clones
            ;;
        start)
            check_prerequisites
            start_all_clones
            ;;
        stop)
            check_prerequisites
            stop_all_clones
            ;;
        health)
            check_prerequisites
            verify_clone_health
            ;;
        orchestration)
            check_prerequisites
            verify_orchestration
            ;;
        full)
            check_prerequisites
            build_all_clones
            start_all_clones
            verify_orchestration
            print_header "Phase 2 Deployment Complete!"
            print_success "All clones running with orchestration enabled"
            ;;
        *)
            echo "Usage: $0 {build|start|stop|health|orchestration|full}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
