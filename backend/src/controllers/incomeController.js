import Income from "../models/Income.js";
import { incomeSchema } from "../validators/incomeValidator.js";

// ✅ Generate next recurrence date
const getNextRecurrenceDate = (recurrence) => {
  const date = new Date();

  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
};

// ✅ Create Income
export const createIncome = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Remove any fields that shouldn't be in the request (like id)
    const { id, _id, user, ...cleanBody } = req.body;
    
    const { error } = incomeSchema.validate(cleanBody);
    if (error) {
      return res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }

    let income = await Income.create({
      source: cleanBody.source,
      amount: Number(cleanBody.amount),
      category: cleanBody.category,
      date: cleanBody.date ? new Date(cleanBody.date) : new Date(),
      notes: cleanBody.notes || "",
      status: cleanBody.status || "pending",
      isRecurring: cleanBody.isRecurring || false,
      recurrence: cleanBody.recurrence || "none",
      user: req.user._id,
      nextRecurrenceDate:
        cleanBody.isRecurring && cleanBody.recurrence !== "none"
          ? getNextRecurrenceDate(cleanBody.recurrence)
          : null,
    });

    console.log("✅ Income created:", { id: income._id, amount: income.amount });

    res.status(201).json({
      success: true,
      data: income,
    });
  } catch (err) {
    console.error("❌ Error creating income:", err);
    res.status(500).json({ 
      success: false,
      message: err.message || "Failed to create income" 
    });
  }
};

// ✅ Get all incomes for logged user
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      data: incomes,
    });
  } catch (err) {
    console.error("Error fetching incomes:", err);
    res.status(500).json({ message: err.message || "Failed to fetch incomes" });
  }
};

// ✅ Update Income
export const updateIncome = async (req, res) => {
  try {
    const { error } = incomeSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...req.body,
        nextRecurrenceDate:
          req.body.isRecurring && req.body.recurrence !== "none"
            ? getNextRecurrenceDate(req.body.recurrence)
            : null,
      },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (err) {
    console.error("Error updating income:", err);
    res.status(500).json({ message: err.message || "Failed to update income" });
  }
};

// ✅ Delete Income
export const deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting income:", err);
    res.status(500).json({ message: err.message || "Failed to delete income" });
  }
};

// ✅ Mark as received
export const markAsReceived = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "received" },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      data: income,
      message: "Income marked as received",
    });
  } catch (err) {
    console.error("Error marking income as received:", err);
    res.status(500).json({ message: err.message || "Failed to mark income as received" });
  }
};
