import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useTheme as useThemeContext } from "../../contexts/ThemeContext";

// ✅ Import backend services
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService";

// ✅ Categories for dropdown
const categories = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Housing",
  "Bills & Utilities",
  "Entertainment",
  "Health & Medical",
  "Education",
  "Gifts & Donations",
  "Other",
];

// ✅ Payment Methods
const paymentMethods = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Digital Wallet",
  "Other",
];

const Expenses = () => {
  const theme = useTheme();

  const { toggleTheme } = useThemeContext();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // ✅ UI Filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    paymentMethod: "",
    minAmount: "",
    maxAmount: "",
    startDate: null,
    endDate: null,
  });

  // ✅ Fetch expenses from backend on load
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.error("Error loading expenses:", err);
      }
      setLoading(false);
    };

    loadExpenses();
  }, []);

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      description: "",
      amount: "",
      date: new Date(),
      category: "",
      paymentMethod: "",
      notes: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Description is required"),
      amount: Yup.number().required("Amount is required").positive(),
      date: Yup.date().required("Date is required"),
      category: Yup.string().required("Category is required"),
      paymentMethod: Yup.string().required("Payment method is required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        
        // Prepare payload - ensure date is in correct format
        const payload = {
          description: values.description?.trim() || "",
          amount: Number(values.amount),
          category: values.category,
          paymentMethod: values.paymentMethod || "Cash",
          date: values.date instanceof Date 
            ? values.date.toISOString() 
            : values.date 
            ? new Date(values.date).toISOString()
            : new Date().toISOString(),
          notes: values.notes?.trim() || "",
        };

        console.log("📤 Submitting expense:", payload);

        if (editingExpense) {
          const updated = await updateExpense(editingExpense._id, payload);
          setExpenses((prev) =>
            prev.map((e) => (e._id === editingExpense._id ? updated : e))
          );
        } else {
          const newExp = await addExpense(payload);
          setExpenses((prev) => [newExp, ...prev]);
        }

        handleCloseDialog();
        resetForm();
      } catch (error) {
        console.error("❌ Error saving expense:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to save expense";
        alert(errorMessage); // Temporary - you can replace with a better notification system
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ✅ Open Dialog
  const handleOpenDialog = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      formik.setValues(expense);
    } else {
      formik.resetForm();
      setEditingExpense(null);
    }
    setOpenDialog(true);
  };

  // ✅ Close Dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
    formik.resetForm();
  };

  // ✅ Delete Expense
  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Filtering Logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch =
        !filters.search ||
        expense.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        !filters.category || expense.category === filters.category;

      const matchesPayment =
        !filters.paymentMethod ||
        expense.paymentMethod === filters.paymentMethod;

      const matchesMin =
        !filters.minAmount || expense.amount >= Number(filters.minAmount);

      const matchesMax =
        !filters.maxAmount || expense.amount <= Number(filters.maxAmount);

      const date = new Date(expense.date);

      const matchesDate =
        (!filters.startDate || date >= filters.startDate) &&
        (!filters.endDate || date <= filters.endDate);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPayment &&
        matchesMin &&
        matchesMax &&
        matchesDate
      );
    });
  }, [filters, expenses]);

  // ✅ Summary numbers
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense =
    filteredExpenses.length > 0
      ? (totalExpenses / filteredExpenses.length).toFixed(2)
      : "0.00";

  return (
    <Box sx={{ ml: 3, mr: 3 }}>
      {/* HEADER */}
      <AppBar position="static" elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight={600}>
            💳 Expenses Tracker
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 3 }}
          >
            Add Expense
          </Button>
        </Toolbar>
      </AppBar>

      {/* SUMMARY CARDS */}
      <Box display="flex" gap={3} mb={3} flexWrap="wrap">
        {[
          {
            title: "Total Expenses",
            value: `₹${totalExpenses.toFixed(2)}`,
            color: "error.main",
          },
          {
            title: "Average Expense",
            value: `₹${avgExpense}`,
            color: "primary.main",
          },
          {
            title: "Active Categories",
            value: new Set(filteredExpenses.map((e) => e.category)).size,
            color: "success.main",
          },
        ].map((card, i) => (
          <Paper
            key={i}
            sx={{
              p: 3,
              flex: 1,
              minWidth: 200,
              borderRadius: 3,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #0F172A, #1E293B)"
                  : "linear-gradient(145deg, #EEF2FF, #E0F2FE)",
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {card.title}
            </Typography>

            <Typography variant="h5" fontWeight={600} color={card.color}>
              {card.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* FILTER BAR */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {/* Search */}
          <TextField
            label="Search"
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />

          {/* Category */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Payment Method */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={filters.paymentMethod}
              onChange={(e) =>
                setFilters({ ...filters, paymentMethod: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {paymentMethods.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Min Amount */}
          <TextField
            label="Min ₹"
            size="small"
            type="number"
            value={filters.minAmount}
            onChange={(e) =>
              setFilters({ ...filters, minAmount: e.target.value })
            }
          />

          {/* Max Amount */}
          <TextField
            label="Max ₹"
            size="small"
            type="number"
            value={filters.maxAmount}
            onChange={(e) =>
              setFilters({ ...filters, maxAmount: e.target.value })
            }
          />

          {/* Date Filters */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(v) => setFilters({ ...filters, startDate: v })}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: 180 }} />
              )}
            />

            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(v) => setFilters({ ...filters, endDate: v })}
              renderInput={(params) => (
                <TextField {...params} size="small" sx={{ width: 180 }} />
              )}
            />
          </LocalizationProvider>

          {/* Clear Filters */}
          <Button
            variant="outlined"
            color="error"
            startIcon={<FilterListIcon />}
            onClick={() =>
              setFilters({
                search: "",
                category: "",
                paymentMethod: "",
                minAmount: "",
                maxAmount: "",
                startDate: null,
                endDate: null,
              })
            }
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount (₹)</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredExpenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e) => (
                  <TableRow key={e._id} hover>
                    <TableCell>{e.description}</TableCell>

                    <TableCell>
                      <Chip label={e.category} size="small" variant="outlined" />
                    </TableCell>

                    <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
                      -₹{e.amount.toFixed(2)}
                    </TableCell>

                    <TableCell>
                      {new Date(e.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell>{e.paymentMethod}</TableCell>

                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(e)}>
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        sx={{ color: "error.main" }}
                        onClick={() => handleDeleteExpense(e._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          count={filteredExpenses.length}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingExpense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>

          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />

              <TextField
                name="amount"
                label="Amount (₹)"
                type="number"
                value={formik.values.amount}
                onChange={formik.handleChange}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formik.values.date}
                  onChange={(v) => formik.setFieldValue("date", v)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <FormControl error={formik.touched.category && Boolean(formik.errors.category)}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                error={
                  formik.touched.paymentMethod &&
                  Boolean(formik.errors.paymentMethod)
                }
              >
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                >
                  {paymentMethods.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name="notes"
                label="Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingExpense ? "Update" : "Add"} Expense
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Expenses;
