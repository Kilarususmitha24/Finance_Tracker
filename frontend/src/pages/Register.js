import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import { register as registerService } from "../services/authService";
import { TextField, Button, Typography, Box, Paper, Link as MuiLink, Container, Avatar } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation - at least 6 characters (backend requirement)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({}); // Clear previous errors
      console.log("📝 Registering user:", formData.email);
      console.log("📋 Form data:", { 
        name: formData.name, 
        email: formData.email, 
        passwordLength: formData.password.length,
        role: "user"
      });
      
      // Register user using backend API
      const response = await registerService({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "user" // Default role
      });

      console.log("✅ Registration response:", response);

      const registeredUser = response?.user;
      if (!registeredUser) {
        throw new Error("Registration failed - no user data received");
      }

      // ✅ Registration successful - redirect to login page
      showAlert("✅ Registration successful! Please login to continue.", "success");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      console.error("❌ Registration error in component:", error);
      
      // Extract error message - handle both Error objects and string messages
      let errorMessage = "";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        errorMessage = error?.response?.data?.message || 
                      error?.response?.data?.error ||
                      error?.message || 
                      "Registration failed. Please try again.";
      }
      
      console.log("📋 Error message:", errorMessage);
      
      // ✅ Check if it's a duplicate email error
      const isDuplicateEmail = 
        errorMessage.toLowerCase().includes("already registered") ||
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.toLowerCase().includes("user already");
      
      if (isDuplicateEmail) {
        // Show user-friendly message and suggest login
        errorMessage = "This email is already registered. Please login instead.";
        setErrors({ 
          submit: errorMessage,
          email: "This email is already registered"
        });
        
        // Show alert with suggestion to login
        showAlert(errorMessage, "warning");
        
        // Optionally redirect to login after a delay
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2000);
      } else {
        // Other errors - show detailed error message
        console.error("Registration failed with error:", errorMessage);
        showAlert(errorMessage, "error");
        setErrors({ submit: errorMessage });
      }
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
            <PersonAddIcon fontSize="large" />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700, mb: 1, color: "#1e293b" }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Sign up to start tracking your expenses
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email || "Enter your email address"}
                  variant="outlined"
                />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password (min 6 characters)"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || 'Minimum 6 characters'}
              inputProps={{
                minLength: 6,
              }}
            />

            {errors.submit && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.submit}
              </Typography>
            )}

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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <MuiLink
                component={Link}
                to="/login"
                underline="hover"
                sx={{ fontWeight: 600, color: "#2563eb" }}
              >
                Sign In
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

export default Register;
