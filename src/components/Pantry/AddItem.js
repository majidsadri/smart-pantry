import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Typography } from "@mui/material";
import "./Pantry.css";

const PEXELS_API_KEY = "CqDXEkdz6MLbZaaVCye7GioUsuRrVaG2ATmIFeNHX3EF2o4gbpOPERao"; // Replace with your Pexels API key

const AddItem = ({ addItem }) => {
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState(""); // State for amount
  const [images, setImages] = useState([]); // State to hold images
  const [selectedImage, setSelectedImage] = useState(""); // State for the selected image

  const fetchImages = async (query) => {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=10`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    const data = await response.json();
    setImages(data.photos);
  };

  useEffect(() => {
    if (itemName) {
      fetchImages(itemName); // Fetch images when the item name is updated
    }
  }, [itemName]);

  const handleAdd = () => {
    if (itemName.trim() && itemAmount.trim() && selectedImage) {
      const newItem = { name: itemName, amount: itemAmount, category: "Uncategorized", image: selectedImage };
      addItem(newItem);
      setItemName("");
      setItemAmount(""); // Clear after adding
      setSelectedImage(""); // Clear selected image
      setImages([]); // Clear images
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

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Select an Image
      </Typography>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={4} key={image.id}>
            <img
              src={image.src.small}
              alt={image.alt}
              style={{ cursor: "pointer", width: "100%", borderRadius: "8px", border: selectedImage === image.src.small ? '2px solid blue' : 'none' }}
              onClick={() => setSelectedImage(image.src.small)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AddItem;
