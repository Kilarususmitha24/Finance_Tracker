import express from "express";
import {
  getAllUsers,
  getUserExpenses,
  getUserBudgets,
  getUserReports,
  getExpensesByUserChart,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ ADMIN ROUTES (protected + must be admin)
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/user/:id/expenses", protect, adminOnly, getUserExpenses);
router.get("/user/:id/budgets", protect, adminOnly, getUserBudgets);

router.get("/reports", protect, adminOnly, getUserReports);

// ✅ Bar chart data
router.get("/analytics/expenses-by-user", protect, adminOnly, getExpensesByUserChart);

export default router;
