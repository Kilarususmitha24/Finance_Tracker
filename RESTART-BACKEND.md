# 🔄 How to Restart Backend Server

## The Problem
Your backend server is running but needs to be restarted to apply the CORS fixes.

## Solution: Restart the Backend Server

### Option 1: Using PowerShell (Recommended)

1. **Find the backend terminal window** where the server is running
2. **Press `Ctrl+C`** to stop the server
3. **Start it again:**
   ```powershell
   cd backend
   npm start
   ```

### Option 2: Kill and Restart

If you can't find the terminal, kill the process and restart:

```powershell
# Kill the process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Then start the server
cd backend
npm start
```

### Option 3: Use the Startup Script

```powershell
cd backend
.\start-server.ps1
```

## Verify Server is Running

After restarting, you should see:
```
✅ MongoDB Connected: ...
📊 Database Name: expenseTrackerDB
✅ Server running on http://localhost:5000
```

Test it:
- Open: http://localhost:5000
- Should see: `{"message":"✅ Backend API is running..."}`

## After Restart

1. **Clear browser cache** (optional):
   - Press `Ctrl+Shift+Delete`
   - Or hard refresh: `Ctrl+F5`

2. **Try registration again** - CORS errors should be gone!

## What Changed

The CORS configuration was updated to:
- ✅ Handle preflight OPTIONS requests properly
- ✅ Allow all origins in development
- ✅ Set proper CORS headers
- ✅ Return status 200 for OPTIONS (instead of 204)

The server MUST be restarted for these changes to take effect!

