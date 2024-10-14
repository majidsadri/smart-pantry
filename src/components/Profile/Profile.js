import React, { useState } from "react";
import { Paper, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import "./Profile.css"; // Optional if you want custom styles

const Profile = ({ updateProfile, updateDietPreferences }) => {
  const [purpose, setPurpose] = useState("Single");
  const [familyMembers, setFamilyMembers] = useState(1);
  const [diet, setDiet] = useState("None");
  const [restrictions, setRestrictions] = useState("");
  const [cookDays, setCookDays] = useState(0);

  const handleProfileSubmit = () => {
    const profileData = {
      purpose,
      familyMembers: purpose === "Family" ? familyMembers : 1, // Only consider family size for family type
      cookDays,
    };
    updateProfile(profileData);
  };

  const handleDietChange = (e) => {
    setDiet(e.target.value);
    updateDietPreferences(e.target.value, restrictions);
  };

  const handleRestrictionsChange = (e) => {
    setRestrictions(e.target.value);
    updateDietPreferences(diet, e.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Profile Settings
      </Typography>
      <Grid container spacing={3}>
        {/* Purpose of the app */}
        <Grid item xs={12}>
          <TextField
            select
            label="What's the app for?"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            fullWidth
          >
            <MenuItem value="Single">Single Person</MenuItem>
            <MenuItem value="Couple">Couple</MenuItem>
            <MenuItem value="Family">Family</MenuItem>
          </TextField>
        </Grid>

        {/* Number of family members (if purpose is Family) */}
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

        {/* How many days per week do you cook at home */}
        <Grid item xs={12}>
          <TextField
            label="How many days per week do you cook at home?"
            type="number"
            value={cookDays}
            onChange={(e) => setCookDays(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Diet Preferences */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Diet Preferences
          </Typography>
          <TextField
            select
            label="Preferred Diet"
            value={diet}
            onChange={handleDietChange}
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
            onChange={handleRestrictionsChange}
            placeholder="e.g., No dairy, No gluten"
            fullWidth
          />
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
