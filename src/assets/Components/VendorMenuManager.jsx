import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export default function VendorMenuManager() {
  const { userId: vendorId, userType, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const baseUrl = "https://localhost:7154/api/Vendor";

  useEffect(() => {
    if (!vendorId || userType !== "Vendor") {
      setError("Vendor ID is missing or user not authorized.");
      return;
    }
    fetchMenuItems();
  }, [vendorId, userType]);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${baseUrl}/vendor_allmenue/${vendorId}`);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      setError(err.message);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (item = null) => {
    setSelectedItem(
      item || { itemName: "", description: "", price: "", availability: true }
    );
    setDialogOpen(true);
    setError("");
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!selectedItem.itemName || selectedItem.price === "") {
      setError("Name and Price are required.");
      return;
    }
    setError("");
    try {
      const method = selectedItem.menuItemId ? "PUT" : "POST";
      const url = selectedItem.menuItemId
        ? `${baseUrl}/edit_menue/${selectedItem.menuItemId}?vendorId=${vendorId}`
        : `${baseUrl}/menu_add?vendorId=${vendorId}`;

      const body = {
        itemName: selectedItem.itemName,
        description: selectedItem.description,
        price: parseFloat(selectedItem.price),
        availability: selectedItem.availability,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to save menu item");
      }

      await fetchMenuItems();
      closeDialog();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    setError("");
    try {
      const res = await fetch(`${baseUrl}/del_menue/${id}?vendorId=${vendorId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete menu item");

      await fetchMenuItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login"); // redirect to login page after logout
  };

  if (!isLoggedIn || userType !== "Vendor") {
    return <Typography>You must be logged in as a vendor to manage menu.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Logout button at the top right */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Vendor Menu Management
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && (
        <>
          <Button variant="contained" onClick={() => openDialog()} sx={{ mb: 2 }}>
            Add New Menu Item
          </Button>

          {menuItems.length === 0 && (
            <Typography>No menu items found.</Typography>
          )}

          <Paper>
            <List>
              {menuItems.map((item) => (
                <ListItem
                  key={item.menuItemId}
                  divider
                  secondaryAction={
                    <>
                      <IconButton edge="end" onClick={() => openDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(item.menuItemId)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemText
                    primary={`${item.itemName} - $${item.price}`}
                    secondary={`${item.description || ""} | Available: ${
                      item.availability ? "Yes" : "No"
                    }`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>{selectedItem?.menuItemId ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Item Name"
            name="itemName"
            fullWidth
            required
            margin="dense"
            value={selectedItem?.itemName || ""}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            value={selectedItem?.description || ""}
            onChange={handleChange}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            fullWidth
            required
            margin="dense"
            value={selectedItem?.price || ""}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedItem?.availability || false}
                name="availability"
                onChange={handleChange}
              />
            }
            label="Available"
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {selectedItem?.menuItemId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
