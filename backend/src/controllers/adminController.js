import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";


// ✅ 1. Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id name email createdAt");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("❌ Error getting users:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch users" });
  }
};


// ✅ 2. Get Expenses of a Particular User
export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.params.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    console.error("❌ Error getting user expenses:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch user expenses" });
  }
};


// ✅ 3. Get Budgets of a User
export const getUserBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.params.id });

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error("❌ Error getting user budgets:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch user budgets" });
  }
};


// ✅ 4. Generate Report: Utilization + Total Spending
export const getUserReports = async (req, res) => {
  try {
    const users = await User.find({}, "_id name");

    let report = [];

    for (const user of users) {
      const expenses = await Expense.find({ user: user._id });
      const budgets = await Budget.find({ user: user._id });

      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
      const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);

      const utilization =
        totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;

      report.push({
        userId: user._id,
        name: user.name,
        totalSpent,
        totalBudget,
        utilization,
      });
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("❌ Error generating reports:", error);
    res.status(500).json({ message: error.message || "Failed to generate reports" });
  }
};



// ✅ 5. Analytics: Total expenses of all users (Bar chart)
export const getExpensesByUserChart = async (req, res) => {
  try {
    const users = await User.find({}, "_id name");

    const chartData = [];

    for (const user of users) {
      const expenses = await Expense.find({ user: user._id });
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

      chartData.push({
        name: user.name,
        totalSpent,
      });
    }

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error("❌ Analytics Chart Error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch chart data" });
  }
};
