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
import Ingredients from "./components/Ingredients/Ingredients";
import "./App.css";
import pantryLogo from "./assets/pantry-logo.png";


function App() {
  const [pantryItems, setPantryItems] = useState([]);
  const [dietPreferences, setDietPreferences] = useState({
    name: "Majid",
    diet: "None",
    restrictions: "",
    usualMeals: "",
  });
  const [cookingTip, setCookingTip] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [currentPage, setCurrentPage] = useState("Landing Page");

  const fetchPantryItems = () => {
    fetch("http://localhost:5000/pantry")
      .then((response) => response.json())
      .then((data) => setPantryItems(data))
      .catch((error) => console.error("Error fetching pantry items:", error));
  };

  const fetchProfileData = () => {
    fetch(`http://127.0.0.1:5001/get_profile?name=${dietPreferences.name}`)
      .then((response) => response.json())
      .then((data) => {
        setDietPreferences((prevState) => ({
          ...prevState,
          name: data.name || prevState.name, // Ensure name is updated correctly
          diet: data.diet || "None",
          restrictions: data.restrictions || "",
          usualMeals: data.usualMeals || "Regular",
        }));
      })
      .catch((error) => console.error("Error fetching profile data:", error));
  };

  const fetchCookingTip = () => {
    fetch("http://127.0.0.1:5001/get_tip")
      .then((response) => response.json())
      .then((data) => setCookingTip(data.tip || "Enjoy your cooking!"))
      .catch((error) => console.error("Error fetching cooking tip:", error));
  };

  useEffect(() => {
    fetchPantryItems();
    fetchProfileData();
    fetchCookingTip();
  }, []);

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleNavigation = (page) => {
    if (page === "Ingredients") {
      fetchPantryItems();
    }
    setCurrentPage(page);
    setMenuAnchor(null);
  };

  const handleLogoClick = () => {
    setCurrentPage("Landing Page");
  };

  const handleIngredientsChange = (selectedItems) => {
    setSelectedIngredients(selectedItems);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "Profile":
        return (
          <Profile
            updateDietPreferences={(name, diet, restrictions, usualMeals) =>
              setDietPreferences((prevState) => ({
                ...prevState,
                name: name,
                diet: diet,
                restrictions: restrictions,
                usualMeals: usualMeals,
              }))
            }
          />
        );
      case "Shopping List":
        return (
          <ShoppingList
            pantryItems={pantryItems}
            dietPreferences={dietPreferences}
            refreshPantryItems={fetchPantryItems}
          />
        );
      case "Landing Page":
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
                <Typography variant="h5" align="left" gutterBottom>
                  Ingredients
                </Typography>
                <Ingredients
                  pantryItems={pantryItems}
                  onChange={handleIngredientsChange}
                  onRefresh={fetchPantryItems}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} style={{ padding: "20px", minHeight: "300px" }}>
                <Typography variant="h5" align="left" gutterBottom>
                  Recipe Suggestions
                </Typography>
                <RecipeSuggestions
                  pantryItems={selectedIngredients}
                  dietPreferences={dietPreferences}
                />
              </Paper>
            </Grid>
          </Grid>
        );
      case "Pantry Management":
        return <Pantry updatePantryItems={setPantryItems} />;
      default:
        return <Pantry updatePantryItems={setPantryItems} />;
    }
  };
  

  return (
    <Container maxWidth="lg" className="Container">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Button onClick={handleLogoClick} style={{ padding: 0, marginRight: "10px" }}>
            <img
              src={pantryLogo}
              alt="Pantry Logo"
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
          </Button>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            SPAN [ Smart Pantry ]
          </Typography>
          <Button color="inherit" onClick={handleMenuOpen} style={{ marginLeft: "auto" }}>
            Menu
          </Button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleNavigation("Profile")}>Profile</MenuItem>
            <MenuItem onClick={() => handleNavigation("Shopping List")}>Shopping List</MenuItem>
            <MenuItem onClick={() => handleNavigation("Pantry Management")}>
              Pantry Management
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("Landing Page")}>Ingredients</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "20px 0",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="subtitle1" style={{ fontWeight: "bold", marginBottom: "10px" }}>
          Profile:{" "}
          <span style={{ fontWeight: "normal", color: "#2c3e50" }}>
            {dietPreferences.name}
          </span>
        </Typography>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          Preferred Diet:{" "}
          <span style={{ fontWeight: "normal", color: "#2c3e50" }}>
            {dietPreferences.diet || "Not Specified"}
          </span>
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "20px 0",
          backgroundColor: "#f0f8ff",
          textAlign: "center",
        }}
      >
        <Typography variant="subtitle2" style={{ color: "#333" }}>
          Cooking Tip: {cookingTip}
        </Typography>
      </Paper>

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
