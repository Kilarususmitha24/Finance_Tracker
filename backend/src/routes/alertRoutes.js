import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  createAlert,
  getAlerts,
  deleteAlert,
  markAsRead,
} from "../controllers/alertController.js";

const router = express.Router();

// ✅ Protect all routes
router.use(protect);

// ✅ Routes
router.route("/")
  .post(createAlert)
  .get(getAlerts);

router.route("/:id")
  .delete(deleteAlert);

router.put("/:id/read", markAsRead);

export default router;
