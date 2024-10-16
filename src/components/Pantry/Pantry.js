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
import axios from "axios";
import { differenceInDays } from "date-fns";

const Pantry = ({ updatePantryItems, addToShoppingList }) => {
  const [pantryInput, setPantryInput] = useState("");
  const [amount, setAmount] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [pantryList, setPantryList] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const API_KEY = 'CqDXEkdz6MLbZaaVCye7GioUsuRrVaG2ATmIFeNHX3EF2o4gbpOPERao';

  useEffect(() => {
    // Fetch pantry items from the backend
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((item) => ({
          ...item,
          expired: isAboutToExpire(item) ? "yes" : "no",
        }));
        setPantryList(updatedData);
        updatePantryItems(updatedData.map((item) => item.name) || []);
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
  
      // Set only the first image if available without additional filtering
      if (response.data.photos.length > 0) {
        setImages([response.data.photos[0]]);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };
  

  const isAboutToExpire = (item) => {
    if (!item.purchaseDate) return false;

    const currentDate = new Date();
    const purchaseDate = new Date(item.purchaseDate);
    const daysDifference = differenceInDays(currentDate, purchaseDate);

    // Determine expiration threshold based on item type
    if (
      ["fruit", "apple", "banana", "orange"].some((type) =>
        item.name.toLowerCase().includes(type)
      )
    ) {
      return daysDifference > 14;
    } else if (item.name.toLowerCase().includes("meat")) {
      return daysDifference > 90;
    } else if (
      ["lentil", "bean", "rice"].some((type) =>
        item.name.toLowerCase().includes(type)
      )
    ) {
      return daysDifference > 365;
    }
    return false;
  };

  const handleAddItem = () => {
    // Set default values if not provided
    const defaultMeasurement = measurement.trim() || "units";
    const defaultPurchaseDate = purchaseDate || new Date().toISOString().split("T")[0];
  
    if (pantryInput.trim() && amount.trim()) {
      const newItem = {
        name: pantryInput.trim(),
        amount: amount.trim(),
        measurement: defaultMeasurement,
        image: selectedImage,
        purchaseDate: defaultPurchaseDate,
        expired: isAboutToExpire({ purchaseDate: defaultPurchaseDate, name: pantryInput }) ? "yes" : "no",
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
          if (isAboutToExpire(addedItem)) {
            addToShoppingList(addedItem.name);
          }
        })
        .catch((error) => {
          console.error("Error adding pantry item:", error);
        });
  
      // Clear the form fields
      setPantryInput("");
      setAmount("");
      setMeasurement("");
      setSelectedImage("");
      setImages([]);
      setPurchaseDate("");
    } else {
      console.warn("Please fill in all fields before adding.");
    }
  };
  

  const handleRemoveItem = (itemToRemove) => {
    fetch(`http://localhost:5000/pantry/${itemToRemove.id}`, {
      method: "DELETE",
    })
      .then(() => {
        const updatedPantryList = pantryList.filter(
          (item) => item.id !== itemToRemove.id
        );
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
              fetchImages(e.target.value);
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
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
          <TextField
            label="Purchase Date (optional)"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
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
        Select an Image
      </Typography>
      <Grid container spacing={2}>
        {images.map((image) => (
          <Grid item xs={2} key={image.id}>
            <img
              src={image.src.medium}
              alt={image.alt}
              style={{
                width: "100%",
                cursor: "pointer",
                border: selectedImage === image.src.medium ? "2px solid blue" : "none",
              }}
              onClick={() => setSelectedImage(image.src.medium)}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Current Pantry Items
      </Typography>

      <List>
        {pantryList.map((item) => (
          <ListItem
            key={item.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveItem(item)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  marginRight: "10px",
                  backgroundColor: "#eee",
                }}
              />
            )}
            <ListItemText
              primary={`${item.name} (${item.amount} ${item.measurement})`}
              secondary={
                <>
                  {item.purchaseDate && (
                    <>
                      <Typography component="span" variant="body2">
                        Purchased on: {item.purchaseDate}
                      </Typography>
                      <span style={{ margin: "0 10px" }}></span>
                      <Typography component="span" variant="body2">
                        Expired:{" "}
                        <strong
                          style={{
                            color: item.expired === "yes" ? "red" : "green",
                          }}
                        >
                          {item.expired}
                        </strong>
                      </Typography>
                    </>
                  )}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Pantry;
