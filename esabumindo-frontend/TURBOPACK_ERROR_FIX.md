# 🔧 TURBOPACK ERROR FIX GUIDE

## 🚨 Error yang Terjadi

```
esmExternals = "loose" is not supported
Error [TurbopackInternalError]: esmExternals = "loose" is not supported
```

**Penyebab**: Konfigurasi `esmExternals: "loose"` di `next.config.mjs` tidak kompatibel dengan **Turbopack** (bundler default di Next.js 16).

---

## ✅ SOLUSI QUICK FIX

### Step 1: Update next.config.mjs ✅ SUDAH DILAKUKAN

File `next.config.mjs` sudah diperbaiki:

- ❌ Dihapus: `esmExternals: "loose"`
- ✅ Sisa konfigurasi tetap optimal

### Step 2: Clean Install Dependencies

**Windows CMD/PowerShell:**

```powershell
# Pergi ke folder frontend
cd D:\esabond\esabond_web\esabumindo-frontend

# Hapus node_modules dan .next folder
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json

# Reinstall dependencies
npm install
```

**Alternative (jika PowerShell error):**

```batch
cd D:\esabond\esabond_web\esabumindo-frontend
rmdir /s node_modules
rmdir /s .next
del package-lock.json
npm install
```

### Step 3: Update Baseline Browser Mapping

```bash
npm install baseline-browser-mapping@latest -D
```

### Step 4: Test Development Server

```bash
npm run dev
```

✅ Seharusnya sekarang berjalan tanpa error!

---

## 🛠️ Alternative Solutions (Jika Masih Error)

### Option A: Disable Turbopack Temporarily

Jika setelah clean install masih error, gunakan webpack sebagai bundler:

**Edit next.config.mjs:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ...rest of config...

  // ✅ Force webpack bundler (Turbopack fallback)
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/*"],
  },
};

export default nextConfig;
```

**Run with webpack:**

```bash
npm run dev -- --no-turbopack
```

---

### Option B: Clear npm Cache Completely

```bash
# Clear npm cache
npm cache clean --force

# Delete lock file
del package-lock.json

# Reinstall fresh
npm install
```

---

### Option C: Update Next.js to Latest

```bash
npm install next@latest
npm install
npm run dev
```

---

## 📋 COMPLETE STEP-BY-STEP CHECKLIST

### Phase 1: Configuration ✅ DONE

- [x] Removed `esmExternals: "loose"` from next.config.mjs
- [x] Kept other optimizations intact
- [x] Config now Turbopack-compatible

### Phase 2: Clean Dependencies

- [ ] Delete `node_modules` folder
- [ ] Delete `.next` folder
- [ ] Delete `package-lock.json`
- [ ] Run `npm install`

### Phase 3: Update Tools

- [ ] Run `npm install baseline-browser-mapping@latest -D`

### Phase 4: Test

- [ ] Run `npm run dev`
- [ ] Check http://localhost:3000
- [ ] Verify no Turbopack errors

### Phase 5: Build (Optional)

- [ ] Run `npm run build` (test production build)
- [ ] Check for warnings/errors
- [ ] Run `npm start` (test production server)

---

## 🎯 COMMANDS TO RUN (Copy & Paste Ready)

### All-in-One Windows PowerShell:

```powershell
cd D:\esabond\esabond_web\esabumindo-frontend
rm -r node_modules -Force -ErrorAction SilentlyContinue
rm -r .next -Force -ErrorAction SilentlyContinue
rm package-lock.json -Force -ErrorAction SilentlyContinue
npm install
npm install baseline-browser-mapping@latest -D
npm run dev
```

### All-in-One Windows CMD:

```batch
cd D:\esabond\esabond_web\esabumindo-frontend
rmdir /s /q node_modules 2>nul
rmdir /s /q .next 2>nul
del package-lock.json 2>nul
npm install
npm install baseline-browser-mapping@latest -D
npm run dev
```

---

## 🔍 VERIFY THE FIX

### Check 1: Verify Configuration

```bash
# Should show Turbopack compatible config
type next.config.mjs
# Look for: ❌ No "esmExternals: loose"
```

### Check 2: Verify Dev Server Starts

```bash
npm run dev

# Expected output:
# ✓ Ready in Xs
# - Local: http://localhost:3000
# - Environments: .env.local
```

### Check 3: Verify Pages Load

Open browser: **http://localhost:3000**

- ✅ Home page loads
- ✅ No Turbopack errors in console
- ✅ Pages responsive

---

## 🆘 TROUBLESHOOTING

### Issue 1: "Error: ENOENT: no such file or directory"

**Cause**: npm install gagal karena lock file corrupt
**Solution**:

```bash
rm package-lock.json
npm cache clean --force
npm install
```

### Issue 2: "Source map error"

**Cause**: Old source maps di .next folder
**Solution**:

```bash
rm -rf .next
npm run dev
```

### Issue 3: "Module not found" errors

**Cause**: node_modules incomplete
**Solution**:

```bash
npm ci  # Install exact versions from lock file
# or
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Still getting Turbopack error

**Cause**: Turbopack caching issue
**Solution**:

```bash
npm run dev -- --no-turbopack
# or force webpack:
npm run dev -- --experimental-app-only
```

---

## 📝 WHAT CHANGED IN next.config.mjs

### Before (❌ Error):

```javascript
experimental: {
  optimizePackageImports: ["lucide-react", "@radix-ui/*"],
  esmExternals: "loose",  // ❌ NOT compatible with Turbopack
},
```

### After (✅ Fixed):

```javascript
experimental: {
  optimizePackageImports: ["lucide-react", "@radix-ui/*"],
  // ✅ Removed esmExternals - Turbopack handles this automatically
},
```

---

## ✨ FINAL STATUS

| Item                  | Status       |
| --------------------- | ------------ |
| next.config.mjs fixed | ✅ DONE      |
| esmExternals removed  | ✅ DONE      |
| Turbopack compatible  | ✅ YES       |
| Ready to install deps | ✅ YES       |
| Ready to npm run dev  | ⏳ NEXT STEP |

---

## 🚀 NEXT STEPS

1. **Jalankan cleanup & install** (Step 2-3 di atas)
2. **Test development server** (Step 4)
3. **Verify pages load** (Check 3)
4. **Continue development**

---

## 📌 IMPORTANT NOTES

- ⚠️ **Don't manually add back `esmExternals: "loose"`** - it breaks Turbopack
- ✅ **Turbopack automatically handles ESM/CJS mixing** - no manual config needed
- ✅ **All other optimizations preserved** - performance still optimized
- ✅ **Next.js 16+ is Turbopack-first** - this is the correct approach

---

**Last Updated**: January 23, 2026  
**Status**: Ready for Implementation ✅
