import React, { useState, useEffect } from "react";
import { Typography, TextField, Button } from "@mui/material";
import AddItem from "./AddItem";
import ItemList from "./ItemList";
import "./Pantry.css";

const Pantry = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching pantry items:", error));
  }, []);

  const addItem = (item) => {
    fetch("http://localhost:5000/pantry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((newItem) => setItems([...items, newItem]))
      .catch((error) => console.error("Error adding pantry item:", error));
  };

  return (
    <div className="pantry-container">
      <Typography variant="h5" gutterBottom>
        Pantry
      </Typography>
      <AddItem addItem={addItem} />
      <ItemList items={items} />
    </div>
  );
};

export default Pantry;
