import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Fade,
  Divider,
} from "@mui/material";

import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  LocalAtm as BudgetIcon,
  Settings as SystemIcon,
  NotificationsActive as ReminderIcon,
  Snooze as SnoozeIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

import { formatDistanceToNow, isBefore, subDays } from "date-fns";
import { getAlerts, markAlertRead, deleteAlert } from "../../services/alertService";
import { useTheme as useThemeContext } from "../../contexts/ThemeContext";

// ------------------- Alert Type & Severity Definitions -------------------
const AlertType = { BUDGET: "budget", SYSTEM: "system", REMINDER: "reminder" };
const AlertSeverity = { INFO: "info", WARNING: "warning", ERROR: "error", SUCCESS: "success" };

// ------------------- Helpers -------------------
const getSeverityColor = (severity) => {
  switch (severity) {
    case AlertSeverity.ERROR:
      return "#f44336";
    case AlertSeverity.WARNING:
      return "#ff9800";
    case AlertSeverity.SUCCESS:
      return "#4caf50";
    case AlertSeverity.INFO:
    default:
      return "#2196f3";
  }
};

const AlertTypeIcon = ({ type }) => {
  switch (type) {
    case AlertType.BUDGET:
      return <BudgetIcon color="primary" />;
    case AlertType.SYSTEM:
      return <SystemIcon color="action" />;
    case AlertType.REMINDER:
      return <ReminderIcon color="secondary" />;
    default:
      return <NotificationsIcon color="action" />;
  }
};

const SeverityIcon = ({ severity }) => {
  const props = { fontSize: "small" };
  switch (severity) {
    case AlertSeverity.ERROR:
      return <ErrorIcon color="error" {...props} />;
    case AlertSeverity.WARNING:
      return <WarningIcon color="warning" {...props} />;
    case AlertSeverity.SUCCESS:
      return <CheckCircleIcon color="success" {...props} />;
    default:
      return <InfoIcon color="info" {...props} />;
  }
};

// ------------------- Single Alert Card -------------------
const AlertCard = ({ alert, onAction, onDismiss, onSnooze }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const overdue = isBefore(new Date(alert.date), subDays(new Date(), 3));

  return (
    <Fade in timeout={400}>
      <Card
        variant="outlined"
        sx={{
          mb: 2,
          borderLeft: `4px solid ${getSeverityColor(alert.severity)}`,
          opacity: alert.read ? 0.75 : 1,
          bgcolor: overdue ? "#fff7f7" : "background.paper",
          transition: "0.3s",
          "&:hover": { boxShadow: 3 },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="flex-start">
            <Avatar sx={{ bgcolor: "transparent", mr: 2 }}>
              <AlertTypeIcon type={alert.type} />
            </Avatar>

            <Box flexGrow={1}>
              {/* Header */}
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" fontWeight={600}>
                  {alert.title}
                </Typography>
                <SeverityIcon severity={alert.severity} />
                {!alert.read && (
                  <Chip
                    label="New"
                    color="primary"
                    size="small"
                    sx={{ ml: 1, fontSize: "0.7rem" }}
                  />
                )}
                {overdue && (
                  <Chip
                    label="Overdue"
                    color="error"
                    size="small"
                    sx={{ ml: 1, fontSize: "0.7rem" }}
                  />
                )}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: "auto" }}
                >
                  {formatDistanceToNow(new Date(alert.date), { addSuffix: true })}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" mt={1}>
                {alert.message}
              </Typography>

              {(alert.category || alert.amount) && (
                <Box display="flex" gap={1.5} mt={1}>
                  {alert.category && <Chip label={alert.category} size="small" />}
                  {alert.amount && (
                    <Chip
                      label={`₹${alert.amount}`}
                      size="small"
                      color={alert.severity === "error" ? "error" : "default"}
                    />
                  )}
                </Box>
              )}

              <Box display="flex" mt={2} gap={1}>
                {!alert.read && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => onAction(alert._id, "read")}
                    sx={{ borderRadius: 2 }}
                  >
                    Mark as Read
                  </Button>
                )}

                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => onSnooze(alert._id)}
                  startIcon={<SnoozeIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Snooze
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => onDismiss(alert._id)}
                  startIcon={<DeleteIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Dismiss
                </Button>

                <IconButton
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => onAction(alert._id, "read")}>
                    <CheckIcon sx={{ mr: 1 }} /> Mark Read
                  </MenuItem>
                  <MenuItem onClick={() => onSnooze(alert._id)}>
                    <SnoozeIcon sx={{ mr: 1 }} /> Snooze 1h
                  </MenuItem>
                  <MenuItem onClick={() => onDismiss(alert._id)}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

