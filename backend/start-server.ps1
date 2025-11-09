# PowerShell script to start the backend server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating one..." -ForegroundColor Yellow
    @"
JWT_SECRET=mySecretKey12345678901234567890abcdefghijklmnopqrstuvwxyz
MONGO_URI=mongodb://127.0.0.1:27017/expenseTrackerDB
PORT=5000
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host ""
}

# Start the server
Write-Host "✅ Starting server on http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm start

