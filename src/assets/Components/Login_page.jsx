import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase/firebase";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    userType: "Student",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://localhost:7154/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserType: formData.userType,
          Email: formData.email,
          Password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        const userRole = data.userType; // <-- fix is here (lowercase 'u')

        if (!userRole) {
          setError("Login succeeded but user role is missing from response.");
          setLoading(false);
          return;
        }

        login(data.token, userRole);
        console.log("Logged in user role:", userRole);

        if (userRole.toLowerCase() === "vendor") {
          navigate("/vendor-menu");
        } else if (userRole.toLowerCase() === "student") {
          navigate("/browse-vendors");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await fetch(
        "https://localhost:7154/api/Login/google-auth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: await user.getIdToken(),
            role: formData.userType,
          }),
        }
      );

      const data = await response.json();
      console.log("Google login response data:", data);

      if (response.ok) {
        const userRole = data.userType || data.role || data.userRole;

        if (!userRole) {
          setError("Google login succeeded but user role missing.");
          setGoogleLoading(false);
          return;
        }

        login(data.token, userRole);

        if (userRole.toLowerCase() === "vendor") {
          navigate("/vendor-menu");
        } else if (userRole.toLowerCase() === "student") {
          navigate("/browse-vendors");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Google login failed.");
      }
    } catch (error) {
      setError(error.message || "Google login failed. Please try again.");
      console.error("Google login error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              id="userType"
              name="userType"
              value={formData.userType}
              label="User Type"
              onChange={handleChange}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Vendor">Vendor</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoComplete="username"
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <Divider sx={{ my: 2 }}>OR</Divider>

          <Button
            variant="outlined"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            fullWidth
            sx={{ py: 1.5 }}
          >
            {googleLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Signing in with Google...
              </>
            ) : (
              "Continue with Google"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
