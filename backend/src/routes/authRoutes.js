import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🟢 Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔒 Protected route - Get logged-in user info
router.get("/me", protect, getUserProfile);

export default router;
