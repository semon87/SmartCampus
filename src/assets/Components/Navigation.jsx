import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

export default function Navigation({ minimal = false }) {
  const {
    isLoggedIn,
    userId,
    role,
    logout,
    toggleVendorAvailability,
    isVendorOpen,
  } = useAuth();

  // Debug log to check role value
  console.log("Navigation role:", role);

  // Show minimal navbar if minimal=true
  if (minimal) {
    return (
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            sx={{
              color: "inherit",
              textDecoration: "none",
              fontWeight: "bold",
              "&:hover": { color: "secondary.main" },
            }}
          >
            SmartCampus
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              component={NavLink}
              to="/register/vendor"
              color="inherit"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                "&.active": {
                  textDecoration: "underline",
                  color: "secondary.main",
                },
              }}
            >
              Vendor Registration
            </Button>

            <Button
              component={NavLink}
              to="/register/student"
              color="inherit"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                "&.active": {
                  textDecoration: "underline",
                  color: "secondary.main",
                },
              }}
            >
              Student Registration
            </Button>

            <Button
              component={NavLink}
              to="/login"
              color="inherit"
              sx={{
                fontWeight: "bold",
                textDecoration: "none",
                "&.active": {
                  textDecoration: "underline",
                  color: "secondary.main",
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // Full role-based navigation
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo / Brand */}
        <Typography
          variant="h6"
          component={NavLink}
          to="/"
          sx={{
            color: "inherit",
            textDecoration: "none",
            fontWeight: "bold",
            "&:hover": { color: "secondary.main" },
          }}
        >
          SmartCampus
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {!isLoggedIn && (
            <>
              <Button
                component={NavLink}
                to="/register/vendor"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&.active": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                Vendor Registration
              </Button>

              <Button
                component={NavLink}
                to="/register/student"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&.active": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                Student Registration
              </Button>

              <Button
                component={NavLink}
                to="/login"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&.active": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                Login
              </Button>
            </>
          )}

          {isLoggedIn && role?.toLowerCase() === "vendor" && (
            <>
              <Button
                component={NavLink}
                to="/vendor-menu"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&.active": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                Menu Management
              </Button>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {isVendorOpen ? "Open" : "Closed"}
                </Typography>
                <Switch
                  checked={isVendorOpen}
                  onChange={() => toggleVendorAvailability(!isVendorOpen)}
                  color="secondary"
                  inputProps={{ "aria-label": "toggle shop availability" }}
                />
              </Box>

              <Button
                variant="outlined"
                color="secondary"
                onClick={logout}
                size="small"
              >
                Logout
              </Button>
            </>
          )}

          {isLoggedIn && role?.toLowerCase() === "student" && (
            <>
              <Button
                component={NavLink}
                to="/browse-vendors"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  "&.active": {
                    textDecoration: "underline",
                    color: "secondary.main",
                  },
                }}
              >
                Browse Vendors
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={logout}
                size="small"
              >
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* User Info */}
        {isLoggedIn && (
          <Typography variant="body1" sx={{ ml: 2, fontWeight: "medium" }}>
            Welcome, {role} {userId}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}
