import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ API: /api/admin/users
router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
