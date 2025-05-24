import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    vendorName: "",
    email: "",
    password: "",
    isOpen: true,
    schedule: "",
    distributeItem: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Email is required");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!formData.vendorName) {
      setError("Vendor name is required");
      return;
    }

    setError("");

    try {
      const response = await fetch("https://localhost:7154/api/Vendor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
        return;
      }

      alert("Vendor registration successful! Please login.");
      // Optionally reset form fields
      setFormData({
        vendorName: "",
        email: "",
        password: "",
        isOpen: true,
        schedule: "",
        distributeItem: "",
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
          Vendor Registration
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Vendor Name"
            name="vendorName"
            fullWidth
            required
            margin="normal"
            value={formData.vendorName}
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
          <FormControlLabel
            control={
              <Checkbox
                name="isOpen"
                checked={formData.isOpen}
                onChange={handleChange}
              />
            }
            label="Is Open"
          />
          <TextField
            label="Schedule"
            name="schedule"
            fullWidth
            margin="normal"
            value={formData.schedule}
            onChange={handleChange}
          />
          <TextField
            label="Distribute Item"
            name="distributeItem"
            fullWidth
            margin="normal"
            value={formData.distributeItem}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
