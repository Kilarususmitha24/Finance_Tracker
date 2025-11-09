import React, { useState, useMemo } from "react";
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
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

// 🧩 Mock Data
const mockUsers = [
  { id: 1, name: "Meghana" },
  { id: 2, name: "Arjun" },
  { id: 3, name: "Ravi" },
  { id: 4, name: "Priya" },
];

const mockExpenses = [
  { userId: 1, description: "Groceries", category: "Food", amount: 120, date: "2025-10-01" },
  { userId: 1, description: "Netflix", category: "Entertainment", amount: 200, date: "2025-10-04" },
  { userId: 2, description: "Rent", category: "Housing", amount: 1200, date: "2025-09-30" },
  { userId: 2, description: "Electric Bill", category: "Utilities", amount: 150, date: "2025-10-02" },
  { userId: 3, description: "Gym", category: "Health", amount: 300, date: "2025-09-15" },
  { userId: 4, description: "Shopping", category: "Fashion", amount: 500, date: "2025-09-20" },
  { userId: 4, description: "Bus Ticket", category: "Transportation", amount: 100, date: "2025-09-22" },
];

export default function UserExpenses() {
  const [selectedUser, setSelectedUser] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🧮 Filter expenses based on selected user + search
  const filteredExpenses = useMemo(() => {
    return mockExpenses.filter(
      (exp) =>
        (!selectedUser || exp.userId === selectedUser) &&
        (!search || exp.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [selectedUser, search]);

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          💼 User Expenses
        </Typography>
      </Box>

      {/* USER SELECT + SEARCH */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            label="Select User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <MenuItem value="">All Users</MenuItem>
            {mockUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search by Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <Box sx={{ ml: "auto" }}>
          <Typography variant="subtitle1" color="text.secondary">
            Total:{" "}
            <Typography
              component="span"
              variant="h6"
              fontWeight={600}
              color="primary"
            >
              ${totalAmount.toFixed(2)}
            </Typography>
          </Typography>
        </Box>
      </Paper>

      {/* TABLE */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#e5e7eb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount ($)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((e, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    sx={{
                      "&:hover": { backgroundColor: "#f3f4f6", transition: "0.3s" },
                    }}
                  >
                    <TableCell>
                      {mockUsers.find((u) => u.id === e.userId)?.name || "Unknown"}
                    </TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
                      -${e.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>

      {/* CLEAR FILTERS BUTTON */}
      <Box textAlign="right" mt={2}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setSelectedUser("");
            setSearch("");
          }}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
}
