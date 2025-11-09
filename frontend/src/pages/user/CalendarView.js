import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useTheme,
} from "@mui/material";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const CalendarView = () => {
  const theme = useTheme();

  // ✅ Expense + Income Events
  const allEvents = [
    { id: 1, title: "Salary Received (₹40,000)", date: "2025-11-01", category: "Income", color: "#22C55E" },
    { id: 2, title: "Rent Payment (₹8,000)", date: "2025-11-03", category: "Housing", color: "#EF4444" },
    { id: 3, title: "Movie Night (₹500)", date: "2025-11-10", category: "Entertainment", color: "#3B82F6" },
    { id: 4, title: "Groceries (₹2,000)", date: "2025-11-14", category: "Groceries", color: "#EAB308" },
    { id: 5, title: "Freelance Payment (₹12,000)", date: "2025-11-20", category: "Income", color: "#10B981" },
    { id: 6, title: "Electricity Bill (₹900)", date: "2025-11-22", category: "Utilities", color: "#F97316" },
    { id: 7, title: "Fuel (₹1,200)", date: "2025-11-05", category: "Transportation", color: "#6366F1" },
  ];

  const [categoryFilter, setCategoryFilter] = useState("All");

  // ✅ Category List
  const categories = ["All", "Income", "Groceries", "Housing", "Entertainment", "Utilities", "Transportation"];

  // ✅ Filtered Events
  const filteredEvents = useMemo(() => {
    if (categoryFilter === "All") return allEvents;
    return allEvents.filter((e) => e.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        📅 Expense & Income Calendar
      </Typography>

      {/* ✅ Filter Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <FormControl size="small" sx={{ width: 220 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Filter by Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          label={`Showing: ${filteredEvents.length} events`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* ✅ Calendar */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: 4,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1E293B, #0F172A)"
              : "linear-gradient(135deg, #F8FAFC, #EEF2FF)",
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="78vh"
          events={filteredEvents}
          eventDidMount={(info) => {
            // ✅ Use tippy.js for tooltips
            tippy(info.el, {
              content: info.event.title,
              placement: "top",
              arrow: true,
              theme: "light-border",
            });
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
        />
      </Paper>
    </Box>
  );
};

export default CalendarView;
