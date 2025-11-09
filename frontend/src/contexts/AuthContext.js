import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, getCurrentUser } from "../services/authService";
import { updateProfile as updateProfileService } from "../services/profileService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Safely parse user from localStorage
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
    }
    return null;
  };

  const [user, setUser] = useState(getUserFromStorage());
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from backend on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          const userObj = userData.user || userData.data || userData;
          setUser(userObj);
          setToken(storedToken);
          // Update localStorage with fresh user data
          if (userObj) {
            localStorage.setItem("user", JSON.stringify(userObj));
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          // Token might be invalid, clear it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      } else {
        // No token, ensure user is also null
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ✅ Login - Update context with user data (token/user already in localStorage from authService)
  const loginUser = async (userData) => {
    try {
      // Get the token and user from localStorage (set by authService)
      const storedToken = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');
      
      // Use provided userData first, then fallback to stored user
      let userObj = userData;
      if (!userObj && storedUserStr) {
        try {
          userObj = JSON.parse(storedUserStr);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          localStorage.removeItem('user');
        }
      }

      if (!storedToken) {
        console.error('Login failed - no token found in localStorage');
        throw new Error('Login failed - no token found');
      }

      if (!userObj) {
        console.error('Login failed - no user data found');
        throw new Error('Login failed - no user data found');
      }

      // Update state synchronously - this triggers re-render
      setToken(storedToken);
      setUser(userObj);
      setLoading(false); // Ensure loading is false after login

      console.log('✅ AuthContext updated successfully:', { 
        userId: userObj._id || userObj.id, 
        email: userObj.email, 
        role: userObj.role 
      });

      // Return the user and token for consistency
      return { user: userObj, token: storedToken };
    } catch (error) {
      console.error('❌ Error in loginUser:', error);
      setLoading(false);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  // ✅ Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await updateProfileService(profileData);
      const userData = updatedUser.user || updatedUser;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    currentUser: user,
    token,
    loading,
    login: loginUser,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook
export const useAuth = () => useContext(AuthContext);
