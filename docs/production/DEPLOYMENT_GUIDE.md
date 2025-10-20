# Production Deployment Guide
## VoidCat RDC Digital Sanctuary Network - Phase 4

**Document Type:** Production Deployment Guide  
**Version:** 1.0.0  
**Date:** October 20, 2025  
**Status:** Phase 4 Planning Document

---

## Executive Summary

This guide provides comprehensive instructions for deploying the VoidCat RDC Digital Sanctuary Network to production environments. It covers Docker deployment, Kubernetes orchestration, cloud deployment strategies, and production best practices.

**Target Environments**:
- Docker Compose (single-host)
- Kubernetes (multi-host, cloud)
- AWS ECS/EKS
- Google Cloud GKE
- Azure AKS

---

## 1. Prerequisites

### 1.1 Infrastructure Requirements

**Minimum Requirements** (Single Host):
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 20GB SSD
- **Network**: 100 Mbps
- **OS**: Linux (Ubuntu 20.04+, RHEL 8+, or equivalent)

**Recommended Requirements** (Production):
- **CPU**: 8+ cores
- **RAM**: 16GB+
- **Storage**: 50GB+ SSD
- **Network**: 1 Gbps+
- **OS**: Linux (containerized environment)

### 1.2 Software Prerequisites

**Required**:
- Docker 20.10+
- Docker Compose 2.0+ (for single-host)
- Node.js 18+ (for local testing)
- Git

**Optional (Cloud Deployment)**:
- kubectl 1.24+
- Kubernetes cluster 1.24+
- Cloud CLI (aws-cli, gcloud, az)

### 1.3 Network Requirements

**Port Allocations**:
- 3000: Omega Clone (Coordinator)
- 3002: Beta Clone (Analyzer)
- 3003: Gamma Clone (Architect)
- 3004: Delta Clone (Tester)
- 3005: Sigma Clone (Communicator)

**Firewall Rules**:
- Allow inbound: 3000-3005 (clone communication)
- Allow outbound: 443 (Anthropic API, if used)
- Allow internal: All ports (inter-container communication)

---

## 2. Docker Deployment

### 2.1 Single-Host Docker Deployment

**Step 1: Clone Repository**
```bash
git clone https://github.com/sorrowscry86/VoidCat-DSN.git
cd VoidCat-DSN
```

**Step 2: Create Docker Network**
```bash
docker network create sanctuary-network
```

**Step 3: Build All Images**
```bash
# Build all clone images
for CLONE in beta gamma delta sigma omega; do
  docker build -f docker/Dockerfile.$CLONE \
    -t ryuzu-$CLONE:4.0.0 src/
done
```

**Step 4: Deploy Clones**
```bash
# Deploy Beta (Analyzer) - Port 3002
docker run -d --name ryuzu-beta-sanctuary \
  --network sanctuary-network \
  -p 3002:3001 \
  --restart unless-stopped \
  --memory 512m --cpus 0.5 \
  ryuzu-beta:4.0.0

# Deploy Gamma (Architect) - Port 3003
docker run -d --name ryuzu-gamma-sanctuary \
  --network sanctuary-network \
  -p 3003:3001 \
  --restart unless-stopped \
  --memory 512m --cpus 0.5 \
  ryuzu-gamma:4.0.0

# Deploy Delta (Tester) - Port 3004
docker run -d --name ryuzu-delta-sanctuary \
  --network sanctuary-network \
  -p 3004:3001 \
  --restart unless-stopped \
  --memory 512m --cpus 0.5 \
  ryuzu-delta:4.0.0

# Deploy Sigma (Communicator) - Port 3005
docker run -d --name ryuzu-sigma-sanctuary \
  --network sanctuary-network \
  -p 3005:3001 \
  --restart unless-stopped \
  --memory 512m --cpus 0.5 \
  ryuzu-sigma:4.0.0

# Deploy Omega (Coordinator) - Port 3000
docker run -d --name ryuzu-omega-sanctuary \
  --network sanctuary-network \
  -p 3000:3001 \
  --restart unless-stopped \
  --memory 1g --cpus 1.0 \
  ryuzu-omega:4.0.0
```

**Step 5: Verify Deployment**
```bash
# Check all containers
docker ps | grep ryuzu

# Health check all clones
for PORT in 3000 3002 3003 3004 3005; do
  echo "Checking port $PORT..."
  curl -f http://localhost:$PORT/health || echo "FAILED"
done
```

### 2.2 Docker Compose Deployment

Create `docker-compose.production.yml` in project root:

