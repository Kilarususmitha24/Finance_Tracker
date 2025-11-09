import Goal from "../models/Goal.js";

// ✅ Create Goal
export const createGoal = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    // Validate required fields
    if (!req.body.title || !req.body.targetAmount || !req.body.deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, target amount, and deadline are required"
      });
    }

    const goal = await Goal.create({
      title: req.body.title,
      targetAmount: Number(req.body.targetAmount),
      savedAmount: Number(req.body.savedAmount) || 0,
      deadline: new Date(req.body.deadline),
      completed: req.body.completed || false,
      user: req.user._id,
    });

    console.log("✅ Goal created:", { id: goal._id, title: goal.title });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    console.error("❌ Create Goal Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create goal" 
    });
  }
};

// ✅ Get all goals for user
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    console.error("Get Goals Error:", error);
    res.status(500).json({ message: "Failed to fetch goals" });
  }
};

// ✅ Update Goal
export const updateGoal = async (req, res) => {
  try {
    const updated = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Goal Error:", error);
    res.status(500).json({ message: "Failed to update goal" });
  }
};

// ✅ Delete Goal
export const deleteGoal = async (req, res) => {
  try {
    const deleted = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ success: true, message: "Goal deleted" });
  } catch (error) {
    console.error("Delete Goal Error:", error);
    res.status(500).json({ message: "Failed to delete goal" });
  }
};

// ✅ Mark Goal Completed
export const markGoalCompleted = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { completed: true },
      { new: true }
    );

    if (!goal)
      return res.status(404).json({ message: "Goal not found" });

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    console.error("Complete Goal Error:", error);
    res.status(500).json({ message: "Failed to mark goal completed" });
  }
};
