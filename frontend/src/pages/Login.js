import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import { login as loginService } from "../services/authService";
import {
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  Box,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const { login: updateAuthContext } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 🔹 Perform login using authService (makes API call)
      console.log("🔐 Attempting login for:", email);
      const response = await loginService(email, password);
      console.log("✅ Login response received:", response);

      // response = { user: {...}, token: "..." }
      const loggedInUser = response?.user;
      const userRole = loggedInUser?.role?.toLowerCase() || "user";

      if (!loggedInUser) {
        console.error("❌ No user in response:", response);
        throw new Error("Login failed. Please check your credentials.");
      }

      console.log("👤 Logged in user:", { 
        id: loggedInUser._id, 
        email: loggedInUser.email, 
        role: loggedInUser.role 
      });

      // ✅ Update AuthContext with the logged-in user
      // The token and user are already saved to localStorage by authService
      console.log("🔄 Updating AuthContext...");
      const authResult = await updateAuthContext(loggedInUser);
      console.log("✅ AuthContext updated:", authResult);

      // Verify token and user are in localStorage
      const tokenCheck = localStorage.getItem("token");
      const userCheck = localStorage.getItem("user");
      console.log("📦 Storage check:", { 
        hasToken: !!tokenCheck, 
        hasUser: !!userCheck 
      });

      if (!tokenCheck || !userCheck) {
        throw new Error("Failed to save authentication data");
      }

      showAlert("✅ Login successful!", "success");

      // ✅ Wait a moment for AuthContext to fully update
      await new Promise(resolve => setTimeout(resolve, 100));

      // ✅ Redirect based on role
      const redirectPath =
        userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";
      
      console.log("🚀 Redirecting to:", redirectPath);
      console.log("👤 User role:", userRole);
      console.log("📋 User object:", loggedInUser);

      // Navigate to the dashboard
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      showAlert(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid credentials. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #2563eb, #9333ea)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.9)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#2563eb",
              width: 60,
              height: 60,
              mx: "auto",
              mb: 2,
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign in to continue to your dashboard
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Login as</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Login as"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.3,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg, #2563eb, #9333ea)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1d4ed8, #7e22ce)",
                },
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <MuiLink
                component={Link}
                to="/register"
                underline="hover"
                sx={{ fontWeight: 600, color: "#2563eb" }}
              >
                Sign Up
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* Background animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </Box>
  );
}

export default Login;
