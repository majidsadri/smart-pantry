import React, { useEffect, useState } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";

const RecipeSuggestions = ({ pantryItems }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (pantryItems.length > 0) {
      console.log("Pantry items being sent to backend:", pantryItems);

      // Make a POST request to the Flask backend with the pantry items
      fetch("http://127.0.0.1:5001/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pantry: pantryItems }),
      })
        .then((response) => {
          console.log("Backend response status:", response.status); // Log status code
          console.log("Backend response headers:", response.headers); // Log headers
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Raw response data:", data); // Debug the raw response data
          if (Array.isArray(data) && data.length > 0) {
            console.log("Valid recipes received:", data);
            setRecipes(data);
          } else {
            console.error("No valid recipes found or response is in unexpected format.");
            setRecipes([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching recipe recommendations:", error);
          setRecipes([]); // Set to empty if an error occurs
        });
    } else {
      console.log("No pantry items provided, skipping fetch.");
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
