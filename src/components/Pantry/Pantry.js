import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Pantry = ({ updatePantryItems }) => {
  const [pantryInput, setPantryInput] = useState("");
  const [pantryList, setPantryList] = useState([]);

  useEffect(() => {
    // Fetch pantry items from the backend
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => {
        setPantryList(data || []);
        updatePantryItems(data.map((item) => item.name) || []);
      })
      .catch((error) => console.error("Error fetching pantry items:", error));
  }, [updatePantryItems]);

  const handleAddItem = () => {
    if (pantryInput.trim()) {
      const newItem = { name: pantryInput.trim(), category: "Uncategorized" };
      // Send the new item to the backend
      fetch("http://localhost:5000/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((addedItem) => {
          const updatedPantryList = [...pantryList, addedItem];
          setPantryList(updatedPantryList);
          updatePantryItems(updatedPantryList.map((item) => item.name));
        })
        .catch((error) => console.error("Error adding pantry item:", error));
      setPantryInput("");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    // Remove the item from the backend
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
      <div style={{ marginBottom: "20px" }}>
        <TextField
          label="Add item to pantry"
          value={pantryInput}
          onChange={(e) => setPantryInput(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleAddItem}>
          Add
        </Button>
      </div>

      <Typography variant="h6">Current Pantry Items</Typography>
      <List>
        {pantryList.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Pantry;
