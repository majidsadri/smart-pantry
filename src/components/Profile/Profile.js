import React, { useState, useEffect } from "react";
import { Paper, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import "./Profile.css";

const Profile = ({ updateDietPreferences }) => {
  const [purpose, setPurpose] = useState("Single Person");
  const [familyMembers, setFamilyMembers] = useState(1);
  const [diet, setDiet] = useState("None");
  const [restrictions, setRestrictions] = useState("");
  const [cookDays, setCookDays] = useState(0);
  const [usualMeals, setUsualMeals] = useState(""); // State for usual meals

  // Fetch saved profile data from the backend on mount
  useEffect(() => {
    fetch('http://127.0.0.1:5001/get_profile')
      .then(response => response.json())
      .then(data => {
        setDiet(data.diet);
        setRestrictions(data.restrictions);
        setUsualMeals(data.usualMeals);
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, []);

  const handleProfileSubmit = () => {
    const profileData = {
      purpose,
      familyMembers: purpose === "Family" ? familyMembers : 1,
      cookDays,
      diet,
      restrictions,
      usualMeals,
    };

    // Save the profile data to the backend
    fetch('http://127.0.0.1:5001/save_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Profile saved:", data);
        updateDietPreferences(diet, restrictions, usualMeals);
      })
      .catch(error => console.error("Error saving profile:", error));
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
            <MenuItem value="Persian">Persian</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="Fish and Seafood">Fish and Seafood</MenuItem>
            <MenuItem value="Fast Food">Fast Food</MenuItem>
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
