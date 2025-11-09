import React, { useState, useEffect, useMemo, useCallback, useContext } from "react";
import {
  Box, Typography, Paper, Button, Grid, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TableSortLabel, TextField, InputAdornment,
  MenuItem, LinearProgress, Chip, Card, CardContent, CardHeader, Divider, Tooltip,
  FormControl, FormControlLabel, InputLabel, Select, useMediaQuery, Snackbar, Alert, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Switch
} from "@mui/material";
import {
  Add, Edit, Delete, TrendingUp, Search, FileDownload, FilterList,
  MoreVert, CalendarMonth, Category, Repeat, CheckCircle, Cancel, Inbox as InboxIcon
} from "@mui/icons-material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, isWithinInterval } from "date-fns";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip as RechartsTooltip
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { useTheme as useThemeContext } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

// 🔗 Backend services (API calls)
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome,
  markIncomeAsReceived
} from "../../services/incomeService";


// ✅ Remove these ❌
// const { user } = useContext(AuthContext);
// const navigate = useNavigate();
// useEffect(() => { ... });

// ✅ Add constants only here
const INCOME_CATEGORIES = [
  "Salary", "Freelance", "Business", "Investments", "Rental",
  "Dividends", "Pension", "Social Security", "Gifts", "Other"
];

