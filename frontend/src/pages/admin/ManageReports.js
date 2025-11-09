import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Alert,
  Stack,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  DateRange as DateRangeIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAlert } from "../../contexts/AlertContext";
import { fetchReports, generateReport, downloadReport } from "../../services/reportService";
import { getAllUsers } from "../../services/adminService";
import API from "../../services/axiosInstance";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#8dd1e1", "#d0ed57"];

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [reportStats, setReportStats] = useState(null);
  const { showAlert } = useAlert();

  // Form state for generating new report
  const [newReport, setNewReport] = useState({
    title: "",
    type: "monthly",
    userId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsData, usersData] = await Promise.all([
        fetchReports(),
        getAllUsers(),
      ]);
      setReports(reportsData || []);
      setUsers(usersData || []);
      calculateStats(reportsData || []);
    } catch (err) {
      console.error("Failed to load data", err);
      showAlert("Failed to load reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reportsData) => {
    const stats = {
      totalReports: reportsData.length,
      monthlyReports: reportsData.filter((r) => r.type === "monthly").length,
      yearlyReports: reportsData.filter((r) => r.type === "yearly").length,
      customReports: reportsData.filter((r) => r.type === "custom").length,
      recentReports: reportsData.filter((r) => {
        const reportDate = new Date(r.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return reportDate >= weekAgo;
      }).length,
    };
    setReportStats(stats);
  };

  const handleGenerate = async () => {
    if (!newReport.title.trim()) {
      showAlert("Please enter a report title", "warning");
      return;
    }

    try {
      setGenerating(true);
      const reportData = {
        title: newReport.title,
        type: newReport.type,
        ...(newReport.userId && { userId: newReport.userId }),
        ...(newReport.startDate && { startDate: newReport.startDate }),
        ...(newReport.endDate && { endDate: newReport.endDate }),
      };

      await generateReport(reportData.title, reportData.type, reportData);
      showAlert("✅ Report generated successfully!", "success");
      setOpenDialog(false);
      setNewReport({
        title: "",
        type: "monthly",
        userId: "",
        startDate: "",
        endDate: "",
      });
      loadData();
    } catch (err) {
      console.error("Failed to generate report", err);
      showAlert(err?.message || "Failed to generate report", "error");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const result = await downloadReport(id);
      if (result?.fileUrl || result?.data?.fileUrl) {
        window.open(result.fileUrl || result.data.fileUrl, "_blank");
        showAlert("Opening report...", "info");
      } else {
        showAlert("Report file not available", "warning");
      }
    } catch (err) {
      console.error("Failed to download report", err);
      showAlert("Failed to download report", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      await API.delete(`/reports/${id}`);
      showAlert("✅ Report deleted successfully", "success");
      loadData();
    } catch (err) {
      console.error("Failed to delete report", err);
      showAlert("Failed to delete report", "error");
    }
  };

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesUser =
      selectedUser === "all" ||
      (report.createdBy && report.createdBy._id === selectedUser) ||
      (typeof report.createdBy === "string" && report.createdBy === selectedUser);

    return matchesSearch && matchesType && matchesUser;
  });

  // Chart data for report types
  const reportTypeData = reportStats
    ? [
        { name: "Monthly", value: reportStats.monthlyReports },
        { name: "Yearly", value: reportStats.yearlyReports },
        { name: "Custom", value: reportStats.customReports },
      ]
    : [];

  // Chart data for reports over time
  const reportsOverTime = reports
    .slice(0, 10)
    .map((report) => ({
      name: new Date(report.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: 1,
    }))
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.name);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={600}>
          📊 Manage Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Generate New Report
        </Button>
      </Box>

      {/* Statistics Cards */}
      {reportStats && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: "center", borderRadius: 3 }}>
              <CardContent>
                <DescriptionIcon sx={{ fontSize: 40, color: "#8884d8", mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {reportStats.totalReports}
                </Typography>
                <Typography color="text.secondary">Total Reports</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: "center", borderRadius: 3 }}>
              <CardContent>
                <DateRangeIcon sx={{ fontSize: 40, color: "#82ca9d", mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {reportStats.monthlyReports}
                </Typography>
                <Typography color="text.secondary">Monthly</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: "center", borderRadius: 3 }}>
              <CardContent>
                <AssessmentIcon sx={{ fontSize: 40, color: "#ffc658", mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {reportStats.yearlyReports}
                </Typography>
                <Typography color="text.secondary">Yearly</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: "center", borderRadius: 3 }}>
              <CardContent>
                <TrendingUpIcon sx={{ fontSize: 40, color: "#ff7f7f", mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {reportStats.customReports}
                </Typography>
                <Typography color="text.secondary">Custom</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: "center", borderRadius: 3 }}>
              <CardContent>
                <RefreshIcon sx={{ fontSize: 40, color: "#8dd1e1", mb: 1 }} />
                <Typography variant="h5" fontWeight={600}>
                  {reportStats.recentReports}
                </Typography>
                <Typography color="text.secondary">Last 7 Days</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Reports by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2}>
              Reports Generated Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            size="small"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
            sx={{ minWidth: 250 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={filterType}
              label="Report Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>User</InputLabel>
            <Select
              value={selectedUser}
              label="User"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <MenuItem value="all">All Users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{ ml: "auto" }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>

      {/* Reports Table */}
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No reports found. Generate a new report to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report._id || report.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>
                        {report.title || "Untitled Report"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.type || "N/A"}
                        size="small"
                        color={
                          report.type === "monthly"
                            ? "primary"
                            : report.type === "yearly"
                            ? "secondary"
                            : "default"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {report.createdBy?.name || "Admin" || "System"}
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.fileUrl ? "Available" : "Pending"}
                        size="small"
                        color={report.fileUrl ? "success" : "warning"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {report.fileUrl && (
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleDownload(report._id || report.id)}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="View Details">
                          <IconButton size="small" color="info">
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(report._id || report.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Generate Report Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Report</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Report Title"
              value={newReport.title}
              onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
              placeholder="e.g., Monthly Financial Summary"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={newReport.type}
                label="Report Type"
                onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>User (Optional)</InputLabel>
              <Select
                value={newReport.userId}
                label="User (Optional)"
                onChange={(e) => setNewReport({ ...newReport, userId: e.target.value })}
              >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newReport.type === "custom" && (
              <>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newReport.startDate}
                  onChange={(e) => setNewReport({ ...newReport, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newReport.endDate}
                  onChange={(e) => setNewReport({ ...newReport, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerate}
            variant="contained"
            disabled={generating || !newReport.title.trim()}
          >
            {generating ? <CircularProgress size={24} /> : "Generate Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
