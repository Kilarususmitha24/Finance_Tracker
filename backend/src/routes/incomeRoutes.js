import express from "express";
import {
  createIncome,
  getIncomes,
  updateIncome,
  deleteIncome,
  markAsReceived,
} from "../controllers/incomeController.js";
import { protect } from "../middlewares/authMiddleware.js"; // ✅ Import only once

const router = express.Router();

// ✅ All income routes require login
router.use(protect);

// ✅ Get all incomes / Add new income
router.route("/")
  .get(getIncomes)
  .post(createIncome);

// ✅ Update or Delete income by ID
router.route("/:id")
  .put(updateIncome)
  .delete(deleteIncome);

// ✅ Mark an income as received
router.put("/:id/mark-received", markAsReceived);

export default router;
