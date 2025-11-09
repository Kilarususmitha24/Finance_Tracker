# 💰 Finance Tracker - Expense Management System

A full-stack expense tracking application built with React (Frontend) and Node.js/Express (Backend) with MongoDB database.

## 🚀 Features

- **User Authentication**: Secure login/registration with JWT tokens
- **Role-Based Access**: Separate dashboards for Users and Admins
- **Expense Management**: Add, edit, delete, and track expenses
- **Income Tracking**: Record and manage income sources
- **Budget Management**: Set budgets by category and track spending
- **Goals**: Set financial goals and track progress
- **Reports & Analytics**: Generate reports and view spending analytics
- **Alerts**: Get notified about budget limits and spending patterns
- **Calendar View**: View expenses and income in calendar format

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/Kilarususmitha24/Finance_Tracker.git
cd Finance_Tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your_super_secret_jwt_key_here
MONGO_URI=mongodb://127.0.0.1:27017/expenseTrackerDB
PORT=5000
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

## 🔐 Default Admin Credentials

After setting up, create an admin user:
```bash
cd backend
npm run create-admin
```

Default admin credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## 📁 Project Structure

```
Finance_Tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & validation
│   │   └── services/        # Business logic
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── styles/          # CSS files
│   └── public/
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/incomes` - Get all incomes
- `POST /api/incomes` - Create income
- `PUT /api/incomes/:id` - Update income
- `DELETE /api/incomes/:id` - Delete income

### Budgets
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Admin (Admin only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/reports` - Get all reports
- `GET /api/admin/user/:id/expenses` - Get user expenses
- `GET /api/admin/user/:id/budgets` - Get user budgets

## 🧪 Testing

### Test Registration
- **Name**: Test User
- **Email**: test@example.com
- **Password**: test123

### Test Admin Login
- **Email**: admin@example.com
- **Password**: admin123

## 🐛 Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Verify `.env` file exists with `JWT_SECRET`
- Check if port 5000 is available

### CORS errors?
- Ensure backend server is running
- Restart backend server after CORS changes
- Check `backend/src/app.js` CORS configuration

### Database connection issues?
- Verify MongoDB is running
- Check `MONGO_URI` in `.env` file
- Ensure MongoDB service is started

## 📝 License

This project is open source and available under the MIT License.

## 👥 Contributors

- Kilarususmitha24

## 📧 Support

For issues and questions, please open an issue on GitHub.

