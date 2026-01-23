# ============================================
# Turbopack Error Fix Script untuk Windows PowerShell
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🔧 TURBOPACK ERROR FIX SCRIPT (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend folder
$frontendPath = "D:\esabond\esabond_web\esabumindo-frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Folder tidak ditemukan: $frontendPath" -ForegroundColor Red
    Read-Host "Tekan Enter untuk exit"
    exit 1
}

Set-Location $frontendPath
Write-Host "✓ Folder ditemukan: $frontendPath" -ForegroundColor Green
Write-Host ""

# Step 1: Delete node_modules
Write-Host "[1/5] Menghapus node_modules folder..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "✓ node_modules dihapus" -ForegroundColor Green
} else {
    Write-Host "ℹ️  node_modules tidak ada (skip)" -ForegroundColor Gray
}
Write-Host ""

# Step 2: Delete .next folder
Write-Host "[2/5] Menghapus .next folder..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "✓ .next dihapus" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .next tidak ada (skip)" -ForegroundColor Gray
}
Write-Host ""

# Step 3: Delete package-lock.json
Write-Host "[3/5] Menghapus package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "✓ package-lock.json dihapus" -ForegroundColor Green
} else {
    Write-Host "ℹ️  package-lock.json tidak ada (skip)" -ForegroundColor Gray
}
Write-Host ""

# Step 4: npm cache clean
Write-Host "[4/5] Membersihkan npm cache..." -ForegroundColor Yellow
& npm cache clean --force
Write-Host "✓ npm cache dibersihkan" -ForegroundColor Green
Write-Host ""

# Step 5: npm install
Write-Host "[5/5] Install dependencies..." -ForegroundColor Yellow
& npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install gagal!" -ForegroundColor Red
    Read-Host "Tekan Enter untuk exit"
    exit 1
}
Write-Host "✓ Dependencies terinstall" -ForegroundColor Green
Write-Host ""

# Step 6: Update baseline-browser-mapping
Write-Host "[BONUS] Update baseline-browser-mapping..." -ForegroundColor Yellow
& npm install baseline-browser-mapping@latest -D
Write-Host "✓ baseline-browser-mapping updated" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ SEMUA STEP SELESAI!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sekarang jalankan: npm run dev" -ForegroundColor Green
Write-Host ""
Read-Host "Tekan Enter untuk close window"
