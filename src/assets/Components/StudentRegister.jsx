import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    address: "",
    department: "",
    studentId: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@cuet.ac.bd")) {
      setError("Email must be @cuet.ac.bd");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "https://localhost:7154/api/Student/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");
      // Optionally, reset form fields here:
      setFormData({
        userName: "",
        email: "",
        address: "",
        department: "",
        studentId: "",
        password: "",
      });
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Registration error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          Student Registration
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="User Name"
            name="userName"
            fullWidth
            required
            margin="normal"
            value={formData.userName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            helperText="Must be a valid CUET email"
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />
          <TextField
            label="Department"
            name="department"
            fullWidth
            required
            margin="normal"
            value={formData.department}
            onChange={handleChange}
          />
          <TextField
            label="Student ID"
            name="studentId"
            fullWidth
            required
            margin="normal"
            value={formData.studentId}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            helperText="At least 6 characters"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
