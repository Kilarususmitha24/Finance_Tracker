import Budget from "../models/Budget.js";

// ✅ Create New Budget
export const createBudget = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Validate required fields
    if (!req.body.category || !req.body.budget) {
      return res.status(400).json({
        success: false,
        message: "Category and budget amount are required"
      });
    }

    const budget = await Budget.create({
      category: req.body.category,
      budget: Number(req.body.budget),
      spent: Number(req.body.spent) || 0,
      user: req.user._id,
    });

    console.log("✅ Budget created:", { id: budget._id, category: budget.category });

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error("❌ Error creating budget:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create budget" 
    });
  }
};

// ✅ Get Budgets for logged-in user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
};

// ✅ Update a Budget
export const updateBudget = async (req, res) => {
  try {
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Budget not found" });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Failed to update budget" });
  }
};

// ✅ Delete a Budget
export const deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Budget not found" });

    res.status(200).json({
      success: true,
      message: "Budget deleted",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Failed to delete budget" });
  }
};

// ✅ Mark Budget as Exceeded (optional feature)
export const markAsExceeded = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { exceeded: true },
      { new: true }
    );

    if (!budget)
      return res.status(404).json({ message: "Budget not found" });

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error("Error marking exceeded:", error);
    res.status(500).json({ message: "Failed to mark exceeded" });
  }
};
