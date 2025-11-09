import API from "./axiosInstance";

/**
 * ✅ Get user profile
 */
export const getProfile = async () => {
  try {
    const res = await API.get("/profile");
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch profile";
  }
};

/**
 * ✅ Update user profile
 */
export const updateProfile = async (profileData) => {
  try {
    const res = await API.put("/profile", profileData);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data?.message || error.message || "Failed to update profile";
  }
};

/**
 * ✅ Update user password
 */
export const updatePassword = async (passwordData) => {
  try {
    const res = await API.put("/profile/password", passwordData);
    return res.data.data || res.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error.response?.data?.message || error.message || "Failed to update password";
  }
};

