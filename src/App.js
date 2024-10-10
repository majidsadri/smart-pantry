import React from "react";
import { Container, Typography, Grid, Paper } from "@mui/material";
import Pantry from "./components/Pantry/Pantry";
import DietPreferences from "./components/DietPreferences/DietPreferences";
import RecipeSuggestions from "./components/RecipeSuggestions/RecipeSuggestions";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import "./App.css";

function App() {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom align="center" style={{ marginTop: "20px" }}>
        Smart Pantry Manager
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Pantry />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <DietPreferences />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <RecipeSuggestions />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <ShoppingList />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
