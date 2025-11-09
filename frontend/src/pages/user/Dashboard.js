import { useState, useEffect, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

// Auth
import { AuthContext } from "../../contexts/AuthContext";

// Services (must exist, as we created earlier)
import { getExpenses, addExpense } from "../../services/expenseService";
import { getIncomes } from "../../services/incomeService";
import { getBudgets } from "../../services/budgetService";
// Reports are admin-only, removed import
import { getAlerts } from "../../services/alertService";

// Categories for the add-expense form
const categories = [
  { value: "Food & Dining", label: "Food & Dining" },
  { value: "Rent", label: "Rent" },
  { value: "Bills & Utilities", label: "Bills & Utilities" },
  { value: "Transportation", label: "Transportation" },
  { value: "Shopping", label: "Shopping" },
  { value: "Health & Medical", label: "Health & Medical" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Education", label: "Education" },
  { value: "Other", label: "Other" },
];

const inr = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const theme = useTheme();
  const { user } = useContext(AuthContext);

  // Data
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [report, setReport] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);
  const [snack, setSnack] = useState({ severity: "info", message: "" });

  // Add expense form
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    paymentMethod: "Cash",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Fetch everything
  useEffect(() => {
    const load = async () => {
      try {
        const [exp, inc, bud, al] = await Promise.all([
          getExpenses(),
          getIncomes(),
          getBudgets(),
          getAlerts().catch(() => []), // alerts not critical
        ]);
        setExpenses(exp || []);
        setIncomes(inc || []);
        setBudgets(bud || []);
        setAlerts(al || []);
        // Reports are admin-only, so we don't fetch them for regular users
        setReport(null);
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setSnack({ severity: "error", message: "Failed to load dashboard data." });
        setOpenSnack(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Totals (prefer report if available)
  const totalIncome = report?.totals?.income ??
    incomes.reduce((s, i) => s + Number(i.amount || 0), 0);

  const totalExpenses = report?.totals?.expenses ??
    expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  const currentBalance =
    report?.totals?.remainingBalance ?? (totalIncome - totalExpenses);

  // Category breakdown (prefer report)
  const categoryBreakdown = useMemo(() => {
    if (report?.categoryBreakdown) return report.categoryBreakdown;
    const map = {};
    for (const e of expenses) {
      const key = e.category || "Other";
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    }
    return map;
  }, [report, expenses]);

  // Monthly Income vs Expense Series (prefer report for expenses)
  const monthlyChartData = useMemo(() => {
    // months short names
    const months = Array.from({ length: 12 }, (_, m) =>
      new Date(0, m).toLocaleString("en-IN", { month: "short" })
    );

    const expMonthly =
      report?.monthlyExpenses ||
      expenses.reduce((acc, e) => {
        const d = new Date(e.date);
        if (isNaN(d)) return acc;
        const m = d.getMonth(); // 0-11
        acc[m] = (acc[m] || 0) + Number(e.amount || 0);
        return acc;
      }, {});

    const incMonthly = incomes.reduce((acc, i) => {
      const d = new Date(i.date);
      if (isNaN(d)) return acc;
      const m = d.getMonth();
      acc[m] = (acc[m] || 0) + Number(i.amount || 0);
      return acc;
    }, {});

    return months.map((label, idx) => ({
      month: label,
      income: incMonthly[idx] || 0,
      expense:
        typeof expMonthly === "object" && !Array.isArray(expMonthly)
          ? expMonthly[idx + 1] || 0 // our report.monthlyExpenses keyed by 1..12
          : expMonthly[idx] || 0,
    }));
  }, [report, incomes, expenses]);

  // Category Pie data
  const pieData = useMemo(() => {
    const entries = Object.entries(categoryBreakdown || {});
    const data = entries
      .map(([name, value]) => ({ name, value: Number(value) || 0 }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
    return data.length > 0 ? data : [{ name: "No expenses yet", value: 1 }];
  }, [categoryBreakdown]);

  const pieColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    "#22C55E",
    "#ef4444",
    "#F59E0B",
    "#06B6D4",
    "#8B5CF6",
    "#EC4899",
    "#84CC16",
    "#64748B",
  ];

  // Recent transactions: merge incomes & expenses
  const recentTransactions = useMemo(() => {
    const ex = expenses.map((e) => ({
      id: e._id,
      date: new Date(e.date),
      description: e.description,
      amount: Number(e.amount || 0),
      type: "expense",
      category: e.category || "Other",
      icon: "🧾",
    }));
    const inc = incomes.map((i) => ({
      id: i._id,
      date: new Date(i.date),
      description: i.description || "Income",
      amount: Number(i.amount || 0),
      type: "income",
      category: i.source || "Income",
      icon: "💰",
    }));
    return [...ex, ...inc]
      .filter((t) => !isNaN(t.date))
      .sort((a, b) => b.date - a.date)
      .slice(0, 8);
  }, [expenses, incomes]);

  // Alerts banner if spending > 80% of income (simple heuristic)
  useEffect(() => {
    if (!loading && totalIncome > 0 && totalExpenses > totalIncome * 0.8) {
      setSnack({
        severity: "warning",
        message: "⚠️ High spending this period. Consider tightening budgets.",
      });
      setOpenSnack(true);
    }
  }, [loading, totalIncome, totalExpenses]);

  // Add new expense (POST to /api/expenses)
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      setSnack({ severity: "error", message: "Please fill all required fields." });
      setOpenSnack(true);
      return;
    }
    try {
      const payload = {
        description: newExpense.description.trim(),
        amount: Number(newExpense.amount),
        category: newExpense.category,
        paymentMethod: newExpense.paymentMethod || "Cash",
        date: newExpense.date ? new Date(newExpense.date) : new Date(),
        notes: newExpense.notes?.trim() || "",
      };
      
      console.log("📤 Adding expense:", payload);
      const saved = await addExpense(payload);
      console.log("✅ Expense saved:", saved);
      
      // Reload expenses to get fresh data
      const updatedExpenses = await getExpenses();
      setExpenses(updatedExpenses || []);
      
      setSnack({ severity: "success", message: "✅ Expense added successfully!" });
      setOpenSnack(true);
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        paymentMethod: "Cash",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    } catch (err) {
      console.error("❌ Error adding expense:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to add expense. Please check your connection.";
      setSnack({ severity: "error", message: errorMessage });
      setOpenSnack(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading dashboard…</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            👋 Welcome back, {user?.name || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {format(new Date(), "MMMM yyyy")}
          </Typography>
        </Box>

        <Badge
          color="primary"
          badgeContent={alerts.filter((a) => !a.read).length}
          overlap="circular"
        >
          <NotificationsIconsafe />
        </Badge>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        {[
          {
            title: "Current Balance",
            value: inr(currentBalance),
            color: "#22C55E",
            icon: <AccountBalanceWallet fontSize="large" color="success" />,
          },
          {
            title: "Total Income",
            value: inr(totalIncome),
            color: theme.palette.primary.main,
            icon: <TrendingUp fontSize="large" color="primary" />,
          },
          {
            title: "Total Expenses",
            value: inr(totalExpenses),
            color: "#ef4444",
            icon: <TrendingDown fontSize="large" color="error" />,
          },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                borderRadius: 4,
                bgcolor: "background.paper",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                transition: "0.25s",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {card.icon}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color={card.color}>
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts: Bar + Pie */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" fontWeight={600} mb={2}>
              📊 Monthly Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: "none",
                    borderRadius: 8,
                  }}
                  formatter={(v) => inr(v)}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 4, bgcolor: "background.paper" }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              🍕 Expenses by Category
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: "none",
                    borderRadius: 8,
                  }}
                  formatter={(v, n) => [inr(v), n]}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box mt={1} display="flex" gap={1} flexWrap="wrap">
              {pieData.map((d, idx) => (
                <Chip
                  key={d.name}
                  size="small"
                  label={`${d.name}: ${inr(d.value)}`}
                  sx={{ bgcolor: `${pieColors[idx % pieColors.length]}26` }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 4, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          🧾 Recent Transactions
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    {t.date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1} alignItems="center">
                      <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                        {t.icon}
                      </Avatar>
                      <Typography>{t.description}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell align="right" style={{ color: t.type === "expense" ? "#ef4444" : "#22C55E", fontWeight: 700 }}>
                    {t.type === "expense" ? "-" : "+"}
                    {inr(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
              {recentTransactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="text.secondary">No transactions yet.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Expense */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          ➕ Add New Expense
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box component="form" onSubmit={handleAddExpense}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Description"
                fullWidth
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount (₹)"
                type="number"
                fullWidth
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                fullWidth
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                {categories.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Payment Method"
                fullWidth
                value={newExpense.paymentMethod}
                onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Notes (optional)"
                fullWidth
                value={newExpense.notes}
                onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              borderRadius: 2,
              px: 4,
              py: 1.2,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(90deg, #4F46E5, #9333EA)"
                  : "linear-gradient(90deg, #1e88e5, #8e24aa)",
            }}
          >
            Add Expense
          </Button>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={openSnack}
        autoHideDuration={3500}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          variant="filled"
          onClose={() => setOpenSnack(false)}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/** A tiny safety wrapper to avoid name conflict with MUI icon import */
function NotificationsIconsafe() {
  return <NotificationsIcon fontSize="large" />;
}  