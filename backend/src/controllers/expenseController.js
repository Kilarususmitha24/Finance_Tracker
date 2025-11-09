import asyncHandler from "express-async-handler";
import Expense from "../models/Expense.js";

// ✅ Create Expense
export const createExpense = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    console.log("📥 Received expense data:", req.body);

    // Remove any fields that shouldn't be in the request (like id, _id, user)
    const { id, _id, user, ...cleanBody } = req.body;

    // Validate required fields
    if (!cleanBody.description && !cleanBody.title) {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }

    if (!cleanBody.amount || isNaN(Number(cleanBody.amount))) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }

    if (!cleanBody.category) {
      return res.status(400).json({
        success: false,
        message: "Category is required"
      });
    }

    // Parse date - handle both Date objects and date strings
    let expenseDate;
    if (cleanBody.date) {
      expenseDate = new Date(cleanBody.date);
      if (isNaN(expenseDate.getTime())) {
        expenseDate = new Date();
      }
    } else {
      expenseDate = new Date();
    }

    // Ensure description is always set (required field)
    const description = cleanBody.description || cleanBody.title || "";
    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }

    const expenseData = {
      description: description.trim(), // Primary field - always required
      title: (cleanBody.title || description || "").trim(), // Always provide title (fallback to description)
      amount: Number(cleanBody.amount),
      category: cleanBody.category,
      paymentMethod: cleanBody.paymentMethod || "Cash",
      date: expenseDate,
      notes: (cleanBody.notes || "").trim(),
      user: req.user._id,
    };

    // Ensure title is never undefined or empty (for backward compatibility)
    if (!expenseData.title || expenseData.title === "") {
      expenseData.title = expenseData.description;
    }

    console.log("📤 Creating expense with data:", expenseData);

    const expense = await Expense.create(expenseData);

    console.log("✅ Expense created successfully:", { id: expense._id, amount: expense.amount });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message).join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages}`
      });
    }

    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create expense" 
    });
  }
});

// ✅ Get All Expenses for Logged-In User
export const getExpenses = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// ✅ Update Expense
export const updateExpense = asyncHandler(async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// ✅ Delete Expense
export const deleteExpense = asyncHandler(async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

// ✅ Mark as Recurring
export const markAsRecurring = asyncHandler(async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRecurring: true },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Marked as recurring",
      data: expense,
    });
  } catch (error) {
    console.error("Error marking expense recurring:", error);
    res.status(500).json({ message: "Failed to mark as recurring" });
  }
});
