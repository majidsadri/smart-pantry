import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { differenceInDays } from "date-fns";
import "./ShoppingList.css";

// Define the items associated with each diet type
const dietItems = {
  Vegan: ["tofu", "vegetables", "fruits", "lentils", "beans", "nuts", "seeds"],
  Keto: ["meat", "fish", "eggs", "butter", "cheese", "avocado", "olive oil"],
  "Low-Carb": ["meat", "fish", "eggs", "leafy greens", "nuts", "berries"],
  None: [],
};

// Function to determine if an item is expired
const isExpired = (item) => {
  if (!item.purchaseDate) return false;

  const currentDate = new Date();
  const purchaseDate = new Date(item.purchaseDate);
  const daysDifference = differenceInDays(currentDate, purchaseDate);

  if (
    ["fruit", "apple", "lemon", "banana", "orange"].some((type) =>
      item.name.toLowerCase().includes(type)
    )
  ) {
    return daysDifference > 14; // Fruits expire after 14 days
  } else if (item.name.toLowerCase().includes("meat", "salmon", "chicken")) {
    return daysDifference > 90; // Meats expire after 90 days
  } else if (
    ["lentil", "bean", "rice"].some((type) =>
      item.name.toLowerCase().includes(type)
    )
  ) {
    return daysDifference > 200; // Dry goods expire after 200 days
  }
  return false;
};

const ShoppingList = ({ pantryItems, dietPreferences, refreshPantryItems }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);

  const generateShoppingList = () => {
    const requiredItems = dietItems[dietPreferences.diet] || [];

    // Find missing items from diet preferences
    const missingItems = requiredItems.filter((item) => {
      return !pantryItems.some(
        (pantryItem) =>
          pantryItem.name &&
          pantryItem.name.toLowerCase() === item.toLowerCase()
      );
    });

    // Find expired items from pantry
    const expiredItems = pantryItems
      .filter((item) => isExpired(item))
      .map((item) => `${item.name} (Expired)`);

    // Combine missing and expired items into the shopping list but separate suggested items
    setShoppingList([...expiredItems]);
    setSuggestedItems(missingItems); // Set suggested items based on diet
  };

  useEffect(() => {
    generateShoppingList();
  }, [pantryItems, dietPreferences]);

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Shopping List
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "15px" }}>
        Based on your <strong>{dietPreferences.diet}</strong> diet, here are
        the items you are missing or that have expired:
      </Typography>

      <Divider style={{ marginBottom: "10px" }} />

      <List dense>
        {shoppingList.length > 0 ? (
          shoppingList.map((item, index) => (
            <ListItem key={index} style={{ padding: "4px 0" }}>
              <ListItemIcon>
                <ShoppingCartIcon style={{ color: "#4caf50" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="h6" style={{ color: "#333" }}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon style={{ color: "#4caf50" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" style={{ color: "#4caf50" }}>
                  No items needed. You're all set!
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>

      <Divider style={{ margin: "10px 0" }} />

      <Typography variant="h6" style={{ marginBottom: "8px" }}>
        Suggested Items for {dietPreferences.diet} Diet:
      </Typography>
      <List dense>
        {suggestedItems.map((item, index) => (
          <ListItem key={index} style={{ padding: "4px 0" }}>
            <ListItemIcon>
              <ShoppingCartIcon style={{ color: "#2196f3" }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="h6" style={{ color: "#2196f3" }}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          refreshPantryItems(); // Refresh the pantry items when clicked
        }}
      >
        Refresh
      </Button>
    </Paper>
  );
};

export default ShoppingList;
