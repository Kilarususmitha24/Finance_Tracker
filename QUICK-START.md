# 🚀 Quick Start Guide - Registration & Login

## ⚠️ IMPORTANT: Backend Server Must Be Running!

Registration will **NOT work** if the backend server is not running.

## Step 1: Start Backend Server

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: ...
📊 Database Name: expenseTrackerDB
✅ Server running on http://localhost:5000
```

## Step 2: Start Frontend (in a separate terminal)

```bash
cd frontend
npm start
```

## Step 3: Test Registration

### Registration Requirements:
- **Name**: Any name (minimum 2 characters)
- **Email**: Valid email format (e.g., `user@example.com`)
- **Password**: Minimum 6 characters

### Test Credentials You Can Use:

#### Regular User:
- **Name**: `John Doe`
- **Email**: `john@example.com`
- **Password**: `password123`

#### Admin User:
- **Name**: `Admin User`
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Step 4: Login After Registration

After successful registration, you'll be redirected to the login page.

Use the same email and password you registered with:
- **Email**: (the email you registered with)
- **Password**: (the password you registered with)
- **Login as**: Select "User" or "Admin" based on your role

## Troubleshooting

### ❌ "Registration failed" error?

1. **Check if backend is running:**
   - Open: http://localhost:5000
   - Should see: `{"message":"✅ Backend API is running..."}`

2. **Check MongoDB is running:**
   - Windows: Check Services for "MongoDB"
   - Or start MongoDB manually

3. **Check browser console:**
   - Press F12 → Console tab
   - Look for error messages

4. **Check backend terminal:**
   - Look for error messages in the terminal where backend is running

### ❌ "This email is already registered"?

- The email you're trying to use is already in the database
- Use a different email or login with existing credentials

### ❌ Backend won't start?

1. Check if port 5000 is in use:
   ```powershell
   Get-NetTCPConnection -LocalPort 5000
   ```

2. Check if MongoDB is running:
   ```powershell
   Get-Service MongoDB
   ```

3. Check `.env` file exists in `backend` folder with `JWT_SECRET`

## Need Help?

1. Make sure both backend and frontend are running
2. Check browser console (F12) for errors
3. Check backend terminal for error messages
4. Verify MongoDB is running

