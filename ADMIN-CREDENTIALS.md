# 🔐 Admin Login Credentials

## Default Admin Credentials

After running the admin creation script, use these credentials to login:

**Email:** `admin@example.com`  
**Password:** `admin123`  
**Role:** Admin

## How to Create Admin User

### Option 1: Using npm script (Recommended)

1. Make sure backend server is **NOT running** (or run in a separate terminal)
2. Make sure MongoDB is running
3. Run the script:

```bash
cd backend
npm run create-admin
```

### Option 2: Direct Node command

```bash
cd backend
node create-admin.js
```

## What the Script Does

- ✅ Connects to MongoDB
- ✅ Checks if admin user already exists
- ✅ Creates admin user with email: `admin@example.com`
- ✅ Sets password: `admin123`
- ✅ Sets role: `admin`

If the user already exists, it will update their role to admin.

## After Creating Admin

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Login with admin credentials:**
   - Go to: http://localhost:3000/login
   - Email: `admin@example.com`
   - Password: `admin123`
   - Login as: Select **"Admin"**
   - Click "Sign In"

3. **You'll be redirected to:** `/admin/dashboard`

## Create Custom Admin User

If you want to create an admin with different credentials, you can modify `backend/create-admin.js`:

```javascript
const adminEmail = "your-email@example.com";
const adminPassword = "your-password";
const adminName = "Your Name";
```

Then run: `npm run create-admin`

## Security Note

⚠️ **For production**, change the default admin password immediately after first login!

## Troubleshooting

### "MongoDB Connection Error"
- Make sure MongoDB is running
- Check connection string in `.env` file

### "User already exists"
- The script will update the existing user to admin role
- You can still use the same credentials

### "Cannot find module"
- Make sure you're in the `backend` directory
- Run `npm install` if dependencies are missing

