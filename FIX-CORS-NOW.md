# 🚨 URGENT: Fix CORS Error - Restart Backend Server

## The Problem
You're getting CORS errors because the backend server is running with the OLD CORS configuration. It needs to be **restarted** to apply the new CORS fixes.

## Solution: Restart Backend Server

### Step 1: Stop the Current Backend Server

**Option A: If you have the terminal window open:**
- Find the terminal where backend is running
- Press `Ctrl+C` to stop it

**Option B: Kill the process:**
```powershell
# Find and kill the process on port 5000
$process = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($process) {
    Stop-Process -Id $process.OwningProcess -Force
    Write-Host "✅ Backend process stopped"
}
```

### Step 2: Start Backend Server Again

```powershell
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: ...
📊 Database Name: expenseTrackerDB
✅ Server running on http://localhost:5000
```

### Step 3: Verify It's Working

1. Open browser: http://localhost:5000
2. Should see: `{"message":"✅ Backend API is running..."}`

### Step 4: Clear Browser Cache (Important!)

1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. OR just do a hard refresh: `Ctrl+F5`

### Step 5: Try Login/Registration Again

The CORS errors should be gone now!

## Why This Happens

The CORS configuration was updated in `backend/src/app.js`, but:
- The running server still has the OLD code in memory
- Node.js needs to restart to load the new code
- That's why you MUST restart the server

## Quick Command to Restart

```powershell
# Kill and restart in one go
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force; Start-Sleep -Seconds 2; cd backend; npm start
```

## Still Having Issues?

1. Make sure MongoDB is running
2. Check backend terminal for error messages
3. Verify `.env` file exists in `backend` folder
4. Check browser console (F12) for detailed errors