// ------------------- Main Alerts Page -------------------
const Alerts = () => {
  const { mode } = useThemeContext();

  const [alerts, setAlerts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    type: AlertType.SYSTEM,
    severity: AlertSeverity.INFO,
    category: "",
    amount: "",
    date: new Date().toISOString(),
    read: false,
  });
  const [activeTab, setActiveTab] = useState("all");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [bulkAnchor, setBulkAnchor] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Load alerts from backend or localStorage
  useEffect(() => {
    const load = async () => {
      try {
        const local = JSON.parse(localStorage.getItem("alerts") || "[]");
        const backendData = (await getAlerts().catch(() => [])) || [];

        let combined = [...backendData, ...local];

        // ✅ Add sample alerts if none found
        if (combined.length === 0) {
          combined = [
            {
              _id: "sample-1",
              title: "Monthly Budget Exceeded",
              message:
                "Your spending has exceeded your set monthly budget limit by ₹2,500.",
              type: AlertType.BUDGET,
              severity: AlertSeverity.ERROR,
              category: "Groceries",
              amount: 2500,
              date: new Date(Date.now() - 86400000).toISOString(),
              read: false,
            },
            {
              _id: "sample-2",
              title: "Upcoming Bill Reminder",
              message: "Electricity bill due in 3 days. Amount: ₹1,200.",
              type: AlertType.REMINDER,
              severity: AlertSeverity.WARNING,
              category: "Utilities",
              amount: 1200,
              date: new Date().toISOString(),
              read: false,
            },
            {
              _id: "sample-3",
              title: "System Update Successful",
              message: "Your SmartSpend dashboard has been successfully updated.",
              type: AlertType.SYSTEM,
              severity: AlertSeverity.SUCCESS,
              category: "App Update",
              amount: null,
              date: new Date().toISOString(),
              read: true,
            },
          ];
        }

        setAlerts(combined);
      } catch (error) {
        console.error("Failed to load alerts:", error);
      }
    };
    load();
  }, []);

  // Persist alerts in localStorage
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Filter + Search + Sort
  const filteredAlerts = alerts
    .filter((a) => (activeTab === "all" ? true : a.type === activeTab))
    .filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.message.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "severity") return b.severity.localeCompare(a.severity);
      return 0;
    });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const categoryCounts = {
    budget: alerts.filter((a) => a.type === "budget").length,
    system: alerts.filter((a) => a.type === "system").length,
    reminder: alerts.filter((a) => a.type === "reminder").length,
  };

  const handleDismiss = async (id) => {
    await deleteAlert(id).catch(() => {});
    setAlerts((prev) => prev.filter((a) => a._id !== id));
  };

  const handleAction = async (id, action) => {
    if (action === "read") {
      await markAlertRead(id).catch(() => {});
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, read: true } : a))
      );
    }
  };

  const handleSnooze = (id) => {
    const snoozed = alerts.find((a) => a._id === id);
    if (!snoozed) return;
    setAlerts((prev) => prev.filter((a) => a._id !== id));
    setTimeout(() => {
      setAlerts((prev) => [
        { ...snoozed, date: new Date().toISOString(), read: false },
        ...prev,
      ]);
    }, 3600000); // 1 hour
  };

  // ---------------- Bulk Actions ----------------
  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const dismissAll = () => {
    setAlerts([]);
  };

  // ---------------- Create Alert ----------------
  const openCreate = () => setShowCreate(true);
  const closeCreate = () => setShowCreate(false);

  const handleCreateChange = (key, value) => {
    setNewAlert((prev) => ({ ...prev, [key]: value }));
  };

  const addAlert = () => {
    const id = `local-${Date.now()}`;
    const alertToAdd = {
      _id: id,
      ...newAlert,
      date: new Date(newAlert.date).toISOString(),
    };
    setAlerts((prev) => [alertToAdd, ...prev]);
    setNewAlert({
      title: "",
      message: "",
      type: AlertType.SYSTEM,
      severity: AlertSeverity.INFO,
      category: "",
      amount: "",
      date: new Date().toISOString(),
      read: false,
    });
    closeCreate();
  };

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <NotificationsIcon sx={{ color: "primary.main" }} />
          <Typography variant="h5" fontWeight={600}>
            Notifications Center
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread`}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Box>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={openCreate}
            startIcon={<ReminderIcon />}
          >
            Create Alert
          </Button>

          <Tooltip title="Bulk actions">
            <IconButton onClick={(e) => setBulkAnchor(e.currentTarget)}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={bulkAnchor}
            open={Boolean(bulkAnchor)}
            onClose={() => setBulkAnchor(null)}
          >
            <MenuItem onClick={() => { markAllRead(); setBulkAnchor(null); }}>Mark all read</MenuItem>
            <MenuItem onClick={() => { dismissAll(); setBulkAnchor(null); }}>Dismiss all</MenuItem>
            <MenuItem onClick={() => { setUnreadOnly((s) => !s); setBulkAnchor(null); }}>
              {unreadOnly ? "Show all" : "Show unread only"}
            </MenuItem>
          </Menu>

          <Tooltip title="Sort">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={() => window.location.reload()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => setSortBy("newest")}>Newest First</MenuItem>
            <MenuItem onClick={() => setSortBy("oldest")}>Oldest First</MenuItem>
            <MenuItem onClick={() => setSortBy("severity")}>By Severity</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* SEARCH BAR */}
      <Box mb={3} display="flex" alignItems="center" gap={2}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search alerts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
          }}
        />
      </Box>

      {/* TABS */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        scrollButtons="auto"
        variant="scrollable"
        sx={{ mb: 3 }}
      >
        <Tab label={`All (${alerts.length})`} value="all" />
        <Tab icon={<BudgetIcon />} label={`Budget (${categoryCounts.budget})`} value="budget" />
        <Tab icon={<ReminderIcon />} label={`Reminders (${categoryCounts.reminder})`} value="reminder" />
        <Tab icon={<SystemIcon />} label={`System (${categoryCounts.system})`} value="system" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {/* ALERT LIST */}
      {filteredAlerts.length === 0 ? (
        <Box textAlign="center" mt={10} opacity={0.6}>
          <NotificationsIcon sx={{ fontSize: 50 }} />
          <Typography mt={2}>No alerts found.</Typography>
        </Box>
      ) : (
        filteredAlerts
          .filter((a) => (unreadOnly ? !a.read : true))
          .map((alert) => (
            <AlertCard
              key={alert._id}
              alert={alert}
              onDismiss={handleDismiss}
              onAction={handleAction}
              onSnooze={handleSnooze}
            />
          ))
      )}

      {/* Create Alert Dialog */}
      <Dialog open={showCreate} onClose={closeCreate} fullWidth maxWidth="sm">
        <DialogTitle>Create New Alert</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="dense"
            value={newAlert.title}
            onChange={(e) => handleCreateChange("title", e.target.value)}
          />
          <TextField
            fullWidth
            label="Message"
            margin="dense"
            multiline
            rows={3}
            value={newAlert.message}
            onChange={(e) => handleCreateChange("message", e.target.value)}
          />
          <Box display="flex" gap={1} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newAlert.type}
                label="Type"
                onChange={(e) => handleCreateChange("type", e.target.value)}
              >
                <MuiMenuItem value={AlertType.BUDGET}>Budget</MuiMenuItem>
                <MuiMenuItem value={AlertType.REMINDER}>Reminder</MuiMenuItem>
                <MuiMenuItem value={AlertType.SYSTEM}>System</MuiMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={newAlert.severity}
                label="Severity"
                onChange={(e) => handleCreateChange("severity", e.target.value)}
              >
                <MuiMenuItem value={AlertSeverity.INFO}>Info</MuiMenuItem>
                <MuiMenuItem value={AlertSeverity.SUCCESS}>Success</MuiMenuItem>
                <MuiMenuItem value={AlertSeverity.WARNING}>Warning</MuiMenuItem>
                <MuiMenuItem value={AlertSeverity.ERROR}>Error</MuiMenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" gap={1} mt={1}>
            <TextField
              label="Category"
              value={newAlert.category}
              onChange={(e) => handleCreateChange("category", e.target.value)}
              fullWidth
            />
            <TextField
              label="Amount"
              value={newAlert.amount}
              onChange={(e) => handleCreateChange("amount", e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            type="datetime-local"
            label="Date"
            fullWidth
            margin="dense"
            value={new Date(newAlert.date).toISOString().substring(0, 16)}
            onChange={(e) =>
              handleCreateChange("date", new Date(e.target.value).toISOString())
            }
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreate}>Cancel</Button>
          <Button variant="contained" onClick={addAlert}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alerts;
