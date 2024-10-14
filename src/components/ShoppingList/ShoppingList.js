import React, { useState, useEffect } from "react";
import { Button, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import "./ShoppingList.css";

const dietItems = {
  Vegan: ["tofu", "vegetables", "fruits", "lentils", "beans", "nuts", "seeds"],
  Keto: ["meat", "fish", "eggs", "butter", "cheese", "avocado", "olive oil"],
  "Low-Carb": ["meat", "fish", "eggs", "leafy greens", "nuts", "berries"],
  None: [],
};

const ShoppingList = ({ pantryItems, dietPreferences }) => {
  const [shoppingList, setShoppingList] = useState([]);

  // Generate shopping list based on missing items from the pantry
  useEffect(() => {
    const generateShoppingList = () => {
      const requiredItems = dietItems[dietPreferences.diet] || [];

      // Compare the required diet items with pantry items
      const missingItems = requiredItems.filter((item) => {
        return !pantryItems.some(
          (pantryItem) => pantryItem.name && pantryItem.name.toLowerCase() === item.toLowerCase()
        );
      });

      setShoppingList(missingItems);
    };

    generateShoppingList();
  }, [pantryItems, dietPreferences]);

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Shopping List
      </Typography>
      <Typography variant="body1" style={{ marginBottom: "15px" }}>
        Based on your <strong>{dietPreferences.diet}</strong> diet, here are the items you are missing:
      </Typography>

      <Divider style={{ marginBottom: "15px" }} />

      <List>
        {shoppingList.length > 0 ? (
          shoppingList.map((item, index) => (
            <ListItem key={index}>
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

      <Divider style={{ margin: "20px 0" }} />

      <Button variant="contained" color="primary" fullWidth>
        Complete Shopping
      </Button>
    </Paper>
  );
};

export default ShoppingList;
