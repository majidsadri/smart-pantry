import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const RecipeSuggestions = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);

  // Fetch recipe suggestions from the Flask backend
  useEffect(() => {
    if (pantryItems.length > 0) {
      console.log("Fetching recipe suggestions for pantry items:", pantryItems);

      // Make a POST request to the Flask backend with the pantry items
      fetch("http://127.0.0.1:5001/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pantry: pantryItems }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Received recipe recommendations:", data);
          setRecipes(data);
        })
        .catch((error) => console.error("Error fetching recipe recommendations:", error));
    }
  }, [pantryItems]); // Re-run the effect when pantryItems changes

  return (
    <div style={{ marginTop: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Recipe Suggestions
      </Typography>
      {recipes.length > 0 ? (
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
