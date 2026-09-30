# Starts the whole platform for local development:
#   database (Docker) -> API on http://localhost:8000 -> web app on http://localhost:4200
# Usage:   .\start-dev.ps1            (keeps existing data)
#          .\start-dev.ps1 -Seed      (rebuilds the demo dataset from scratch first)
param([switch]$Seed)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$py = Join-Path $root '.venv\Scripts\python.exe'

Write-Host '1/4  Database (PostgreSQL + PostGIS)...' -ForegroundColor Green
docker compose -f (Join-Path $root 'docker-compose.yml') up -d | Out-Null
do { Start-Sleep -Seconds 2 } until ((docker inspect -f '{{.State.Health.Status}}' varsapradaya-carbon-db-1) -eq 'healthy')

if (-not (Test-Path $py)) {
  Write-Host '     Creating Python environment...' -ForegroundColor Green
  python -m venv (Join-Path $root '.venv')
  & $py -m pip install -q -r (Join-Path $root 'api\requirements.txt')
}

if ($Seed) {
  Write-Host '2/4  Building the demo dataset (about a minute)...' -ForegroundColor Green
  Push-Location (Join-Path $root 'api'); & $py -m scripts.seed_demo --reset; Pop-Location
} else {
  Write-Host '2/4  Keeping existing data (use -Seed to rebuild the demo)' -ForegroundColor Green
}

Write-Host '3/4  API on http://localhost:8000 (docs at /docs)...' -ForegroundColor Green
Start-Process -FilePath $py -ArgumentList '-m', 'uvicorn', 'app.main:app', '--port', '8000' `
  -WorkingDirectory (Join-Path $root 'api') -WindowStyle Minimized

Write-Host '4/4  Web app on http://localhost:4200 ...' -ForegroundColor Green
$web = Join-Path $root 'web'
if (-not (Test-Path (Join-Path $web 'node_modules'))) { Push-Location $web; npm install; Pop-Location }
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx ng serve --port 4200' -WorkingDirectory $web -WindowStyle Minimized

Write-Host ''
Write-Host 'Ready in a few seconds: http://localhost:4200' -ForegroundColor Cyan
Write-Host 'Demo accounts and the verifier link: api\var\demo_accounts.txt (password Demo-Pass-2026!)'
