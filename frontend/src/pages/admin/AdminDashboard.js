import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import {
  getAllUsers,
  getUserExpenses,
  getUserBudgets,
  getUserReports,
  getUserExpenseChartData,
} from "../../services/adminService";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8dd1e1", "#d0ed57"];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [userExpenses, setUserExpenses] = useState([]);
  const [userBudgets, setUserBudgets] = useState([]);
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const { showAlert } = useAlert();

  const handleSignOut = async () => {
    await logout();
    window.location.href = "/login";
  };

  // ✅ Load all admin data
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        console.log("🔄 Loading admin dashboard data...");
        
        const [usersRes, reportsRes, chartRes] = await Promise.all([
          getAllUsers(),
          getUserReports(),
          getUserExpenseChartData(),
        ]);

        console.log("✅ Admin data loaded:", {
          users: usersRes?.length || 0,
          reports: reportsRes?.length || 0,
          chartData: chartRes?.length || 0,
        });

        setUsers(usersRes || []);
        setReports(reportsRes || []);
        setChartData(chartRes || []);
      } catch (error) {
        console.error("❌ Admin load error:", error);
        const errorMessage = error?.message || "Failed to load admin dashboard data";
        setError(errorMessage);
        showAlert(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showAlert]);

  const handleUserChange = async (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);

    if (!userId) {
      setUserExpenses([]);
      setUserBudgets([]);
      return;
    }

    try {
      console.log("🔄 Loading user details for:", userId);
      const [expenses, budgets] = await Promise.all([
        getUserExpenses(userId),
        getUserBudgets(userId),
      ]);

      console.log("✅ User details loaded:", {
        expenses: expenses?.length || 0,
        budgets: budgets?.length || 0,
      });

      setUserExpenses(expenses || []);
      setUserBudgets(budgets || []);
    } catch (error) {
      console.error("❌ Failed loading user details:", error);
      const errorMessage = error?.message || "Failed to load user details";
      showAlert(errorMessage, "error");
      setUserExpenses([]);
      setUserBudgets([]);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress size={60} />
        <Typography mt={2}>Loading admin dashboard...</Typography>
      </Box>
    );
  }

  if (error && users.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" color="error" mb={2}>
            Error Loading Dashboard
          </Typography>
          <Typography color="text.secondary" mb={3}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight={600}>
          🧑‍💼 Admin Dashboard
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} mb={5}>
        {[
          { icon: <PeopleIcon />, label: "Total Users", value: users.length },
          {
            icon: <WalletIcon />,
            label: "Total Expenses",
            value: chartsValue(chartData),
          },
          {
            icon: <TrendingUpIcon />,
            label: "Monthly Growth",
            value: "+8%",
          },
          {
            icon: <AssessmentIcon />,
            label: "Reports",
            value: reports.length,
          },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
              {item.icon}
              <Typography variant="h6" mt={1}>
                {item.value}
              </Typography>
              <Typography color="text.secondary">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User dropdown */}
      <Paper sx={{ p: 4, borderRadius: 3, mb: 5 }}>
        <Typography variant="h5" mb={2}>
          Select User
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select value={selectedUser} onChange={handleUserChange} label="Select User">
            {users.map((u) => (
              <MenuItem key={u._id} value={u._id}>
                {u.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <>
            {/* ✅ User Expenses */}
            <Typography variant="h6" mt={4}>
              User Expenses
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userExpenses.map((e) => (
                    <TableRow key={e._id}>
                      <TableCell>{e.category}</TableCell>
                      <TableCell>${e.amount}</TableCell>
                      <TableCell>{e.date?.slice(0, 10)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ✅ User Budgets */}
            <Typography variant="h6" mt={4}>
              User Budgets
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell>Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userBudgets.map((b) => (
                    <TableRow key={b._id}>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>${b.budget}</TableCell>
                      <TableCell>${b.spent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ✅ Pie Chart */}
            <Paper sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" mb={2}>
                Budget Utilization
              </Typography>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userBudgets.map((b) => ({
                      name: b.category,
                      value: (b.spent / b.budget) * 100,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                    dataKey="value"
                  >
                    {userBudgets.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </>
        )}
      </Paper>

      {/* ✅ Reports Table */}
      <Paper sx={{ p: 4, mb: 5, borderRadius: 3 }}>
        <Typography variant="h5" mb={3}>
          Reports Overview
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Total Spent</TableCell>
                <TableCell>Total Budget</TableCell>
                <TableCell>Utilization</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.userId}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>${r.totalSpent}</TableCell>
                  <TableCell>${r.totalBudget}</TableCell>
                  <TableCell>{r.utilization}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ✅ Total expenses by user (bar chart) */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" mb={3}>
          Total Expenses by User
        </Typography>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSpent" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

// ✅ Helper function
function chartsValue(data) {
  return data.reduce((sum, d) => sum + (d.totalSpent || 0), 0);
}

export default AdminDashboard;
