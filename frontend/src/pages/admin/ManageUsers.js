import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

import {
  fetchUsers,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "../../services/adminUserService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ Load users from backend
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  // ✅ OPEN EDIT DIALOG
  const handleEditClick = (user) => {
    setSelectedUser({ ...user }); // avoid reference overwrite
    setOpen(true);
  };

  // ✅ DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserApi(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch (error) {
      console.error("Delete user error:", error);
    }
  };

  // ✅ SAVE EDIT CHANGES
  const handleSave = async () => {
    try {
      const updated = await updateUserApi(selectedUser._id, selectedUser);

      // update list locally
      setUsers((prev) =>
        prev.map((u) => (u._id === updated._id ? updated : u))
      );

      setOpen(false);
    } catch (error) {
      console.error("Update user error:", error);
    }
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        👥 Manage Users
      </Typography>

      <Paper
        sx={{
          p: 2,
          borderRadius: "12px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#e5e7eb" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u._id}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f3f4f6", transition: "0.3s" },
                }}
              >
                <TableCell>{u._id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>

                <TableCell align="center">
                  {/* ✅ EDIT BUTTON */}
                  <Tooltip title="Edit User">
                    <IconButton color="primary" onClick={() => handleEditClick(u)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>

                  {/* ✅ DELETE BUTTON */}
                  <Tooltip title="Delete User">
                    <IconButton color="error" onClick={() => handleDelete(u._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* ✅ EDIT USER DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>Edit User</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              value={selectedUser?.name || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, name: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Email"
              value={selectedUser?.email || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={selectedUser?.role || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                label="Role"
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
