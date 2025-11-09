// frontend/src/services/incomeService.js
import API from "./axiosInstance";

/**
 * ✅ Get all income records
 */
export const getIncomes = async () => {
  try {
    const res = await API.get("/incomes");
    return res.data.data || res.data;
  } catch (error) {
    console.error("❌ Error fetching incomes:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch incomes";
  }
};

/**
 * ✅ Create a new income record
 */
export const createIncome = async (data) => {
  try {
    const res = await API.post("/incomes", data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("❌ Error adding income:", error);
    throw error.response?.data?.message || error.message || "Failed to add income";
  }
};

// Alias for backward compatibility
export const addIncome = createIncome;

/**
 * ✅ Update income by ID
 */
export const updateIncome = async (id, data) => {
  try {
    const res = await API.put(`/incomes/${id}`, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("❌ Error updating income:", error);
    throw error.response?.data?.message || error.message || "Failed to update income";
  }
};

/**
 * ✅ Delete income by ID
 */
export const deleteIncome = async (id) => {
  try {
    const res = await API.delete(`/incomes/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("❌ Error deleting income:", error);
    throw error.response?.data?.message || error.message || "Failed to delete income";
  }
};

/**
 * ✅ Mark income as received
 * Will try /mark-received endpoint first, else fall back to PUT
 */
export const markIncomeAsReceived = async (id) => {
  try {
    const res = await API.put(`/incomes/${id}/mark-received`);
    return res.data.data || res.data;
  } catch (error) {
    console.warn("⚠️ mark-received route failed, falling back to manual patch...");
    try {
      const res = await API.put(`/incomes/${id}`, { status: "received" });
      return res.data.data || res.data;
    } catch (err) {
      console.error("❌ Error marking income as received:", err);
      throw err.response?.data?.message || err.message || "Failed to mark income as received";
    }
  }
};
