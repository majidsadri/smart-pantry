import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState("");

  const handleAdd = () => {
    if (itemName.trim()) {
      console.log("Adding new item:", itemName); // Log the item name
      const newItem = { name: itemName, category: "Uncategorized" };
      addItem(newItem);
      setItemName(""); // Clear the input field after adding
    } else {
      console.log("Item name is empty, not adding."); // Log if input is empty
    }
  };

  return (
    <div className="add-item">
      <TextField
        variant="outlined"
        label="Add item to pantry"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
};

export default AddItem;
