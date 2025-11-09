import API from "./axiosInstance";

/**
 * Fetch full analytics summary
 * Includes:
 * - income, expense, savings
 * - savings rate
 * - income-expense ratio
 * - category totals
 * - risk index
 * - recommendations
 * - monthly trend
 * - forecast (next month, 3 months)
 */
export const fetchAnalytics = async () => {
  try {
    const res = await API.get("/analytics");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Analytics fetch error:", error);
    throw error.response?.data?.message || error.message || "Failed to load analytics";
  }
};

/**
 * Fetch monthly trend only
 */
export const fetchMonthlyTrend = async () => {
  try {
    const res = await API.get("/analytics");
    const data = res.data.data || res.data;
    return data?.monthlyTrend || {};
  } catch (error) {
    console.error("Monthly trend error:", error);
    throw error.response?.data?.message || error.message || "Failed to load monthly trend";
  }
};

/**
 * Fetch only category totals
 */
export const fetchCategorySummary = async () => {
  try {
    const res = await API.get("/analytics");
    const data = res.data.data || res.data;
    return data?.categoryTotals || {};
  } catch (error) {
    console.error("Category summary error:", error);
    throw error.response?.data?.message || error.message || "Failed to load category summary";
  }
};

/**
 * Fetch spending forecast
 */
export const fetchForecast = async () => {
  try {
    const res = await API.get("/analytics");
    const data = res.data.data || res.data;
    return data?.forecast || {};
  } catch (error) {
    console.error("Forecast error:", error);
    throw error.response?.data?.message || error.message || "Failed to load forecast";
  }
};

/**
 * Financial Health Score
 */
export const fetchFinancialHealth = async () => {
  try {
    const res = await API.get("/analytics");
    const data = res.data.data || res.data;

    const score = Math.round(
      (data.savingsRate * 0.5 +
        (1 - data.expenseToIncomeRatio) * 50 +
        (1 - data.topCategoryExpense) * 30)
    );

    return {
      score: Math.min(100, Math.max(0, score)),
      savingsRate: data.savingsRate,
      expenseToIncomeRatio: data.expenseToIncomeRatio,
      topCategoryExpense: data.topCategoryExpense,
    };

  } catch (error) {
    console.error("Financial health error:", error);
    throw error.response?.data?.message || error.message || "Failed to load financial health score";
  }
};

export default {
  fetchAnalytics,
  fetchMonthlyTrend,
  fetchCategorySummary,
  fetchForecast,
  fetchFinancialHealth,
};
