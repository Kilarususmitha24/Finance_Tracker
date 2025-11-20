import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  BarChart as ReportsIcon,
  Person as ProfileIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  AccountBalance as BudgetIcon,
  Flag as GoalsIcon,
  AttachMoney as IncomeIcon,
  Notifications as AlertsIcon,
  CalendarToday as CalendarIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const drawerWidth = 240;

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 FIXED ROLE DETECTION: Always reliable
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || storedUser?.role || "user";
  const isAdminMode = role.toLowerCase() === "admin";

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/user/profile");
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  // User menu
  const userMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/user/dashboard" },
    { text: "Expenses", icon: <ReceiptIcon />, path: "/user/expenses" },
    { text: "Budgets", icon: <WalletIcon />, path: "/user/budgets" },
    { text: "Reports", icon: <ReportsIcon />, path: "/user/reports" },
    { text: "Goals", icon: <GoalsIcon />, path: "/user/goals" },
    { text: "Income", icon: <IncomeIcon />, path: "/user/income" },
    { text: "Alerts", icon: <AlertsIcon />, path: "/user/alerts" },
    { text: "Calendar", icon: <CalendarIcon />, path: "/user/calendar" },
    { text: "Profile", icon: <ProfileIcon />, path: "/user/profile" },
  ];

  // Admin menu
  const adminMenu = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "User Expenses", icon: <ReceiptIcon />, path: "/admin/expenses" },
    { text: "User Budgets", icon: <BudgetIcon />, path: "/admin/budgets" },
    { text: "Manage Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Reports", icon: <AssessmentIcon />, path: "/admin/reports" },
  ];

  const menuItems = isAdminMode ? adminMenu : userMenu;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ======= APP BAR ======= */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: mode === "light" ? theme.palette.primary.main : "#1a1a1a",
          color: "#fff",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isAdminMode ? "👑 Admin Dashboard" : "💰 Finance Tracker"}
          </Typography>

          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === "dark" ? <LightIcon /> : <DarkIcon />}
            </IconButton>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <ProfileIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleProfile}>
                <ProfileIcon sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ======= SIDEBAR ======= */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: mode === "light" ? "#f8fafc" : "#1e1e1e",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ======= MAIN CONTENT ======= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          p: 3,
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
