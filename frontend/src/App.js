import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";

// Layouts
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import Dashboard from "./pages/user/Dashboard";
import Expenses from "./pages/user/Expenses";
import Budgets from "./pages/user/Budgets";
import Reports from "./pages/user/Reports";
import Profile from "./pages/user/Profile";
import Income from "./pages/user/Income";
import CalendarView from "./pages/user/CalendarView";
import Alerts from "./pages/user/Alerts";
import Goals from "./pages/user/Goals";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageReports from "./pages/admin/ManageReports";
import UserBudgets from "./pages/admin/UserBudgets";
import UserExpenses from "./pages/admin/UserExpenses";

import Unauthorized from "./pages/Unauthorized";


// =========================
// ✅ Role-Based Protected Route
// =========================
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Check localStorage as fallback (for immediate redirects after login)
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const storedUser = getUserFromStorage();
  const currentUser = user || storedUser;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    // not logged in - redirect to login
    console.log("🔒 ProtectedRoute: No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && String(currentUser.role).toLowerCase() !== String(role).toLowerCase()) {
    // wrong role (case-insensitive comparison)
    console.log(`🔒 ProtectedRoute: Role mismatch. Required: ${role}, User role: ${currentUser.role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ ProtectedRoute: Access granted", { role: currentUser.role, requiredRole: role });
  return children;
};


// =========================
// ✅ Final App Component
// =========================
function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme.mode}`}>
      <Routes>

              {/* -------------------- Public Routes -------------------- */}
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
              </Route>
              
              {/* Login and Register pages (no layout wrapper) */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* -------------------- User Routes -------------------- */}
              <Route
                path="/user/*"
                element={
                  <ProtectedRoute role="user">
                    <MainLayout>
                      <Routes>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="expenses" element={<Expenses />} />
                        <Route path="budgets" element={<Budgets />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="income" element={<Income />} />
                        <Route path="calendar" element={<CalendarView />} />
                        <Route path="alerts" element={<Alerts />} />
                        <Route path="goals" element={<Goals />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* -------------------- Admin Routes -------------------- */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute role="admin">
                    <MainLayout isAdmin={true}>
                      <Routes>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="reports" element={<ManageReports />} />
                        <Route path="budgets" element={<UserBudgets />} />
                        <Route path="expenses" element={<UserExpenses />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Unauthorized & Fallback */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  );
}

export default App;
