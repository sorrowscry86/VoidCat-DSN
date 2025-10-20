# VoidCat RDC Digital Sanctuary Network - Clone Deployment
# Deploys all 5 specialized clones

Write-Host "🚀 Starting VoidCat RDC Sanctuary Network Deployment..." -ForegroundColor Cyan

$clones = @(
    @{ name = 'beta'; port = 3002; container = 'ryuzu-beta-sanctuary'; role = 'Security Analyzer' },
    @{ name = 'gamma'; port = 3003; container = 'ryuzu-gamma-sanctuary'; role = 'Architect' },
    @{ name = 'delta'; port = 3004; container = 'ryuzu-delta-sanctuary'; role = 'QA Tester' },
    @{ name = 'sigma'; port = 3005; container = 'ryuzu-sigma-sanctuary'; role = 'Communicator' },
    @{ name = 'omega'; port = 3000; container = 'ryuzu-omega-sanctuary'; role = 'Coordinator' }
)

foreach ($clone in $clones) {
    Write-Host ""
    Write-Host "📦 Deploying $($clone.role) ($($clone.name)) on port $($clone.port)..." -ForegroundColor Yellow
    
    docker stop $clone.container -ErrorAction SilentlyContinue | Out-Null
    docker rm $clone.container -ErrorAction SilentlyContinue | Out-Null
    
    docker run -d --name $clone.container -p "$($clone.port):3001" --restart unless-stopped --env SANCTUARY_ROLE=$clone.name --env NODE_ENV=production "voidcat/$($clone.name):3.0.0"
    
    Write-Host "✅ $($clone.role) deployed" -ForegroundColor Green
}

Write-Host ""
Write-Host "⏳ Waiting for containers to stabilize..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🏥 Running health checks..." -ForegroundColor Cyan

$healthy = 0
foreach ($clone in $clones) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$($clone.port)/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $($clone.role) (port $($clone.port)): HEALTHY" -ForegroundColor Green
            $healthy++
        }
    }
    catch {
        Write-Host "❌ $($clone.role) (port $($clone.port)): UNHEALTHY" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Deployment Summary: $healthy / 5 healthy" -ForegroundColor Cyan
if ($healthy -eq 5) {
    Write-Host "🎉 All clones deployed and healthy!" -ForegroundColor Green
}
