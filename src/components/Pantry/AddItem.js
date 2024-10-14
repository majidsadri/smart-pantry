import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./Pantry.css";

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState(""); // New state for amount

  const handleAdd = () => {
    if (itemName.trim() && itemAmount.trim()) {
      const newItem = { name: itemName, amount: itemAmount, category: "Uncategorized" };
      addItem(newItem);
      setItemName("");
      setItemAmount(""); // Clear after adding
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
      <TextField
        variant="outlined"
        label="Amount"
        value={itemAmount}
        onChange={(e) => setItemAmount(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
};

export default AddItem;
