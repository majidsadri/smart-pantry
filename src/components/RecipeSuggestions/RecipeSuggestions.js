import React, { useState } from "react";
import { Typography, CircularProgress, Button } from "@mui/material";

const RecipeSuggestions = ({ pantryItems, dietPreferences }) => {
  const [recipes, setRecipes] = useState([]); // Store all the recipes
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0); // Track current recipe
  const [loading, setLoading] = useState(false);

  // Function to fetch recipe suggestions
  const fetchSuggestions = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5001/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pantry: pantryItems,
        diet: dietPreferences.diet,
        restrictions: dietPreferences.restrictions,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.suggestions && data.suggestions.length > 0) {
          setRecipes(data.suggestions); // Update recipes state
          setCurrentRecipeIndex(0); // Show the first recipe
        } else {
          setRecipes([{ title: "No recipe suggestions available", instructions: "" }]);
        }
      })
      .catch((error) => {
        console.error("Error fetching recipe suggestions:", error);
        setRecipes([{ title: "Error generating suggestions", instructions: "" }]); // Show error in UI
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLike = () => {
    alert("You liked the recipe!");
  };

  const handleDislike = () => {
    if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(prevIndex => {
        console.log("Current Index:", prevIndex); // Debug: log current index
        console.log("Recipes Length:", recipes.length); // Debug: log total recipes
        return prevIndex + 1;
      });
    } else {
      alert("No more recipes to show.");
    }
  };
  

  return (
    <div style={{ marginTop: "20px" }}>

<Button
        variant="contained"
        color="primary"
        onClick={fetchSuggestions}
        style={{ marginBottom: "20px" }}
      >
        Give me a recipe
      </Button>

      <Typography variant="h5" gutterBottom>
        Recipe Suggestions from you!
      </Typography>


      {loading ? (
        <CircularProgress />
      ) : recipes.length > 0 ? (
        <div>
          {recipes[currentRecipeIndex] && (
            <>
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", color: "#3f51b5" }}
              >
                {recipes[currentRecipeIndex].title}
              </Typography>
              <Typography
                variant="body1"
                style={{ whiteSpace: "pre-line", marginTop: "10px" }}
              >
                {recipes[currentRecipeIndex].instructions}
              </Typography>
            </>
          )}
          <div style={{ marginTop: "20px" }}>
            <Button variant="contained" color="primary" onClick={handleLike}>
              Like
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDislike}
            >
              Dislike
            </Button>
          </div>
        </div>
      ) : (
        <Typography>No recipe suggestions available.</Typography>
      )}
    </div>
  );
};



export default RecipeSuggestions;
