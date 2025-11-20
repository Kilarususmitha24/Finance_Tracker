import API from "./axiosInstance";

// LOGIN USER
export const login = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Login failed";
    throw new Error(msg);
  }
};

// REGISTER USER
export const register = async (userData) => {
  try {
    console.log("📤 Sending registration request:", userData);
    const response = await API.post("/auth/register", userData);
    console.log("📥 Registration response received:", response.data);

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

    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Registration failed";

    throw new Error(msg);
  }
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  try {
    const response = await API.get("/auth/me");
    return response.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch user data";
    throw new Error(msg);
  }
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
