import express from "express";
import {
  getReports,
  getReport,
  generateReport,
  downloadReport,
  deleteReport,
} from "../controllers/reportController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Admin only - Specific routes first to avoid conflicts
router.get("/", protect, adminOnly, getReports);
router.post("/generate", protect, adminOnly, generateReport);
router.get("/download/:id", protect, adminOnly, downloadReport);
router.get("/:id", protect, adminOnly, getReport);
router.delete("/:id", protect, adminOnly, deleteReport);

export default router;
