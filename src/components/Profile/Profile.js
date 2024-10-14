import React, { useState, useEffect } from "react";
import { Paper, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import "./Profile.css";

const Profile = ({ updateDietPreferences }) => {
  const [purpose, setPurpose] = useState("Single Person");
  const [familyMembers, setFamilyMembers] = useState(1);
  const [diet, setDiet] = useState("None");
  const [restrictions, setRestrictions] = useState("");
  const [cookDays, setCookDays] = useState(0);
  const [usualMeals, setUsualMeals] = useState(""); // New state for usual meals

  // Load saved profile from local storage (if available)
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem("dietPreferences"));
    if (savedPreferences) {
      setDiet(savedPreferences.diet);
      setRestrictions(savedPreferences.restrictions);
      setUsualMeals(savedPreferences.usualMeals); // Load usual meals from saved preferences
    }
  }, []); // Only run this effect once on mount

  const handleProfileSubmit = () => {
    const profileData = {
      purpose,
      familyMembers: purpose === "Family" ? familyMembers : 1,
      cookDays,
      diet,
      restrictions,
      usualMeals, // Save the usual meals in profile data
    };

    // Save to local storage
    localStorage.setItem(
      "dietPreferences",
      JSON.stringify({ diet, restrictions, usualMeals })
    );

    // Call the parent function to update the preferences globally
    updateDietPreferences(diet, restrictions);

    console.log(profileData); // You can store or use this data as needed.
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Profile Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            select
            label="What's the app for?"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            fullWidth
          >
            <MenuItem value="Single Person">Single Person</MenuItem>
            <MenuItem value="Couple">Couple</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
          </TextField>
        </Grid>

        {purpose === "Family" && (
          <Grid item xs={12}>
            <TextField
              label="How many people in your family?"
              type="number"
              value={familyMembers}
              onChange={(e) => setFamilyMembers(e.target.value)}
              fullWidth
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            label="How many days per week do you cook at home?"
            type="number"
            value={cookDays}
            onChange={(e) => setCookDays(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Diet Preferences
          </Typography>
          <TextField
            select
            label="Preferred Diet"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            fullWidth
          >
            <MenuItem value="None">None</MenuItem>
            <MenuItem value="Vegan">Vegan</MenuItem>
            <MenuItem value="Keto">Keto</MenuItem>
            <MenuItem value="Low-Carb">Low-Carb</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Dietary Restrictions"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder="e.g., No dairy, No gluten"
            fullWidth
          />
        </Grid>

        {/* New Question for Usual Meals */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Usual Meals
          </Typography>
          <TextField
            select
            label="What are your usual meals?"
            value={usualMeals}
            onChange={(e) => setUsualMeals(e.target.value)}
            fullWidth
          >
            <MenuItem value="Steaks">Steaks</MenuItem>
            <MenuItem value="Salads">Salads</MenuItem>
            <MenuItem value="Salad and Protein">Salad and Protein</MenuItem>
            <MenuItem value="Indian Traditional">Indian Traditional</MenuItem>
            <MenuItem value="Persian">Persian</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="Fish and Seafood">Fish and Seafood</MenuItem>
            <MenuItem value="Fast Food">Fast Food</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleProfileSubmit}>
            Save Profile
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
