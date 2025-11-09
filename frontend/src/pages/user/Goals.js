import React, { useState, useEffect } from "react";
import {
  Box, Typography, Grid, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  LinearProgress, Chip, IconButton, MenuItem, Select,
  InputLabel, FormControl, Tabs, Tab, Card,
  CardContent, Snackbar, Alert
} from "@mui/material";

import {
  Add as AddIcon,
  Edit,
  Delete,
  AttachMoney,
  CalendarToday,
  Category,
  Star,
  TrendingUp,
  Cancel
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal,
} from "../../services/goalService";

const GOAL_STATUS = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const GOAL_CATEGORIES = [
  "Travel", "Education", "Home", "Vehicle", "Retirement",
  "Emergency Fund", "Investment", "Wedding", "Health", "Business",
  "Debt Repayment", "Family", "Gift", "Technology", "Hobby", "Other",
];

const PRIORITY_LEVELS = ["Low", "Medium", "High"];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") =>
    setSnack({ open: true, message, severity });

  const [form, setForm] = useState({
    name: "",
    description: "",
    target: "",
    saved: "",
    category: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: null,
    notes: "",
  });

  useEffect(() => {
    (async () => {
      await loadGoals();
    })();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      if (data.length === 0) {
        // ✅ Add default sample goals
        const sampleGoals = [
          {
            _id: "1",
            name: "Trip to Goa",
            description: "Save for a 5-day vacation to Goa with friends.",
            target: 50000,
            saved: 15000,
            category: "Travel",
            priority: "High",
            status: "In Progress",
            dueDate: new Date(2025, 11, 20),
            notes: "Book hotels early for discounts.",
            contributions: [
              { _id: "c1", amount: 5000, date: new Date(), note: "Initial deposit" },
              { _id: "c2", amount: 10000, date: new Date(), note: "Monthly saving" },
            ],
          },
          {
            _id: "2",
            name: "Buy New Laptop",
            description: "Purchase a new MacBook for development.",
            target: 120000,
            saved: 60000,
            category: "Technology",
            priority: "Medium",
            status: "In Progress",
            dueDate: new Date(2026, 2, 10),
            notes: "Wait for seasonal offers.",
            contributions: [
              { _id: "c3", amount: 40000, date: new Date(), note: "Bonus savings" },
              { _id: "c4", amount: 20000, date: new Date(), note: "Freelance payment" },
            ],
          },
          {
            _id: "3",
            name: "Emergency Fund",
            description: "Maintain at least 6 months’ worth of expenses.",
            target: 100000,
            saved: 100000,
            category: "Emergency Fund",
            priority: "High",
            status: "Completed",
            dueDate: new Date(2025, 8, 30),
            notes: "Keep in liquid savings account.",
            contributions: [
              { _id: "c5", amount: 30000, date: new Date(), note: "Initial funding" },
              { _id: "c6", amount: 70000, date: new Date(), note: "Salary savings" },
            ],
          },
        ];
        setGoals(sampleGoals);
      } else {
        setGoals(data);
      }
    } catch {
      showSnack("Failed to load goals", "error");
    }
  };

  const handleSave = async () => {
    const goalData = {
      ...form,
      target: Number(form.target),
      saved: Number(form.saved || 0),
    };
    try {
      if (editingGoal) {
        await updateGoal(editingGoal, goalData);
        showSnack("Goal updated successfully");
      } else {
        await createGoal(goalData);
        showSnack("Goal created successfully");
      }
      resetForm();
      loadGoals();
    } catch {
      showSnack("Error saving goal", "error");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal._id);
    setForm({
      name: goal.name,
      description: goal.description || "",
      target: goal.target,
      saved: goal.saved || 0,
      category: goal.category || "",
      priority: goal.priority || "Medium",
      status: goal.status || "Not Started",
      dueDate: goal.dueDate ? new Date(goal.dueDate) : null,
      notes: goal.notes || "",
    });
    setOpen(true);
  };

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    try {
      await deleteGoal(id);
      showSnack("Goal deleted");
      loadGoals();
    } catch {
      showSnack("Error deleting goal", "error");
    }
  };

  const handleContribute = async (goalId, amount) => {
    try {
      await contributeToGoal(goalId, Number(amount));
      showSnack("Contribution added");
      loadGoals();
    } catch {
      showSnack("Failed to add contribution", "error");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      target: "",
      saved: "",
      category: "",
      priority: "Medium",
      status: "Not Started",
      dueDate: null,
      notes: "",
    });
    setEditingGoal(null);
    setOpen(false);
  };

  const renderContributionHistory = (items = []) => {
    if (!items.length)
      return <Typography>No contributions yet.</Typography>;
    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Contribution History
        </Typography>
        <Box maxHeight={200} overflow="auto">
          {[...items].reverse().map((c) => (
            <Box key={c._id} display="flex" justifyContent="space-between" py={1}>
              <Box>
                <Typography variant="body2">
                  {new Date(c.date).toLocaleDateString()}
                </Typography>
                {c.note && (
                  <Typography variant="caption" color="text.secondary">{c.note}</Typography>
                )}
              </Box>
              <Typography color="success.main" fontWeight="bold">
                +₹{c.amount.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Financial Goals</Typography>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>
          Add Goal
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="All Goals" />
        <Tab label="In Progress" />
        <Tab label="Completed" />
      </Tabs>

      <Grid container spacing={3}>
        {goals
          .filter((g) =>
            activeTab === 1 ? g.status === "In Progress" :
            activeTab === 2 ? g.status === "Completed" : true
          )
          .map((goal) => {
            const percent = (goal.saved / goal.target) * 100;
            const completed = goal.status === "Completed";

            return (
              <Grid item xs={12} md={6} lg={4} key={goal._id}>
                <Card sx={{ p: 2, borderRadius: 3, transition: "0.3s", "&:hover": { transform: "scale(1.02)" } }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">{goal.name}</Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEdit(goal)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteGoal(goal._id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {goal.description}
                    </Typography>

                    <Box my={2}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Progress</Typography>
                        <Typography variant="body2">
                          ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(100, percent)}
                        sx={{ height: 8, borderRadius: 5, mt: 1 }}
                      />
                    </Box>

                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip icon={<Category />} label={goal.category} size="small" />
                      <Chip icon={<Star />} label={goal.priority} size="small" />
                      {goal.dueDate && (
                        <Chip
                          icon={<CalendarToday />}
                          label={`Due: ${new Date(goal.dueDate).toLocaleDateString()}`}
                          size="small"
                        />
                      )}
                      <Chip
                        label={goal.status}
                        size="small"
                        color={
                          goal.status === "Completed"
                            ? "success"
                            : goal.status === "In Progress"
                            ? "info"
                            : "default"
                        }
                      />
                    </Box>

                    <Box mt={2}>
                      {!completed && (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AttachMoney />}
                          onClick={() => {
                            const amt = prompt("Enter contribution amount");
                            if (amt && !isNaN(amt)) {
                              handleContribute(goal._id, amt);
                            }
                          }}
                        >
                          Add Contribution
                        </Button>
                      )}

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        startIcon={<TrendingUp />}
                        onClick={() => setSelectedGoal(goal)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Goals;
