import express from "express";
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  markAsRecurring,
} from "../controllers/expenseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Protect all expense routes (only logged-in users)
router.use(protect);

// ✅ CRUD Routes
router.route("/")
  .get(getExpenses)
  .post(createExpense);

router.route("/:id")
  .put(updateExpense)
  .delete(deleteExpense);

// ✅ Mark expense as recurring
router.put("/:id/recurring", markAsRecurring);

export default router;
