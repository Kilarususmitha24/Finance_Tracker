import API from "./axiosInstance";

export const getAllUsers = async () => {
  try {
    const res = await API.get("/admin/users");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch users";
  }
};

export const getUserExpenses = async (userId) => {
  try {
    const res = await API.get(`/admin/user/${userId}/expenses`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch user expenses";
  }
};

export const getUserBudgets = async (userId) => {
  try {
    const res = await API.get(`/admin/user/${userId}/budgets`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching user budgets:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch user budgets";
  }
};

export const getUserReports = async () => {
  try {
    const res = await API.get("/admin/reports");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch reports";
  }
};

export const getUserExpenseChartData = async () => {
  try {
    const res = await API.get("/admin/analytics/expenses-by-user");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching expense chart data:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch expense chart data";
  }
};
