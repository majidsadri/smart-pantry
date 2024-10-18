import React, { useState } from "react";
import {
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const RecipeSuggestions = ({ pantryItems, dietPreferences }) => {
  const [recipes, setRecipes] = useState([]); // Store all the recipes
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0); // Track current recipe
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility
  const [foodImage, setFoodImage] = useState(""); // Store the food image URL

  const GOOGLE_API_KEY = "AIzaSyBwqPu9e7n8gkQBJozcuL5_UKN1pVsGqWk";
  const GOOGLE_CSE_ID = "105c5b600af644edc"; // Replace with your actual Custom Search Engine ID

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
        profileName: dietPreferences.name, // Pass the correct profile name here
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.suggestions && data.suggestions.length > 0) {
          setRecipes(data.suggestions);
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

  // Function to fetch an image from Google Custom Search
  const fetchFoodImage = async (query) => {
    try {
      const refinedQuery = `${query} recipe food dish`;
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?q=${refinedQuery}&searchType=image&key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&num=1`
      );

      console.log("Google API Response:", response.data);
      if (response.data.items && response.data.items.length > 0) {
        const imageUrl = response.data.items[0].link;
        console.log("Fetched Image URL:", imageUrl);
        setFoodImage(imageUrl);
      } else {
        console.log("No images found for this query.");
        setFoodImage("");
      }
    } catch (error) {
      console.error("Error fetching food image:", error);
      setFoodImage("");
    }
  };

  // Handle Like button click
  const handleLike = () => {
    const selectedRecipe = recipes[currentRecipeIndex];
    fetchFoodImage(selectedRecipe.title);
    setOpenDialog(true); // Open the dialog to show recipe details
  };

  // Handle Dislike button click, show the next recipe if available
  const handleDislike = () => {
    if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("No more recipes to show.");
    }
  };

  // Close the dialog
  const handleClose = () => {
    setOpenDialog(false);
    setFoodImage(""); // Clear the image when the dialog closes
  };

  // Dynamic title based on the diet preferences
  const getTitle = () => {
    if (dietPreferences.diet && dietPreferences.diet !== "None") {
      return `${dietPreferences.diet} Recipe Suggestions from you!`;
    }
    return "Recipe Suggestions from you!";
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={fetchSuggestions}
        style={{ marginBottom: "20px" }}
      >
        Suggest some recipes
      </Button>

      <Typography variant="h5" gutterBottom>
        {getTitle()}
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
              style={{ marginLeft: "10px" }}
            >
              Dislike
            </Button>
          </div>

          {/* Dialog for showing recipe details */}
          <Dialog
            open={openDialog}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              style: {
                border: "3px solid #3f51b5",
                borderRadius: "10px",
                padding: "20px",
                fontFamily: "'Roboto', sans-serif",
              },
            }}
          >
            <DialogTitle style={{ fontSize: "24px", color: "#3f51b5", fontWeight: "bold" }}>
              {recipes[currentRecipeIndex].title}
            </DialogTitle>
            <DialogContent style={{ fontSize: "16px", color: "#555", lineHeight: "1.6" }}>
              {foodImage && (
                <img
                  src={foodImage}
                  alt={recipes[currentRecipeIndex].title}
                  style={{
                    width: "192px", // 2 inches wide
                    height: "auto",
                    marginBottom: "15px",
                    borderRadius: "10px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}
              <Typography variant="body1" gutterBottom>
                <strong>Instructions:</strong> {recipes[currentRecipeIndex].instructions}
              </Typography>
              <Typography variant="body2" style={{ marginTop: "10px" }}>
                <strong>Cooking Time:</strong> {recipes[currentRecipeIndex].cooking_time} minutes
              </Typography>
              <Typography variant="body2" style={{ marginTop: "10px" }}>
                <strong>Calories:</strong> {recipes[currentRecipeIndex].calories} per serving
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" style={{ fontWeight: "bold" }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      ) : (
        <Typography>No recipe suggestions available.</Typography>
      )}
    </div>
  );
};

export default RecipeSuggestions;
