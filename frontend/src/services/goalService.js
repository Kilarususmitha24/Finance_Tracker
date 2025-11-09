import API from "./axiosInstance";

export const getGoals = async () => {
  try {
    const res = await API.get("/goals");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch goals";
  }
};

export const createGoal = async (data) => {
  try {
    const res = await API.post("/goals", data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw error.response?.data?.message || error.message || "Failed to create goal";
  }
};

export const updateGoal = async (id, data) => {
  try {
    const res = await API.put(`/goals/${id}`, data);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error.response?.data?.message || error.message || "Failed to update goal";
  }
};

export const deleteGoal = async (id) => {
  try {
    const res = await API.delete(`/goals/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error.response?.data?.message || error.message || "Failed to delete goal";
  }
};

export const markGoalCompleted = async (id) => {
  try {
    const res = await API.put(`/goals/${id}/completed`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error marking goal as completed:", error);
    throw error.response?.data?.message || error.message || "Failed to mark goal as completed";
  }
};

export const contributeToGoal = async (id, amount) => {
  try {
    const res = await API.post(`/goals/${id}/contribute`, { amount });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error contributing to goal:", error);
    throw error.response?.data?.message || error.message || "Failed to contribute to goal";
  }
};
