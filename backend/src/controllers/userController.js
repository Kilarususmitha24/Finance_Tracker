import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Get single user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// ✅ Update user (Admin or Self)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updateData = { name, email };
    if (role) updateData.role = role; // Only admin controls this

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ success: true, data: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Unable to update user" });
  }
};

// ✅ Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// ✅ CHANGE PASSWORD — required by userRoutes.js
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password" });
  }
};