```yaml
version: '3.8'

services:
  omega:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.omega
    image: ryuzu-omega:4.0.0
    container_name: ryuzu-omega-sanctuary
    ports:
      - "3000:3001"
    networks:
      - sanctuary-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  beta:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.beta
    image: ryuzu-beta:4.0.0
    container_name: ryuzu-beta-sanctuary
    ports:
      - "3002:3001"
    networks:
      - sanctuary-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  gamma:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.gamma
    image: ryuzu-gamma:4.0.0
    container_name: ryuzu-gamma-sanctuary
    ports:
      - "3003:3001"
    networks:
      - sanctuary-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  delta:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.delta
    image: ryuzu-delta:4.0.0
    container_name: ryuzu-delta-sanctuary
    ports:
      - "3004:3001"
    networks:
      - sanctuary-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  sigma:
    build:
      context: ./src
      dockerfile: ../docker/Dockerfile.sigma
    image: ryuzu-sigma:4.0.0
    container_name: ryuzu-sigma-sanctuary
    ports:
      - "3005:3001"
    networks:
      - sanctuary-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  sanctuary-network:
    driver: bridge
```

**Deploy**:
```bash
docker-compose -f docker-compose.production.yml up -d
docker-compose -f docker-compose.production.yml ps
```

---

## 3. Kubernetes Deployment

### 3.1 Namespace and ConfigMap

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sanctuary
  labels:
    name: sanctuary
    environment: production
```

### 3.2 Omega (Coordinator) Deployment

```yaml
apiVersion: v1
kind: Service
metadata:
  name: omega-service
  namespace: sanctuary
spec:
  type: LoadBalancer
  ports:
    - port: 3000
      targetPort: 3001
  selector:
    app: ryuzu-omega
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ryuzu-omega
  namespace: sanctuary
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ryuzu-omega
  template:
    metadata:
      labels:
        app: ryuzu-omega
    spec:
      containers:
      - name: omega
        image: ryuzu-omega:4.0.0
        ports:
        - containerPort: 3001
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 10
```

**Deploy to Kubernetes**:
```bash
kubectl create namespace sanctuary
kubectl apply -f k8s-deployment.yaml
kubectl get pods -n sanctuary
kubectl get services -n sanctuary
```

---

## 4. Production Best Practices

### 4.1 Security

- Use minimal base images
- Run as non-root user
- Enable network policies
- Implement authentication (JWT/OAuth2)
- Use HTTPS/TLS
- Regular security audits

### 4.2 High Availability

- 2-3 replicas minimum
- Distribute across availability zones
- Implement health checks
- Use load balancers
- Automated failover

### 4.3 Monitoring

**Key Metrics**:
- Container health
- CPU/memory usage
- Request latency
- Error rates
- Message delivery rates

**Alerting Thresholds**:
- Critical: Service down, >10% error rate
- Warning: Latency >1s, CPU >80%
- Info: Deployment events

---

## 5. Deployment Verification

**Health Check Script** (`scripts/health-check-production.sh`):
```bash
#!/bin/bash
echo "🏥 Production Health Check..."

ENDPOINTS=(
  "omega:3000"
  "beta:3002"
  "gamma:3003"
  "delta:3004"
  "sigma:3005"
)

HEALTHY=0
for endpoint in "${ENDPOINTS[@]}"; do
  IFS=':' read -r name port <<< "$endpoint"
  if curl -sf "http://localhost:$port/health" > /dev/null; then
    echo "✅ $name: HEALTHY"
    ((HEALTHY++))
  else
    echo "❌ $name: UNHEALTHY"
  fi
done

echo "Health: $HEALTHY/${#ENDPOINTS[@]}"
[ $HEALTHY -eq ${#ENDPOINTS[@]} ] && exit 0 || exit 1
```

---

## 6. Rollback Procedures

**Docker Rollback**:
```bash
docker stop ryuzu-omega-sanctuary
docker run -d --name ryuzu-omega-sanctuary \
  -p 3000:3001 --restart unless-stopped \
  ryuzu-omega:3.1.0
```

**Kubernetes Rollback**:
```bash
kubectl rollout undo deployment/ryuzu-omega -n sanctuary
kubectl rollout status deployment/ryuzu-omega -n sanctuary
```

---

## 7. Maintenance

**Weekly**: Review logs, check resources  
**Monthly**: Security updates, dependency updates  
**Quarterly**: DR testing, load testing, security audit

---

**Document Version**: 1.0.0  
**Last Updated**: October 20, 2025

🏰 **VoidCat RDC Digital Sanctuary Network - Production Deployment** 🏰
