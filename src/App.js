import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import Pantry from "./components/Pantry/Pantry";
import Profile from "./components/Profile/Profile";
import RecipeSuggestions from "./components/RecipeSuggestions/RecipeSuggestions";
import ShoppingList from "./components/ShoppingList/ShoppingList";
import "./App.css";
import pantryLogo from "./assets/pantry-logo.png";

function App() {
  const [pantryItems, setPantryItems] = useState([]);
  const [dietPreferences, setDietPreferences] = useState({
    diet: "None",
    restrictions: "",
    usualMeals: "",
  });
  
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentPage, setCurrentPage] = useState("Landing Page");

  useEffect(() => {
    // Fetch profile data from the backend when the app loads
    fetch('http://127.0.0.1:5001/get_profile')
      .then(response => response.json())
      .then(data => {
        setDietPreferences({
          diet: data.diet,
          restrictions: data.restrictions,
          usualMeals: data.usualMeals,
        });
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, []);

  const updatePantryItems = (items) => {
    setPantryItems(items);
  };

  const updateDietPreferences = (diet, restrictions, usualMeals) => {
    setDietPreferences({ diet, restrictions, usualMeals });
  };

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMenuAnchor(null);
  };

  const handleLogoClick = () => {
    setCurrentPage("Landing Page");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Profile":
        return <Profile updateDietPreferences={updateDietPreferences} />;
      case "Shopping List":
        return <ShoppingList pantryItems={pantryItems} dietPreferences={dietPreferences} />;
      case "Landing Page":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
                <Typography variant="h5" align="left" gutterBottom>
                  Pantry Management
                </Typography>
                <Pantry updatePantryItems={updatePantryItems} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
                <Typography variant="h5" align="left" gutterBottom>
                  Recipe Suggestions
                </Typography>
                <RecipeSuggestions pantryItems={pantryItems} dietPreferences={dietPreferences} />
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return <Pantry updatePantryItems={updatePantryItems} />;
    }
  };

  return (
    <Container maxWidth="lg" className="Container">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button onClick={handleLogoClick} style={{ padding: 0, marginRight: "10px" }}>
            <img src={pantryLogo} alt="Pantry Logo" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
          </Button>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Smart Pantry Manager
          </Typography>
          <Button color="inherit" onClick={handleMenuOpen} style={{ marginRight: "10px" }}>
            Menu
          </Button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleNavigation("Profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleNavigation("Shopping List")}>Shopping List</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
            {renderCurrentPage()}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
