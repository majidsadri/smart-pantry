import React, { useState, useEffect } from "react";
import { Button, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
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
      const missingItems = requiredItems.filter(item => {
        // Check if the pantry does not have the item
        return !pantryItems.some(pantryItem => pantryItem.name.toLowerCase() === item.toLowerCase());
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
      <Typography>
        Based on your {dietPreferences.diet} diet, here are the items you are missing:
      </Typography>
      <List>
        {shoppingList.length > 0 ? (
          shoppingList.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No items needed. You're all set!" />
          </ListItem>
        )}
      </List>
      <Button variant="contained" color="primary">
        Complete Shopping
      </Button>
    </Paper>
  );
};

export default ShoppingList;
