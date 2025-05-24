import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Button,
} from "@mui/material";
import Navigation from "./Navigation";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function BrowseVendors() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  const apiUrl = "https://localhost:7154/api/Vendor";

  useEffect(() => {
    async function fetchVendors() {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Failed to fetch vendors: ${res.status}`);
        const data = await res.json();
        const mapped = data.map((v) => ({
          id: v.vendorId,
          vendorName: v.vendorName,
          email: v.email,
          isOpen: v.isOpen,
          schedule: v.schedule,
          distributeItem: v.distribute_item,
        }));

        setVendors(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVendors();
  }, []);

  const fetchVendorMenu = async (vendorId) => {
    setMenuLoading(true);
    setMenuError("");
    setMenuItems([]);
    try {
      const url = `${apiUrl}/vendor_allmenue/${vendorId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch menu: ${res.status}`);
      const data = await res.json();
      setMenuItems(data);
      setSelectedVendor(vendors.find((v) => v.id === vendorId));
    } catch (err) {
      setMenuError(err.message);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedVendor(null);
    setMenuItems([]);
    setMenuError("");
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // redirect after logout
  };

  return (
    <>
      <Navigation />

      <Container maxWidth="md" sx={{ mt: 5 }}>
        {/* Logout button at top-right */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {selectedVendor ? (
          <>
            <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
              Back to Vendors
            </Button>
            <Typography variant="h4" gutterBottom>
              Menu Items for {selectedVendor.vendorName}
            </Typography>

            {menuLoading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            )}

            {menuError && <Alert severity="error">{menuError}</Alert>}

            {!menuLoading && !menuError && menuItems.length === 0 && (
              <Typography>No menu items found.</Typography>
            )}

            {!menuLoading && !menuError && menuItems.length > 0 && (
              <Paper>
                <List>
                  {menuItems.map((item) => (
                    <ListItem key={item.menuItemId || item.id} divider>
                      <ListItemText
                        primary={`${item.itemName || item.menuName} - $${
                          item.price?.toFixed(2) ?? "N/A"
                        }`}
                        secondary={item.description ?? ""}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Available Vendors
            </Typography>

            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
              <Paper>
                <List>
                  {vendors.map((vendor) => (
                    <ListItem
                      button
                      key={vendor.id}
                      divider
                      onClick={() => fetchVendorMenu(vendor.id)}
                    >
                      <ListItemText
                        primary={vendor.vendorName}
                        secondary={
                          <>
                            Email: {vendor.email} <br />
                            Open: {vendor.isOpen ? "Yes" : "No"} <br />
                            Schedule: {vendor.schedule || "N/A"} <br />
                            Distributes: {vendor.distributeItem || "N/A"}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
}
