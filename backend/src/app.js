import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables from .env

// ✅ Import All Routes
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

// ✅ Admin Routes
import adminRoutes from "./routes/adminRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// ✅ Create App
const app = express();

// ✅ CORS Configuration - Must be before other middlewares
// For development: Allow all origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  console.log(`🌐 CORS Request: ${req.method} ${req.path} from origin: ${origin || 'none'}`);
  
  // Allow all origins in development
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Expose-Headers", "Authorization");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log(`✅ CORS Preflight handled for ${req.path}`);
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/incomes", incomeRoutes);  // ✅ plural for consistency
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/users", userRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend API is running..." });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  
  // Don't send response if headers already sent (CORS might have sent them)
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;
