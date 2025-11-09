import API from "./axiosInstance";

// ✅ LOGIN USER
export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });

    // Save token & user info to localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.message || error.message || "Login failed";
  }
};

// ✅ REGISTER USER
export const register = async (userData) => {
  try {
    console.log("📤 Sending registration request:", userData);
    const response = await API.post("/auth/register", userData);
    console.log("📥 Registration response received:", response.data);

    // Save token & user info to localStorage (same as login)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("❌ Registration error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      statusText: error.response?.statusText,
    });
    
    // Extract error message from various possible locations
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      "Registration failed. Please check your connection and try again.";
    
    throw new Error(errorMessage);
  }
};

// ✅ GET CURRENT USER (Protected)
export const getCurrentUser = async () => {
  try {
    const response = await API.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error.response?.data?.message || error.message || "Failed to fetch user data";
  }
};

// ✅ LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
