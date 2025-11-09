import Transaction from "../models/Transaction.js";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

/* ------------------------------
    Helper: Group by Month
--------------------------------*/
const groupByMonth = (transactions) => {
  const months = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!months[key]) months[key] = { income: 0, expense: 0 };

    months[key][tx.type] += tx.amount;
  });

  return months;
};

/* ------------------------------
    Forecast (Simple Linear Trend)
--------------------------------*/
const forecastTrend = (monthly) => {
  const values = Object.values(monthly).map((m) => m.expense);
  if (values.length < 2) return { nextMonth: values.at(-1) || 0 };

  const last = values.at(-1);
  const secondLast = values.at(-2);

  const growthRate = last - secondLast;

  return {
    nextMonth: Math.round(last + growthRate),
    in3Months: Math.round(last + growthRate * 3),
    trend: growthRate > 0 ? "upward" : "downward"
  };
};

/* ------------------------------
    Category Spend Risk
--------------------------------*/
const computeRisk = (categories) => {
  const risks = {};

  Object.entries(categories).forEach(([cat, amt]) => {
    if (amt > 20000) risks[cat] = "High";
    else if (amt > 10000) risks[cat] = "Medium";
    else risks[cat] = "Low";
  });

  return risks;
};

/* ------------------------------
    AI Recommendations
--------------------------------*/
const generateRecommendations = (analytics) => {
  const r = [];

  if (analytics.forecast.nextMonth > analytics.monthlyAvgExpense)
    r.push("Your spending is trending upward — consider reviewing high-expense categories.");

  if (analytics.savingsRate < 20)
    r.push("Increase your savings rate to at least 20% to improve financial health.");

  if (analytics.expenseToIncomeRatio > 0.7)
    r.push("Expenses exceed 70% of income. Reduce discretionary spend.");

  if (analytics.topCategoryExpense > 0.35)
    r.push("One category makes up more than 35% of your spending — diversify your expenses.");

  return r;
};

/* ------------------------------
    MAIN ANALYTICS GENERATOR
--------------------------------*/
export const generateAnalytics = async (userId) => {
  const last6Months = subMonths(new Date(), 6);

  const transactions = await Transaction.find({
    userId,
    date: { $gte: last6Months }
  }).sort({ date: 1 });

  if (!transactions.length) return { message: "No data" };

  // Group by month
  const monthly = groupByMonth(transactions);
  
  // Category Summary
  const categoryTotals = {};
  transactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  // Totals
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const savings = income - expense;
  const savingsRate = income === 0 ? 0 : Math.round((savings / income) * 100);

  // Ratios
  const expenseToIncomeRatio = income === 0 ? 0 : +(expense / income).toFixed(2);

  // Trend Forecast
  const forecast = forecastTrend(monthly);

  // Monthly averages
  const monthlyAvgExpense = Math.round(expense / Object.keys(monthly).length);

  // Top Category %
  const topCategoryExpense = Math.max(...Object.values(categoryTotals)) / expense;

  // Category risk evaluation
  const riskIndex = computeRisk(categoryTotals);

  // Generate AI Recommendations
  const recommendations = generateRecommendations({
    savingsRate,
    expenseToIncomeRatio,
    monthlyAvgExpense,
    forecast,
    topCategoryExpense
  });

  return {
    summary: {
      income,
      expense,
      savings,
      savingsRate,
      expenseToIncomeRatio
    },

    forecast,

    monthlyTrend: monthly,

    categoryTotals,

    riskIndex,

    recommendations
  };
};
