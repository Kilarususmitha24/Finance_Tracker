import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useAlert } from "../contexts/AlertContext";
import { login as loginService } from "../services/authService";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Avatar,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: updateAuthContext } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("🔐 Attempting login for:", email);

      const response = await loginService(email, password);
      const loggedInUser = response?.user;

      if (!loggedInUser) {
        throw new Error("Invalid credentials");
      }

      const userRole = loggedInUser.role?.toLowerCase() || "user";

      console.log("👤 Logged in user:", loggedInUser);

      await updateAuthContext(loggedInUser);

      showAlert("Login successful!", "success");

      // Role-based redirect
      const redirectPath =
        userRole === "admin" ? "/admin/dashboard" : "/user/dashboard";

      console.log("🚀 Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      showAlert(
        error?.response?.data?.message || error.message || "Login failed",
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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.9)",
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

          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome Back
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <MuiLink component={Link} to="/register">
                Sign Up
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
