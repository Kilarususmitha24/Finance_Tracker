import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Grid, Button, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, InputAdornment, Select, MenuItem,
  FormHelperText, LinearProgress, IconButton, Tooltip, Card,
  CardContent, CardActions, Snackbar, Chip, Alert
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { useTheme } from "@mui/material/styles";

import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
} from "../../services/budgetService";

import { CATEGORY_LIST } from "./budgetCategories";

// ✅ Only ONE Budgets component definition
const Budgets = () => {
  const theme = useTheme(); // ✅ fixes theme not defined
  const [budgets, setBudgets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // ✅ Load budgets
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      let data = await getBudgets();
      // ✅ Add samples if empty
      if (!data || data.length === 0) {
        data = [
          {
            _id: "sample-1",
            category: "Groceries",
            amount: 8000,
            spent: 4500,
            startDate: format(new Date(), "yyyy-MM-01"),
            endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd"),
            rollover: true,
            alertThreshold: 80,
          },
          {
            _id: "sample-2",
            category: "Transportation",
            amount: 3000,
            spent: 1800,
            startDate: format(new Date(), "yyyy-MM-01"),
            endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd"),
            rollover: false,
            alertThreshold: 75,
          },
          {
            _id: "sample-3",
            category: "Entertainment",
            amount: 5000,
            spent: 3500,
            startDate: format(new Date(), "yyyy-MM-01"),
            endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), "yyyy-MM-dd"),
            rollover: true,
            alertThreshold: 90,
          },
        ];
      }
      setBudgets(data);
    } catch (err) {
      console.error("Failed to load budgets:", err);
    }
  };

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      category: "",
      amount: "",
      startDate: format(new Date(), "yyyy-MM-01"),
      endDate: format(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
        "yyyy-MM-dd"
      ),
      rollover: false,
      alertThreshold: 80,
    },

    validationSchema: Yup.object({
      category: Yup.string().required("Required"),
      amount: Yup.number().required("Required").positive(),
      alertThreshold: Yup.number().min(1).max(100),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingBudget) {
          const updated = await updateBudget(editingBudget._id, values);
          setBudgets((prev) =>
            prev.map((b) => (b._id === editingBudget._id ? updated : b))
          );
          setSnackbar({ open: true, message: "Budget updated!", severity: "success" });
        } else {
          const created = await addBudget(values);
          setBudgets((prev) => [...prev, created]);
          setSnackbar({ open: true, message: "Budget created!", severity: "success" });
        }

        handleCloseDialog();
        resetForm();
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: "Action failed!", severity: "error" });
      }
    },
  });

  const handleOpenDialog = (budget = null) => {
    if (budget) {
      setEditingBudget(budget);
      formik.setValues(budget);
    } else {
      formik.resetForm();
      setEditingBudget(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditingBudget(null);
    setOpenDialog(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBudget(id);
      setBudgets((prev) => prev.filter((b) => b._id !== id));
      setSnackbar({ open: true, message: "Deleted!", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Delete failed!", severity: "error" });
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.amount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);
  const remaining = totalBudget - totalSpent;
  const utilization = totalBudget ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <Box sx={{ p: 2 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Budgets Overview
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          Create Budget
        </Button>
      </Box>

      {/* SUMMARY */}
      <Box mb={3}>
        <Typography variant="body1">
          Total Budget: <strong>₹{totalBudget.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body1">
          Total Spent: <strong>₹{totalSpent.toLocaleString()}</strong>
        </Typography>
        <Typography variant="body1">
          Remaining: <strong>₹{remaining.toLocaleString()}</strong>
        </Typography>
        <LinearProgress
          variant="determinate"
          value={utilization}
          sx={{ height: 10, borderRadius: 5, mt: 1 }}
        />
      </Box>

      {/* BUDGET CARDS */}
      <Grid container spacing={2}>
        {budgets.map((b) => {
          const percent = (b.spent / b.amount) * 100;
          const nearingLimit = percent >= b.alertThreshold;
          const overLimit = percent > 100;

          return (
            <Grid item xs={12} sm={6} md={4} key={b._id}>
              <Card
                sx={{
                  borderLeft: `5px solid ${
                    overLimit
                      ? theme.palette.error.main
                      : nearingLimit
                      ? theme.palette.warning.main
                      : theme.palette.success.main
                  }`,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    {b.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {format(new Date(b.startDate), "MMM d")} -{" "}
                    {format(new Date(b.endDate), "MMM d, yyyy")}
                  </Typography>

                  <Box mt={1}>
                    <Typography variant="body2">
                      Spent: ₹{b.spent?.toLocaleString() || 0} / ₹{b.amount.toLocaleString()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, percent)}
                      sx={{ height: 8, borderRadius: 5, mt: 1 }}
                    />
                  </Box>

                  <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                    {b.rollover && <Chip label="Rollover" size="small" color="info" />}
                    {nearingLimit && !overLimit && (
                      <Chip
                        icon={<WarningIcon />}
                        label="Nearing Limit"
                        size="small"
                        color="warning"
                      />
                    )}
                    {overLimit && (
                      <Chip
                        icon={<CheckCircleIcon />}
                        label="Exceeded"
                        size="small"
                        color="error"
                      />
                    )}
                  </Box>
                </CardContent>

                <CardActions>
                  <IconButton onClick={() => handleOpenDialog(b)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(b._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Budgets;
