#############################################################################
# Phase 2 Deployment Script (PowerShell) - VoidCat RDC Digital Sanctuary
#
# Deploys all 5 clones with orchestration support on Windows/Docker
# Features: Health monitoring, clone coordination verification, auto-recovery
#
# Usage: .\deploy-phase2.ps1 -Command "build|start|stop|health|orchestration|full"
#############################################################################

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('build', 'start', 'stop', 'health', 'orchestration', 'full')]
    [string]$Command = 'full'
)

# Configuration
$WorkspaceDir = Split-Path -Parent $PSScriptRoot
$SrcDir = Join-Path $WorkspaceDir "src"
$DockerDir = Join-Path $WorkspaceDir "docker"
$Clones = @('beta', 'gamma', 'delta', 'sigma', 'omega')
$Ports = @(3002, 3003, 3004, 3005, 3000)
$Registry = "voidcat-rdc"

#############################################################################
# Helper Functions
#############################################################################

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $Message" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "→ $Message" -ForegroundColor Yellow
}

function Test-Prerequisites {
    Write-Info "Checking prerequisites..."
    
    $docker = docker --version 2>$null
    if (-not $docker) {
        Write-Error-Custom "Docker is not installed or not in PATH"
        exit 1
    }
    
    $node = node --version 2>$null
    if (-not $node) {
        Write-Error-Custom "Node.js is not installed or not in PATH"
        exit 1
    }
    
    Write-Success "Prerequisites check passed (Docker: $docker, Node: $node)"
}

#############################################################################
# Build Functions
#############################################################################

function Build-AllClones {
    Write-Header "Building Phase 2 Docker Images"
    
    for ($i = 0; $i -lt $Clones.Count; $i++) {
        $clone = $Clones[$i]
        $dockerfile = Join-Path $DockerDir "Dockerfile.$clone"
        $imageName = "$Registry-$clone`:phase2-latest"
        
        if (-not (Test-Path $dockerfile)) {
            Write-Error-Custom "Dockerfile not found: $dockerfile"
            exit 1
        }
        
        Write-Info "Building $clone..."
        & docker build `
            -f $dockerfile `
            -t $imageName `
            --build-arg NODE_ENV=production `
            $SrcDir
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Built $imageName"
        } else {
            Write-Error-Custom "Failed to build $clone"
            exit 1
        }
    }
}

#############################################################################
# Start Functions
#############################################################################

function Start-AllClones {
    Write-Header "Starting Phase 2 Clone Network"
    
    for ($i = 0; $i -lt $Clones.Count; $i++) {
        $clone = $Clones[$i]
        $port = $Ports[$i]
        $imageName = "$Registry-$clone`:phase2-latest"
        $containerName = "ryuzu-$clone-phase2"
        
        Write-Info "Starting $clone on port $port..."
        
        # Stop existing container if running
        $existing = & docker ps -a --format "{{.Names}}" 2>$null | Where-Object { $_ -eq $containerName }
        if ($existing) {
            Write-Info "Stopping existing container: $containerName"
            & docker stop $containerName 2>$null
            & docker rm $containerName 2>$null
        }
        
        # Start new container
        & docker run -d `
            --name $containerName `
            -p "$port`:3001" `
            -e NODE_ENV=production `
            -e CLONE_ROLE=$clone `
            --restart unless-stopped `
            --health-cmd="powershell -Command try {(Invoke-WebRequest http://localhost:3001/health).StatusCode} catch {exit 1}" `
            --health-interval=30s `
            --health-timeout=10s `
            --health-start-period=5s `
            --health-retries=3 `
            $imageName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Started $containerName on port $port"
        } else {
            Write-Error-Custom "Failed to start $clone"
            exit 1
        }
    }
    
    Write-Info "Waiting for clones to become healthy..."
    Start-Sleep -Seconds 10
    
    Test-CloneHealth
}

#############################################################################
# Health Check Functions
#############################################################################

function Test-CloneHealth {
    Write-Header "Verifying Clone Health Status"
    
    $allHealthy = $true
    
    for ($i = 0; $i -lt $Clones.Count; $i++) {
        $clone = $Clones[$i]
        $port = $Ports[$i]
        $url = "http://localhost:$port/health"
        
        Write-Info "Checking $clone health at $url..."
        
        try {
            $response = Invoke-WebRequest -Uri $url -ErrorAction Stop
            $body = $response.Content
            Write-Success "$clone is healthy: $body"
        } catch {
            Write-Error-Custom "$clone health check failed: $_"
            $allHealthy = $false
        }
    }
    
    if ($allHealthy) {
        Write-Success "All clones are healthy!"
    } else {
        Write-Error-Custom "Some clones are not healthy"
    }
    
    return $allHealthy
}

function Test-Orchestration {
    Write-Header "Verifying Clone Orchestration"
    
    Write-Info "Testing inter-clone communication..."
    
    try {
        $body = @{
            prompt = "Test orchestration"
            context = "Phase 2 verification"
            sessionId = "phase2-test-001"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "http://localhost:3000/task" `
            -Method Post `
            -Headers @{"Content-Type"="application/json"} `
            -Body $body `
            -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        
        if ($result.success -eq $true) {
            Write-Success "Orchestration test passed"
            return $true
        } else {
            Write-Error-Custom "Orchestration test failed: $($response.Content)"
            return $false
        }
    } catch {
        Write-Error-Custom "Orchestration test error: $_"
        return $false
    }
}

#############################################################################
# Stop Functions
#############################################################################

function Stop-AllClones {
    Write-Header "Stopping Phase 2 Clone Network"
    
    foreach ($clone in $Clones) {
        $containerName = "ryuzu-$clone-phase2"
        
        $existing = & docker ps -a --format "{{.Names}}" 2>$null | Where-Object { $_ -eq $containerName }
        if ($existing) {
            Write-Info "Stopping $containerName..."
            & docker stop $containerName 2>$null
            Write-Success "Stopped $containerName"
        }
    }
}

#############################################################################
# Main Script Logic
#############################################################################

function Main {
    switch ($Command) {
        'build' {
            Test-Prerequisites
            Build-AllClones
        }
        'start' {
            Test-Prerequisites
            Start-AllClones
        }
        'stop' {
            Test-Prerequisites
            Stop-AllClones
        }
        'health' {
            Test-Prerequisites
            Test-CloneHealth
        }
        'orchestration' {
            Test-Prerequisites
            Test-Orchestration
        }
        'full' {
            Test-Prerequisites
            Build-AllClones
            Start-AllClones
            Test-Orchestration
            Write-Header "Phase 2 Deployment Complete!"
            Write-Success "All clones running with orchestration enabled"
        }
    }
}

# Run main
Main
