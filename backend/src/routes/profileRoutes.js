import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  updatePassword
} from "../controllers/profileController.js";

const router = express.Router();

// ✅ Protect all profile routes
router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", updatePassword);

export default router;
