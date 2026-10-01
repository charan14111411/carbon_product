# Starts the platform for local development (no Docker):
#   migrations on the database in api\.env -> API on http://localhost:8000 -> web app on http://localhost:4200
# Usage:   .\start-dev.ps1            (keeps existing data)
#          .\start-dev.ps1 -Seed      (rebuilds the demo dataset from scratch first — wipes the app's tables)
param([switch]$Seed)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$api = Join-Path $root 'api'
$py = Join-Path $root '.venv\Scripts\python.exe'

if (-not (Test-Path (Join-Path $api '.env'))) {
  Write-Host 'api\.env is missing. Copy api\.env.example to api\.env and set DATABASE_URL first.' -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $py)) {
  Write-Host '     Creating Python environment...' -ForegroundColor Green
  python -m venv (Join-Path $root '.venv')
  & $py -m pip install -q -r (Join-Path $api 'requirements.txt')
}

Push-Location $api
try {
  if ($Seed) {
    Write-Host '1/3  Rebuilding the demo dataset (about 6 minutes; runs the migrations too)...' -ForegroundColor Green
    & $py -m scripts.seed_demo --reset
  } else {
    Write-Host '1/3  Applying database migrations (alembic upgrade head)...' -ForegroundColor Green
    & $py -m alembic upgrade head
  }
  if ($LASTEXITCODE -ne 0) { throw 'The database step failed (see above).' }
} finally { Pop-Location }

Write-Host '2/3  API on http://localhost:8000 (docs at /docs)...' -ForegroundColor Green
Start-Process -FilePath $py -ArgumentList '-m', 'uvicorn', 'app.main:app', '--port', '8000' `
  -WorkingDirectory $api -WindowStyle Minimized

Write-Host '3/3  Web app on http://localhost:4200 ...' -ForegroundColor Green
$web = Join-Path $root 'web'
if (-not (Test-Path (Join-Path $web 'node_modules'))) { Push-Location $web; npm install; Pop-Location }
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', 'npx ng serve --port 4200' -WorkingDirectory $web -WindowStyle Minimized

Write-Host ''
Write-Host 'Ready in a few seconds: http://localhost:4200' -ForegroundColor Cyan
Write-Host 'Demo accounts and the verifier link: api\var\demo_accounts.txt (password Demo-Pass-2026!)'
