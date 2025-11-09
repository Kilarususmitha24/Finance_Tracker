import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  markGoalCompleted
} from "../controllers/goalController.js";

const router = express.Router();

// ✅ Only logged-in user can access these routes
router.use(protect);

router.route("/")
  .post(createGoal)
  .get(getGoals);

router.route("/:id")
  .put(updateGoal)
  .delete(deleteGoal);

// ✅ Mark as completed
router.put("/:id/completed", markGoalCompleted);

export default router;
