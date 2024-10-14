import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, Paper, Typography, Grid, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Pantry = ({ updatePantryItems }) => {
  const [pantryInput, setPantryInput] = useState("");
  const [amount, setAmount] = useState("");
  const [measurement, setMeasurement] = useState(""); // Use a dropdown to select measurement
  const [pantryList, setPantryList] = useState([]);

  useEffect(() => {
    // Fetch pantry items from the backend (replace with your actual API call)
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => {
        setPantryList(data || []);
        updatePantryItems(data.map((item) => item.name) || []);
      })
      .catch((error) => console.error("Error fetching pantry items:", error));
  }, [updatePantryItems]);

  const handleAddItem = () => {
    if (pantryInput.trim() && amount.trim() && measurement.trim()) {
      const newItem = { name: pantryInput.trim(), amount: amount.trim(), measurement: measurement.trim() };

      console.log("Adding item:", newItem); // Debug log to check the data being sent

      // Send the new item to the backend (replace with your actual API call)
      fetch("http://localhost:5000/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((addedItem) => {
          console.log("Item successfully added:", addedItem); // Debug log success
          const updatedPantryList = [...pantryList, addedItem];
          setPantryList(updatedPantryList);
          updatePantryItems(updatedPantryList.map((item) => item.name));
        })
        .catch((error) => {
          console.error("Error adding pantry item:", error); // Debug log error
        });

      // Clear the form fields
      setPantryInput("");
      setAmount("");
      setMeasurement("");
    } else {
      console.warn("Please fill in all fields before adding."); // Log a warning if any field is missing
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    // Remove the item from the backend (replace with your actual API call)
    fetch(`http://localhost:5000/pantry/${itemToRemove.id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedPantryList = pantryList.filter((item) => item.id !== itemToRemove.id);
        setPantryList(updatedPantryList);
        updatePantryItems(updatedPantryList.map((item) => item.name));
      })
      .catch((error) => console.error("Error removing pantry item:", error));
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Pantry Management
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Add item to pantry"
            value={pantryInput}
            onChange={(e) => setPantryInput(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          {/* Dropdown for measurement */}
          <FormControl fullWidth>
            <InputLabel>Measurement</InputLabel>
            <Select
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              fullWidth
            >
              <MenuItem value="grams">grams</MenuItem>
              <MenuItem value="units">units</MenuItem>
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="liters">liters</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            fullWidth
            style={{ height: "100%" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Current Pantry Items
      </Typography>

      <List>
        {pantryList.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={`${item.name} (${item.amount} ${item.measurement})`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Pantry;
