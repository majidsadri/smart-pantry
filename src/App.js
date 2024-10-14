import React, { useState } from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import Pantry from "./components/Pantry/Pantry";
import DietPreferences from "./components/DietPreferences/DietPreferences";
import RecipeSuggestions from "./components/RecipeSuggestions/RecipeSuggestions";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import "./App.css"; // Make sure the custom CSS file is linked properly
import pantryLogo from "./assets/pantry-logo.png"; // Import the logo image

function App() {
  // State to track pantry items and diet preferences at the App level
  const [pantryItems, setPantryItems] = useState([]);
  const [dietPreferences, setDietPreferences] = useState({
    diet: "None",
    restrictions: "",
  });

  // Handler to update pantry items from the Pantry component
  const updatePantryItems = (items) => {
    setPantryItems(items);
  };

  // Handler to update diet preferences from the DietPreferences component
  const updateDietPreferences = (diet, restrictions) => {
    setDietPreferences({ diet, restrictions });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
      {/* Custom Logo and Title Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <img
          src={pantryLogo}
          alt="Pantry Logo"
          style={{ width: "60px", height: "60px", marginRight: "10px" }}
        />
        <Typography
          variant="h3"
          gutterBottom
          style={{ fontFamily: "'Pacifico', cursive", color: "#4A4A4A", fontSize: "3rem" }}
        >
          Smart Pantry Manager
        </Typography>
      </div>

      <Grid container spacing={3} justifyContent="center">
        {/* Diet Preferences Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Diet Preferences
            </Typography>
            <DietPreferences updateDietPreferences={updateDietPreferences} />
          </Paper>
        </Grid>

        {/* Pantry Management Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "30px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Pantry Management
            </Typography>
            <Pantry updatePantryItems={updatePantryItems} />
          </Paper>
        </Grid>

        {/* Recipe Suggestions Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Recipe Suggestions
            </Typography>
            <RecipeSuggestions
              pantryItems={pantryItems}
              dietPreferences={dietPreferences}
            />
          </Paper>
        </Grid>

        {/* Shopping List Section */}
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" align="left" gutterBottom>
              Shopping List
            </Typography>
            <ShoppingList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