const RECURRENCE_OPTIONS = [
  { value: "none", label: "One-time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
];

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const Income = () => {
  const { mode } = useThemeContext();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  // ======== UI & notifications ========
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const notify = (message, severity = "info") => setSnack({ open: true, message, severity });

  // ======== Server data ========
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======== Table / sorting / paging ========
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ======== Filters ========
  const [filters, setFilters] = useState({
    category: "",
    dateRange: [null, null],
    search: "",
    status: ""
  });

  // ======== Dialog state (will be used in Part 3) ========
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);

  // ======== Form state (will be used in Part 3) ========
  const [form, setForm] = useState({
    id: null,
    source: "",
    amount: "",
    category: "",
    date: new Date().toISOString(),
    notes: "",
    isRecurring: false,
    recurrence: "none",
    status: "pending"
  });

  // ======== Goal (local preference) ========
  const [incomeGoal, setIncomeGoal] = useState(100000); // annual goal (₹)

  // ======== Fetch data ========
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getIncomes();
        // Expecting [{ _id, source, amount, category, date, notes, status, isRecurring, recurrence }]
        setIncomes(
          (data || []).map((i) => ({
            ...i,
            date: i.date || new Date().toISOString()
          }))
        );
      } catch (e) {
        console.error(e);
        notify("Failed to load incomes", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ======== Helpers ========
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const filterIncomes = useCallback(() => {
    return incomes
      .filter((income) => {
        const q = filters.search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          income.source?.toLowerCase().includes(q) ||
          income.notes?.toLowerCase().includes(q);

        const matchesCategory = !filters.category || income.category === filters.category;
        const matchesStatus = !filters.status || income.status === filters.status;

        let matchesDateRange = true;
        const [start, end] = filters.dateRange;
        if (start && end) {
          const d = new Date(income.date);
          matchesDateRange = isWithinInterval(d, { start, end });
        }
        return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => {
        const { key, direction } = sortConfig;
        const va = key === "date" ? new Date(a[key]).getTime() : a[key];
        const vb = key === "date" ? new Date(b[key]).getTime() : b[key];
        if (va < vb) return direction === "asc" ? -1 : 1;
        if (va > vb) return direction === "asc" ? 1 : -1;
        return 0;
      });
  }, [incomes, filters, sortConfig]);

  const filteredIncomes = useMemo(() => filterIncomes(), [filterIncomes]);

  // ======== KPIs & charts data ========
  const { totalIncome, totalThisMonth, categoriesTotal, monthlySeries, goalProgress } = useMemo(() => {
    const now = new Date();
    const cm = now.getMonth();
    const cy = now.getFullYear();

    const total = filteredIncomes.reduce((s, i) => s + Number(i.amount || 0), 0);

    const thisMonth = filteredIncomes
      .filter((i) => {
        const d = new Date(i.date);
        return d.getMonth() === cm && d.getFullYear() === cy;
      })
      .reduce((s, i) => s + Number(i.amount || 0), 0);

    const categoriesMap = {};
    filteredIncomes.forEach((i) => {
      const k = i.category || "Other";
      categoriesMap[k] = (categoriesMap[k] || 0) + Number(i.amount || 0);
    });
    const categoriesTotalArr = Object.entries(categoriesMap).map(([name, value]) => ({ name, value }));

    const months = Array.from({ length: 12 }, (_, m) =>
      new Date(0, m).toLocaleString("en-IN", { month: "short" })
    );
    const byMonth = Array.from({ length: 12 }, () => 0);
    filteredIncomes.forEach((i) => {
      const d = new Date(i.date);
      if (!isNaN(d)) byMonth[d.getMonth()] += Number(i.amount || 0);
    });
    const monthly = months.map((label, idx) => ({ month: label, income: byMonth[idx] }));

    const progress = Math.min(Math.round((total / incomeGoal) * 100), 100);

    return {
      totalIncome: total,
      totalThisMonth: thisMonth,
      categoriesTotal: categoriesTotalArr,
      monthlySeries: monthly,
      goalProgress: progress
    };
  }, [filteredIncomes, incomeGoal]);

  // ======== Pagination ========
  const paginatedIncomes = useMemo(
    () => filteredIncomes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredIncomes, page, rowsPerPage]
  );
  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // ======== Form helpers ========
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target || {};
    if (!name) return;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        // Update existing income - exclude id from payload
        const { id, ...updateData } = form;
        await updateIncome(id, updateData);
        notify("Income updated", "success");
      } else {
        // Create new income - exclude id and any null/undefined fields
        const { id, ...createData } = form;
        // Clean up the data - remove null/undefined values
        const cleanData = Object.fromEntries(
          Object.entries(createData).filter(([_, v]) => v !== null && v !== undefined)
        );
        console.log("📤 Creating income:", cleanData);
        await createIncome(cleanData);
        notify("Income added", "success");
      }

      // Refresh list
      const updated = await getIncomes();
      setIncomes(updated || []);
      setOpenForm(false);
      
      // Reset form
      setForm({
        id: null,
        source: "",
        amount: "",
        category: "",
        date: new Date().toISOString(),
        notes: "",
        isRecurring: false,
        recurrence: "none",
        status: "pending"
      });
    } catch (err) {
      console.error("❌ Error saving income:", err);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to save income";
      notify(errorMessage, "error");
    }
  };

  // ======== Status chip helpers (used later in table) ========
  const getStatusChipColor = (status) => {
    switch (status) {
      case "received":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "received":
        return <CheckCircle fontSize="small" color="success" />;
      case "pending":
        return <CalendarMonth fontSize="small" color="warning" />;
      case "cancelled":
        return <Cancel fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  // ======== Render (Header + KPI cards + Charts) ========
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom={!isMobile}>
              Income Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage your income sources
            </Typography>
          </Box>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => {
              // open form dialog (Part 3 will implement it)
              setForm({
                id: null,
                source: "",
                amount: "",
                category: "",
                date: new Date().toISOString(),
                notes: "",
                isRecurring: false,
                recurrence: "none",
                status: "pending"
              });
              setOpenForm(true);
            }}
            size={isMobile ? "small" : "medium"}
          >
            {isMobile ? "Add" : "Add Income"}
          </Button>
        </Box>

        {loading ? (
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography mb={1}>Loading incomes…</Typography>
            <LinearProgress />
          </Paper>
        ) : (
          <>
            {/* KPI Cards */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Total Income
                        </Typography>
                        <Typography variant="h4" color="success.main">
                          {inr(totalIncome)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          All time
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "success.light", color: "success.contrastText" }}>
                        <TrendingUp />
                      </Avatar>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          This Month
                        </Typography>
                        <Typography variant="h4">{inr(totalThisMonth)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(), "MMMM yyyy")}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}>
                        <CalendarMonth />
                      </Avatar>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(totalThisMonth / (incomeGoal / 12)) * 100}
                      color={totalThisMonth >= incomeGoal / 12 ? "success" : "primary"}
                      sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Monthly Goal
                        </Typography>
                        <Typography variant="h4">{inr(Math.round(incomeGoal / 12))}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {goalProgress}% of annual goal
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "warning.light", color: "warning.contrastText" }}>
                        <TrendingUp />
                      </Avatar>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goalProgress}
                      color={goalProgress >= 100 ? "success" : "warning"}
                      sx={{ mt: 2, height: 6, borderRadius: 3 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Income Sources
                        </Typography>
                        <Typography variant="h4">
                          {new Set(incomes.map((i) => i.category)).size}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {incomes.length} total entries
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "info.light", color: "info.contrastText" }}>
                        <Category />
                      </Avatar>
                    </Box>
                    <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                      {categoriesTotal.slice(0, 3).map((cat, i) => (
                        <Chip key={i} label={cat.name} size="small" variant="outlined" sx={{ borderRadius: 1 }} />
                      ))}
                      {categoriesTotal.length > 3 && (
                        <Chip label={`+${categoriesTotal.length - 3}`} size="small" sx={{ borderRadius: 1 }} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardHeader
                    title="Income by Category"
                    action={
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoriesTotal}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {categoriesTotal.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={[
                                "#4F46E5", "#22C55E", "#FACC15", "#FB923C", "#A855F7",
                                "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"
                              ][index % 10]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value) => [inr(value), "Amount"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardHeader
                    title="Monthly Income Trend"
                    action={
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    }
                  />
                </Card>
                <Divider sx={{ mt: -3, mb: 2 }} />
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySeries} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(v) => `₹${v / 1000}k`} />
                        <RechartsTooltip
                          formatter={(value) => [inr(value), "Income"]}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar dataKey="income" name="Income" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                          {monthlySeries.map((_, idx) => (
                            <Cell key={idx} fill={idx === new Date().getMonth() ? "#22C55E" : "#4F46E5"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        {/* ======================== FILTERS + ACTIONS ========================= */}
<Card elevation={2} sx={{ mb: 3 }}>
  <CardContent>
    <Grid container spacing={2} alignItems="center">
      
      {/* Search */}
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search incomes..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
          }}
        />
      </Grid>

      {/* Category filter */}
      <Grid item xs={6} sm={4} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <MenuItem value="">All Categories</MenuItem>
            {INCOME_CATEGORIES.map((cat, i) => (
              <MenuItem key={i} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Status filter */}
      <Grid item xs={6} sm={4} md={2}>
        <FormControl fullWidth size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="received">Received</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Date Range */}
      <Grid item xs={12} sm={4} md={3}>
        <DatePicker
          label="Start Date"
          value={filters.dateRange[0]}
          onChange={(date) =>
            setFilters({ ...filters, dateRange: [date, filters.dateRange[1]] })
          }
          renderInput={(params) => (
            <TextField {...params} fullWidth size="small" />
          )}
        />
        <DatePicker
          label="End Date"
          value={filters.dateRange[1]}
          onChange={(date) =>
            setFilters({ ...filters, dateRange: [filters.dateRange[0], date] })
          }
          renderInput={(params) => (
            <TextField {...params} fullWidth size="small" sx={{ mt: 1 }} />
          )}
        />
      </Grid>

      {/* Clear filters + Export */}
      <Grid item xs={12} sm={6} md={2} sx={{ textAlign: "right", ml: 'auto' }}>
        <Box display="flex" gap={1} justifyContent="flex-end">

          {/* Export CSV placeholder */}
          <Tooltip title="Export to CSV">
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownload />}
              onClick={() => alert("Install react-csv for export functionality")}
            >
              Export
            </Button>
          </Tooltip>

          {/* Clear filters */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterList />}
            onClick={() =>
              setFilters({
                category: "",
                dateRange: [null, null],
                search: "",
                status: ""
              })
            }
          >
            Clear
          </Button>
        </Box>
      </Grid>
    </Grid>
  </CardContent>
</Card>

{/* ======================== INCOME TABLE ========================= */}
<Card elevation={2}>
  <CardContent sx={{ p: 0 }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {/* Source */}
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === "source"}
                direction={sortConfig.direction}
                onClick={() => handleSort("source")}
              >
                Source
              </TableSortLabel>
            </TableCell>

            {/* Amount */}
            <TableCell align="right">
              <TableSortLabel
                active={sortConfig.key === "amount"}
                direction={sortConfig.direction}
                onClick={() => handleSort("amount")}
              >
                Amount
              </TableSortLabel>
            </TableCell>

            {/* Category */}
            <TableCell>Category</TableCell>

            {/* Date */}
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === "date"}
                direction={sortConfig.direction}
                onClick={() => handleSort("date")}
              >
                Date
              </TableSortLabel>
            </TableCell>

            {/* Status */}
            <TableCell>Status</TableCell>

            {/* Recurring */}
            <TableCell>Recurring</TableCell>

            {/* Actions */}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedIncomes.length > 0 ? (
            paginatedIncomes.map((income) => (
              <TableRow key={income._id || income.id} hover>
                {/* Source + Notes */}
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getStatusIcon(income.status)}
                    <Box ml={1}>
                      <Typography variant="body2">{income.source}</Typography>
                      {income.notes && (
                        <Typography variant="caption" color="text.secondary">
                          {income.notes.length > 30
                            ? income.notes.slice(0, 30) + "..."
                            : income.notes}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {/* Amount */}
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={500}>
                    ₹{Number(income.amount).toLocaleString("en-IN")}
                  </Typography>
                </TableCell>

                {/* Category */}
                <TableCell>
                  <Chip
                    label={income.category}
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 1 }}
                  />
                </TableCell>

                {/* Date */}
                <TableCell>
                  {format(new Date(income.date), "MMM dd, yyyy")}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Chip
                    label={income.status.toUpperCase()}
                    color={getStatusChipColor(income.status)}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>

                {/* Recurrence */}
                <TableCell>
                  {income.isRecurring ? (
                    <Tooltip title={`Recurring: ${income.recurrence}`}>
                      <Repeat color="primary" fontSize="small" />
                    </Tooltip>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      One-time
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    
                    {/* ✅ Mark as Received */}
                    {income.status !== "received" && (
                      <Tooltip title="Mark as Received">
                        <IconButton
                          size="small"
                          onClick={async () => {
                            await markIncomeAsReceived(income._id);
                            notify("Income marked as received", "success");

                            // Reload incomes instantly
                            const updated = await getIncomes();
                            setIncomes(updated);
                          }}
                          color="success"
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {/* Edit */}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setForm(income);
                          setOpenForm(true);
                        }}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Delete */}
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setIncomeToDelete(income._id);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Box textAlign="center">
                  <InboxIcon color="disabled" fontSize="large" />
                  <Typography>No income records found</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Pagination */}
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={filteredIncomes.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </CardContent>
</Card>
{/* ======================== ADD / EDIT INCOME DIALOG ========================= */}
<Dialog 
  open={openForm} 
  onClose={() => setOpenForm(false)}
  maxWidth="sm"
  fullWidth
>
  <form onSubmit={handleSubmit}>
    <DialogTitle>{form.id ? "Edit Income" : "Add New Income"}</DialogTitle>

    <DialogContent>
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        
        {/* Source */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Income Source"
            name="source"
            fullWidth
            size="small"
            value={form.source}
            onChange={handleInputChange}
            required
          />
        </Grid>

        {/* Amount */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            size="small"
            value={form.amount}
            onChange={handleInputChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={form.category}
              onChange={handleInputChange}
              label="Category"
              required
            >
              {INCOME_CATEGORIES.map((cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Date */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date"
            value={form.date ? new Date(form.date) : new Date()}
            onChange={(date) => {
              setForm({
                ...form,
                date: date.toISOString(),
              });
            }}
            renderInput={(params) => (
              <TextField {...params} fullWidth size="small" required />
            )}
          />
        </Grid>

        {/* Recurring flag */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={form.isRecurring}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isRecurring: e.target.checked,
                    recurrence: e.target.checked ? "monthly" : "none",
                  })
                }
                color="primary"
              />
            }
            label="Recurring Income"
          />
        </Grid>

        {/* Recurrence options */}
        {form.isRecurring && (
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Recurrence</InputLabel>
              <Select
                name="recurrence"
                value={form.recurrence}
                onChange={handleInputChange}
                label="Recurrence"
              >
                {RECURRENCE_OPTIONS.map((rec, index) => (
                  <MenuItem key={index} value={rec.value}>
                    {rec.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Status */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              label="Status"
              required
            >
              <MenuItem value="received">Received</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            label="Notes"
            name="notes"
            fullWidth
            size="small"
            multiline
            rows={3}
            value={form.notes}
            onChange={handleInputChange}
            placeholder="Add notes about this income"
          />
        </Grid>
      </Grid>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setOpenForm(false)}>Cancel</Button>
      <Button type="submit" variant="contained">
        {form.id ? "Update" : "Add"} Income
      </Button>
    </DialogActions>
  </form>
</Dialog>

{/* ======================== DELETE CONFIRMATION ========================= */}
<Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this income record? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
    <Button
      color="error"
      variant="contained"
      onClick={async () => {
        await deleteIncome(incomeToDelete);
        notify("Income deleted", "success");

        const updated = await getIncomes();
        setIncomes(updated);

        setOpenDeleteDialog(false);
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3500}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert variant="filled" severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
            {snack.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default Income;
