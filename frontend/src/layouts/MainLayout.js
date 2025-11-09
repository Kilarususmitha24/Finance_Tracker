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

export default function MainLayout({ children, isAdmin = false }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, mode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're in admin mode (either from props or user role)
  const isAdminMode = isAdmin || user?.role === 'admin';

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    // Check if we're already on the profile page to prevent unnecessary navigation
    if (location.pathname !== '/user/profile') {
      navigate("/user/profile");
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  // Sidebar menu items for users
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

  // Sidebar menu items for admins
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
          color: "#ffffff",
          backgroundImage: 'none',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
          transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Toolbar sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            {isAdminMode ? '👑 Admin Dashboard' : '💰 Finance Tracker'}
          </Typography>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Theme Toggle Button */}
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{ color: "#ffffff" }}
            >
              {mode === "dark" ? <LightIcon /> : <DarkIcon />}
            </IconButton>

            {/* Profile Menu */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <ProfileIcon sx={{ color: "#ffffff" }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  bgcolor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                  color: mode === 'light' ? '#111827' : '#e5e5e5',
                  border: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}`,
                  '& .MuiMenuItem-root': {
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                    },
                  },
                },
              }}
              MenuListProps={{
                'aria-labelledby': 'account-menu-button',
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)'}` }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
              <MenuItem 
                onClick={handleProfile}
                selected={location.pathname === '/user/profile'}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: mode === 'light' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(165, 180, 252, 0.08)',
                    '&:hover': {
                      bgcolor: mode === 'light' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(165, 180, 252, 0.12)',
                    },
                  },
                }}
              >
                <ProfileIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> 
                <Typography variant="body2">Profile</Typography>
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
                <Typography variant="body2">Logout</Typography>
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
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor:
              mode === "light" ? "#f8fafc" : "#1e1e1e",
            color: mode === "light" ? "#111827" : "#e5e5e5",
            transition: "background-color 0.3s ease, color 0.3s ease",
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
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.main
                        : mode === "light"
                        ? "#6b7280"
                        : "#b0b0b0",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    color:
                      location.pathname === item.path
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
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
          color: theme.palette.text.primary,
          minHeight: "100vh",
          p: 3,
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Toolbar />
        {children || <Outlet />}
      </Box>
    </Box>
  );
}
