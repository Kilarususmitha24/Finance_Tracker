import express from "express";
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Protect all routes
router.use(protect);

// ✅ Create & Get Budgets
router.route("/")
  .post(createBudget)
  .get(getBudgets);

// ✅ Update & Delete
router.route("/:id")
  .put(updateBudget)
  .delete(deleteBudget);

export default router;
