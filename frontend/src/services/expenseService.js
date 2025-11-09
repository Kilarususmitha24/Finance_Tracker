import API from "./axiosInstance";

export const getExpenses = async () => {
  try {
    const res = await API.get("/expenses");
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error.response?.data?.message || error.message || "Failed to fetch expenses";
  }
};

export const addExpense = async (data) => {
  try {
    const res = await API.post("/expenses", data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error.response?.data?.message || error.message || "Failed to add expense";
  }
};

export const updateExpense = async (id, data) => {
  try {
    const res = await API.put(`/expenses/${id}`, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error.response?.data?.message || error.message || "Failed to update expense";
  }
};

export const deleteExpense = async (id) => {
  try {
    const res = await API.delete(`/expenses/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error.response?.data?.message || error.message || "Failed to delete expense";
  }
};
