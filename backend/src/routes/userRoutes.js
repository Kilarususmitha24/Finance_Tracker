import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword
} from "../controllers/userController.js";

const router = express.Router();

// ✅ Admin: Get all users
router.get("/", protect, adminOnly, getAllUsers);

// ✅ Logged-in user: change password
router.put("/change-password", protect, changePassword);

// ✅ Admin: manage specific users
router
  .route("/:id")
  .get(protect, adminOnly, getUser)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

export default router;
