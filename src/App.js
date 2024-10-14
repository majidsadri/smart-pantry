import React, { useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import Pantry from "./components/Pantry/Pantry"; // Correct path for Pantry
import Profile from "./components/Profile/Profile"; // Correct path for Profile
import RecipeSuggestions from "./components/RecipeSuggestions/RecipeSuggestions"; // Correct path for RecipeSuggestions
import ShoppingList from "./components/ShoppingList/ShoppingList"; // Correct path for ShoppingList
import "./App.css"; // Correct path for CSS file
import pantryLogo from "./assets/pantry-logo.png"; // Correct path for image asset

function App() {
  const [pantryItems, setPantryItems] = useState([]);
  const [dietPreferences, setDietPreferences] = useState({
    diet: "None",
    restrictions: "",
  });

  const updatePantryItems = (items) => {
    setPantryItems(items);
  };

  const updateDietPreferences = (diet, restrictions) => {
    setDietPreferences({ diet, restrictions });
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      {/* Logo and title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
        <img src={pantryLogo} alt="Pantry Logo" style={{ width: "60px", height: "60px", marginRight: "10px" }} />
        <Typography variant="h3" gutterBottom style={{ fontFamily: "'Arial', sans-serif", color: "#4A4A4A", fontSize: "2.5rem" }}>
          Smart Pantry Manager
        </Typography>
      </div>

      {/* Main Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px", minHeight: "270px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Settings
            </Typography>
            <Profile updateDietPreferences={updateDietPreferences} />
          </Paper>

          <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Pantry Management
            </Typography>
            <Pantry updatePantryItems={updatePantryItems} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px", minHeight: "270px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Recipe Suggestions
            </Typography>
            <RecipeSuggestions pantryItems={pantryItems} dietPreferences={dietPreferences} />
          </Paper>

          <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Shopping List
            </Typography>
            <ShoppingList pantryItems={pantryItems} dietPreferences={dietPreferences} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
