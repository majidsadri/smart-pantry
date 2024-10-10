import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./Pantry.css";

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState("");

  const handleAdd = () => {
    if (itemName.trim()) {
      const newItem = { name: itemName, category: "Uncategorized" };
      addItem(newItem);
      setItemName("");
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
