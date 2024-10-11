import React, { useEffect, useState, useRef } from "react";
import { Typography, List, ListItem, ListItemText, CircularProgress } from "@mui/material";

const RecipeSuggestions = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPantryItems, setLastPantryItems] = useState([]); // Track last pantry items

  const isFirstRender = useRef(true); // To handle initial render

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip the first render to avoid unnecessary fetch
    }

    // Only fetch recipes if pantryItems are provided and different from the last fetched items
    if (pantryItems.length > 0 && JSON.stringify(pantryItems) !== JSON.stringify(lastPantryItems)) {
      setLastPantryItems(pantryItems); // Update last pantry items to prevent refetching the same items
      fetchRecipes(pantryItems); // Call fetch function
    }
  }, [pantryItems]);

  const fetchRecipes = (pantryItems) => {
    setLoading(true);
    console.log("Fetching recipes with pantry items:", pantryItems);

    fetch("http://127.0.0.1:5001/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pantry: pantryItems }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecipes(data);
        } else {
          setRecipes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipe recommendations:", error);
        setRecipes([]); // Set to empty if an error occurs
      })
      .finally(() => {
        setLoading(false); // Stop loading after fetch completes
      });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Recipe Suggestions
      </Typography>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : recipes.length > 0 ? (
        <List>
          {recipes.map((recipe, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Suggested Recipe: ${recipe.recipe_name}`}
                secondary={`Ingredients: ${recipe.ingredients}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No recipe suggestions available.</Typography>
      )}
    </div>
  );
};

export default RecipeSuggestions;
