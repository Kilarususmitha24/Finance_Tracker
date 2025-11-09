# Registration Debugging Guide

## If Registration is Failing:

### Step 1: Check Browser Console (F12)
Look for these console messages:
- `📝 Registering user: [email]`
- `📤 Sending registration request: {...}`
- `📥 Registration response received: {...}` OR `❌ Registration error details: {...}`

### Step 2: Check Network Tab (F12 → Network)
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Look for a request to `/api/auth/register`
5. Check:
   - Status code (should be 201 for success, 400 for error)
   - Request payload (should have name, email, password)
   - Response (should have user and token)

### Step 3: Check Backend Terminal
Look for:
- `✅ New user registered: {...}` (success)
- `❌ Error getting users:` (error)
- MongoDB connection errors

### Step 4: Common Issues

#### Issue: "Network Error" or "Failed to fetch"
**Solution:** Backend server is not running
- Start backend: `cd backend && npm start`
- Check: http://localhost:5000

#### Issue: "CORS error"
**Solution:** Backend CORS not configured
- Check `backend/src/app.js` has CORS middleware
- Should allow `http://localhost:3000`

#### Issue: "This email is already registered"
**Solution:** Email already exists in database
- Use a different email
- Or login with existing credentials

#### Issue: "Invalid user data" or validation errors
**Solution:** Check form validation
- Name: minimum 2 characters
- Email: valid email format
- Password: minimum 6 characters

#### Issue: "MongoDB Connection Error"
**Solution:** MongoDB not running
- Start MongoDB service
- Check connection string in `.env`

### Step 5: Test Backend Directly

Test the registration endpoint directly:

```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

If this works, the issue is in the frontend.
If this fails, the issue is in the backend.

### Step 6: Check Environment Variables

Backend needs:
- `JWT_SECRET` in `.env` file
- `MONGO_URI` (optional, defaults to local MongoDB)

Frontend needs:
- Backend URL: `http://localhost:5000/api` (in `axiosInstance.js`)

