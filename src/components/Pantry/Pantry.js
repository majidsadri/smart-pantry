import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, List, ListItem, ListItemText, Paper } from "@mui/material";
import "./Pantry.css";

const Pantry = ({ updatePantryItems }) => {
  const [items, setItems] = useState([]); // Start with an empty array
  const [newItem, setNewItem] = useState(""); // State for the new item input

  // Fetch items from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched pantry items:", data);
        setItems(data || []); // Ensure data is always an array
        updatePantryItems(data.map((item) => item.name) || []); // Pass the names to the parent (App.js)
      })
      .catch((error) => console.error("Error fetching pantry items:", error));
  }, [updatePantryItems]);

  // Add a new item to the pantry and update the backend
  const addItem = () => {
    if (newItem.trim()) {
      const item = { name: newItem, category: "Uncategorized" };
      fetch("http://localhost:5000/pantry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })
        .then((response) => response.json())
        .then((newItem) => {
          const updatedItems = [...items, newItem];
          setItems(updatedItems);
          updatePantryItems(updatedItems.map((item) => item.name)); // Update the parent with the new names
        })
        .catch((error) => console.error("Error adding pantry item:", error));
      setNewItem(""); // Clear the input field after adding
    }
  };

  return (
    <Paper className="pantry-container" elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Pantry
      </Typography>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          variant="outlined"
          label="Add item to pantry"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Add
        </Button>
      </div>
      <Typography variant="h6">Current Pantry Items</Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Pantry;
