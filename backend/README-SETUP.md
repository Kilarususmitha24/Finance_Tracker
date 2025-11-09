# Backend Setup Instructions

## Prerequisites
1. **MongoDB** must be installed and running on your system
2. **Node.js** (v14 or higher)

## Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
# JWT Secret for token generation (required)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# MongoDB Connection (optional - defaults to local MongoDB)
MONGO_URI=mongodb://127.0.0.1:27017/expenseTrackerDB

# Server Port (optional - defaults to 5000)
PORT=5000
```

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create `.env` file** (if not exists):
   ```bash
   # Windows PowerShell
   echo "JWT_SECRET=mySecretKey12345678901234567890" > .env
   echo "MONGO_URI=mongodb://127.0.0.1:27017/expenseTrackerDB" >> .env
   echo "PORT=5000" >> .env
   ```

3. **Make sure MongoDB is running:**
   - Windows: Check if MongoDB service is running
   - Or start MongoDB manually

4. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

5. **Verify server is running:**
   - Open browser: http://localhost:5000
   - Should see: `{"message":"✅ Backend API is running..."}`

## Test Registration

You can test registration with these credentials:

**Test User:**
- Name: Test User
- Email: test@example.com
- Password: test123

**Test Admin:**
- Name: Admin User
- Email: admin@example.com
- Password: admin123

## Registration Requirements

- **Name**: Required, minimum 2 characters
- **Email**: Required, must be valid email format, unique
- **Password**: Required, minimum 6 characters
- **Role**: Optional, defaults to "user" (can be "user" or "admin")

## Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Check if port 5000 is available
- Check `.env` file exists and has JWT_SECRET

### Registration failing?
- Check backend server is running (http://localhost:5000)
- Check MongoDB connection
- Check browser console for errors
- Check backend terminal for error messages

### MongoDB connection error?
- Make sure MongoDB is installed and running
- Check MongoDB service status
- Try connecting manually: `mongosh` or `mongo`

