import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Typography,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios"; // Import axios for making HTTP requests

const Pantry = ({ updatePantryItems }) => {
  const [pantryInput, setPantryInput] = useState("");
  const [amount, setAmount] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [pantryList, setPantryList] = useState([]);
  const [images, setImages] = useState([]); // State to hold fetched images
  const [selectedImage, setSelectedImage] = useState(""); // State to hold selected image

  const API_KEY = 'CqDXEkdz6MLbZaaVCye7GioUsuRrVaG2ATmIFeNHX3EF2o4gbpOPERao';

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

  const fetchImages = async (query) => {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=5`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: API_KEY,
        },
      });
      setImages(response.data.photos); // Set the fetched images in state
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleAddItem = () => {
    if (pantryInput.trim() && amount.trim() && measurement.trim()) {
      const newItem = {
        name: pantryInput.trim(),
        amount: amount.trim(),
        measurement: measurement.trim(),
        image: selectedImage, // Include selected image URL
      };

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
        .catch((error) => {
          console.error("Error adding pantry item:", error);
        });

      // Clear the form fields
      setPantryInput("");
      setAmount("");
      setMeasurement("");
      setSelectedImage(""); // Clear the selected image
      setImages([]); // Clear the images
    } else {
      console.warn("Please fill in all fields before adding.");
    }
  };

  const handleRemoveItem = (itemToRemove) => {
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
            onChange={(e) => {
              setPantryInput(e.target.value);
              fetchImages(e.target.value); // Fetch images when input changes
            }}
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
            {item.image ? (
              <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', marginRight: '10px', backgroundColor: '#eee' }} />
            )}
            <ListItemText primary={`${item.name} (${item.amount} ${item.measurement})`} />
          </ListItem>
        ))}
      </List>

      {/* Display images fetched from Pexels */}
      {images.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">Select an Image</Typography>
          <Grid container spacing={1}>
            {images.map((image) => (
              <Grid item xs={2} key={image.id}>
                <img
                  src={image.src.medium}
                  alt={image.alt}
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => setSelectedImage(image.src.medium)} // Set selected image
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </Paper>
  );
};

export default Pantry;
