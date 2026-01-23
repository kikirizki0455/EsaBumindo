@echo off
REM ============================================
REM Turbopack Error Fix Script untuk Windows
REM ============================================

echo.
echo ========================================
echo  🔧 TURBOPACK ERROR FIX SCRIPT
echo ========================================
echo.

REM Check if already in frontend folder
cd /d "D:\esabond\esabond_web\esabumindo-frontend" || (
    echo ❌ Folder tidak ditemukan!
    pause
    exit /b 1
)

echo ✓ Folder ditemukan
echo.

REM Step 1: Delete node_modules
echo [1/5] Menghapus node_modules folder...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules dihapus
) else (
    echo ℹ️  node_modules tidak ada (skip)
)
echo.

REM Step 2: Delete .next folder
echo [2/5] Menghapus .next folder...
if exist .next (
    rmdir /s /q .next
    echo ✓ .next dihapus
) else (
    echo ℹ️  .next tidak ada (skip)
)
echo.

REM Step 3: Delete package-lock.json
echo [3/5] Menghapus package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo ✓ package-lock.json dihapus
) else (
    echo ℹ️  package-lock.json tidak ada (skip)
)
echo.

REM Step 4: npm cache clean
echo [4/5] Membersihkan npm cache...
call npm cache clean --force
echo ✓ npm cache dibersihkan
echo.

REM Step 5: npm install
echo [5/5] Install dependencies...
call npm install
if errorlevel 1 (
    echo ❌ npm install gagal!
    pause
    exit /b 1
)
echo ✓ Dependencies terinstall
echo.

REM Step 6: Update baseline-browser-mapping
echo [BONUS] Update baseline-browser-mapping...
call npm install baseline-browser-mapping@latest -D
echo ✓ baseline-browser-mapping updated
echo.

echo ========================================
echo ✅ SEMUA STEP SELESAI!
echo ========================================
echo.
echo Sekarang jalankan: npm run dev
echo.
pause
