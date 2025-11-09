import API from "./axiosInstance";

export const getAlerts = async () => {
  try {
    const res = await API.get("/alerts");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch alerts";
  }
};

export const markAlertRead = async (id) => {
  try {
    const res = await API.put(`/alerts/${id}/read`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error marking alert as read:", error);
    throw error.response?.data?.message || error.message || "Failed to mark alert as read";
  }
};

export const deleteAlert = async (id) => {
  try {
    const res = await API.delete(`/alerts/${id}`);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error.response?.data?.message || error.message || "Failed to delete alert";
  }
};
