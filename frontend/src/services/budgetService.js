import API from "./axiosInstance";

export const getBudgets = async () => {
  try {
    const res = await API.get("/budgets");
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error fetching budgets:', error);
    throw error.response?.data?.message || error.message || "Failed to fetch budgets";
  }
};

export const addBudget = async (data) => {
  try {
    const res = await API.post("/budgets", data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error adding budget:', error);
    throw error.response?.data?.message || error.message || "Failed to add budget";
  }
};

export const updateBudget = async (id, data) => {
  try {
    const res = await API.put(`/budgets/${id}`, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error.response?.data?.message || error.message || "Failed to update budget";
  }
};

export const deleteBudget = async (id) => {
  try {
    const res = await API.delete(`/budgets/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error.response?.data?.message || error.message || "Failed to delete budget";
  }
};
