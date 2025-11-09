import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Category as CategoryIcon,
  TrendingUp,
  TrendingDown,
  Assessment,
  AttachMoney,
} from "@mui/icons-material";

// ==========================
// MOCK DATA
// ==========================
const users = [
  { id: 1, name: "Meghana" },
  { id: 2, name: "Arjun" },
  { id: 3, name: "Ravi" },
];

const mockBudgets = [
  { userId: 1, category: "Groceries", amount: 500, spent: 450 },
  { userId: 1, category: "Transportation", amount: 200, spent: 180 },
  { userId: 2, category: "Utilities", amount: 400, spent: 420 },
  { userId: 2, category: "Entertainment", amount: 300, spent: 270 },
  { userId: 3, category: "Shopping", amount: 600, spent: 400 },
];

const mockReports = [
  {
    userId: 1,
    title: "Monthly Spending Summary - October",
    date: "2025-10-30",
    totalSpent: 630,
    insights: "You maintained your budget limits effectively.",
  },
  {
    userId: 2,
    title: "Quarterly Expense Report",
    date: "2025-09-15",
    totalSpent: 690,
    insights: "Slightly overspending on utilities.",
  },
  {
    userId: 3,
    title: "Budget Overview",
    date: "2025-10-10",
    totalSpent: 400,
    insights: "Well-balanced expense management.",
  },
];

export default function UserBudgets() {
  const [selectedUser, setSelectedUser] = useState("");

  // Filter budgets and reports by selected user
  const filteredBudgets = useMemo(
    () => mockBudgets.filter((b) => (selectedUser ? b.userId === selectedUser : true)),
    [selectedUser]
  );

  const filteredReports = useMemo(
    () => mockReports.filter((r) => (selectedUser ? r.userId === selectedUser : true)),
    [selectedUser]
  );

  // Summary calculations
  const totalBudget = filteredBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = filteredBudgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const usage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={700} mb={3}>
        💼 User Budgets & Reports
      </Typography>

      {/* USER SELECTOR */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            label="Select User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <MenuItem value="">All Users</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* BUDGET SUMMARY */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Paper sx={summaryCardStyle("#2563eb")}>
            <AttachMoney sx={iconStyle("#2563eb")} />
            <Typography variant="subtitle1">Total Budget</Typography>
            <Typography variant="h5" fontWeight={700}>${totalBudget}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={summaryCardStyle("#ef4444")}>
            <TrendingUp sx={iconStyle("#ef4444")} />
            <Typography variant="subtitle1">Total Spent</Typography>
            <Typography variant="h5" fontWeight={700}>${totalSpent}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={summaryCardStyle("#22c55e")}>
            <TrendingDown sx={iconStyle("#22c55e")} />
            <Typography variant="subtitle1">Remaining</Typography>
            <Typography variant="h5" fontWeight={700}>${remaining}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* OVERALL USAGE */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          📊 Overall Budget Utilization
        </Typography>
        <LinearProgress
          variant="determinate"
          value={Math.min(usage, 100)}
          sx={{
            mt: 2,
            height: 10,
            borderRadius: 5,
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                usage > 100 ? "#ef4444" : usage > 80 ? "#f59e0b" : "#2563eb",
            },
          }}
        />
        <Box mt={1} display="flex" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">
            {usage.toFixed(1)}% used
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remaining: ${remaining}
          </Typography>
        </Box>
      </Paper>

      {/* USER BUDGET DETAILS */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        🧾 Budget Breakdown
      </Typography>
      <Grid container spacing={3} mb={5}>
        {filteredBudgets.map((b, i) => {
          const percent = Math.min(100, (b.spent / b.amount) * 100);
          const color =
            percent > 100 ? "#ef4444" : percent > 80 ? "#f59e0b" : "#22c55e";

          return (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" },
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CategoryIcon color="primary" />
                    <Typography variant="h6">{b.category}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    ${b.spent} of ${b.amount} used
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      "& .MuiLinearProgress-bar": { backgroundColor: color },
                    }}
                  />
                  <Box mt={1} display="flex" justifyContent="space-between">
                    <Chip
                      label={
                        percent > 100
                          ? "Over Budget"
                          : percent > 80
                          ? "Near Limit"
                          : "On Track"
                      }
                      color={
                        percent > 100
                          ? "error"
                          : percent > 80
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {percent.toFixed(1)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* REPORTS SECTION */}
      <Typography variant="h5" fontWeight={600} mb={2}>
        📑 Reports
      </Typography>
      <Grid container spacing={3}>
        {filteredReports.map((r, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "12px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                "&:hover": { transform: "translateY(-4px)", transition: "0.3s" },
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Assessment color="primary" />
                <Typography variant="h6">{r.title}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Generated on: {new Date(r.date).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body1">
                💵 Total Spent:{" "}
                <Typography component="span" fontWeight={600} color="error.main">
                  ${r.totalSpent}
                </Typography>
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary">
                🧠 Insights: {r.insights}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// 💅 STYLES
const summaryCardStyle = (color) => ({
  p: 3,
  textAlign: "center",
  borderRadius: "12px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  bgcolor: "#fff",
  "& h5": { color },
});

const iconStyle = (color) => ({
  fontSize: 40,
  color,
  mb: 1,
});
