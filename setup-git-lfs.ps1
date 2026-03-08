# Git LFS Setup Script for Render Deployment
# Run this script before your first deployment to Render

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Git LFS Setup for Render Deployment" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git LFS is installed
Write-Host "Checking Git LFS installation..." -ForegroundColor Yellow
$lfsVersion = git lfs version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git LFS is not installed!" -ForegroundColor Red
    Write-Host "Please install Git LFS first:" -ForegroundColor Yellow
    Write-Host "  Download from: https://git-lfs.github.com/" -ForegroundColor White
    Write-Host "  Or run: winget install GitHub.GitLFS" -ForegroundColor White
    exit 1
}
Write-Host "✅ Git LFS is installed: $lfsVersion" -ForegroundColor Green
Write-Host ""

# Initialize Git LFS
Write-Host "Initializing Git LFS..." -ForegroundColor Yellow
git lfs install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize Git LFS" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git LFS initialized" -ForegroundColor Green
Write-Host ""

# Check if model file exists
Write-Host "Checking model file..." -ForegroundColor Yellow
if (-not (Test-Path "cattle_model.keras")) {
    Write-Host "❌ Model file 'cattle_model.keras' not found!" -ForegroundColor Red
    exit 1
}
$modelSize = (Get-Item "cattle_model.keras").Length / 1MB
Write-Host "✅ Model file found: $([math]::Round($modelSize, 2)) MB" -ForegroundColor Green
Write-Host ""

# Check if .gitattributes exists and is configured
Write-Host "Checking .gitattributes..." -ForegroundColor Yellow
if (-not (Test-Path ".gitattributes")) {
    Write-Host "❌ .gitattributes not found!" -ForegroundColor Red
    exit 1
}
$gitattributes = Get-Content ".gitattributes"
if ($gitattributes -notmatch "\.keras.*filter=lfs") {
    Write-Host "⚠️  .gitattributes exists but doesn't track .keras files" -ForegroundColor Yellow
    Write-Host "Adding .keras to Git LFS tracking..." -ForegroundColor Yellow
    git lfs track "*.keras"
    git add .gitattributes
}
Write-Host "✅ .gitattributes configured for LFS" -ForegroundColor Green
Write-Host ""

# Check if model is tracked by LFS
Write-Host "Verifying LFS tracking..." -ForegroundColor Yellow
$lfsFiles = git lfs ls-files 2>$null
if ($lfsFiles -match "cattle_model\.keras") {
    Write-Host "✅ Model file is tracked by Git LFS" -ForegroundColor Green
} else {
    Write-Host "⚠️  Model is NOT tracked by Git LFS yet" -ForegroundColor Yellow
    Write-Host "Migrating model to Git LFS..." -ForegroundColor Yellow
    
    # Check if file is already committed
    $isCommitted = git ls-files | Select-String "cattle_model.keras"
    if ($isCommitted) {
        # Migrate existing file
        git lfs migrate import --include="cattle_model.keras" --everything
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Failed to migrate model to LFS" -ForegroundColor Red
            exit 1
        }
    } else {
        # Just add it normally, LFS will handle it
        git add cattle_model.keras
    }
    Write-Host "✅ Model migrated to Git LFS" -ForegroundColor Green
}
Write-Host ""

# Verify LFS pointer vs actual file
Write-Host "Verifying file is not an LFS pointer..." -ForegroundColor Yellow
$firstLine = Get-Content "cattle_model.keras" -First 1 -Raw
if ($firstLine -match "version https://git-lfs.github.com") {
    Write-Host "⚠️  File appears to be an LFS pointer, not the actual file" -ForegroundColor Yellow
    Write-Host "Run: git lfs pull" -ForegroundColor White
} else {
    if ($modelSize -gt 100) {
        Write-Host "✅ File is the actual model (not a pointer)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  File seems too small to be the actual model" -ForegroundColor Yellow
    }
}
Write-Host ""

# Show status
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Git LFS Status" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
git lfs ls-files
Write-Host ""

# Next steps
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "1. Commit changes:" -ForegroundColor Yellow
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Configure Git LFS for model file'" -ForegroundColor White
Write-Host ""
Write-Host "2. Push to GitHub:" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Deploy to Render:" -ForegroundColor Yellow
Write-Host "   - Go to render.com" -ForegroundColor White
Write-Host "   - Create new Blueprint" -ForegroundColor White
Write-Host "   - Select your repository" -ForegroundColor White
Write-Host "   - Apply the render.yaml config" -ForegroundColor White
Write-Host ""
Write-Host "✅ Setup complete! Ready for deployment." -ForegroundColor Green
