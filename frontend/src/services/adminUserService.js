import API from "./axiosInstance";

/** ✅ Fetch all users */
export const fetchUsers = async () => {
  try {
    const res = await API.get("/admin/users");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch users";
  }
};

/** ✅ Update a user */
export const updateUser = async (id, userData) => {
  try {
    const res = await API.put(`/admin/users/${id}`, userData);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error.response?.data?.message || error.message || "Failed to update user";
  }
};

/** ✅ Delete a user */
export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/admin/users/${id}`);
    return res.data.message || res.data.data?.message || "User deleted successfully";
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error.response?.data?.message || error.message || "Failed to delete user";
  }
};

