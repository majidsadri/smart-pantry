import React, { useState } from "react";
import { Paper, TextField, Button, MenuItem, Typography, Grid } from "@mui/material";
import "./Profile.css"; // Optional if you want to style this component separately

const Profile = ({ updateProfile }) => {
  const [purpose, setPurpose] = useState("Single");
  const [familyMembers, setFamilyMembers] = useState(1);
  const [diet, setDiet] = useState("None");
  const [cookDays, setCookDays] = useState(0);

  const handleSubmit = () => {
    const profileData = {
      purpose,
      familyMembers: purpose === "Family" ? familyMembers : 1, // Set family members to 1 for non-family cases
      diet,
      cookDays,
    };
    updateProfile(profileData); // Pass profile data to the parent
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

        {/* Usual diet */}
        <Grid item xs={12}>
          <TextField
            select
            label="What's your usual diet?"
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

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Profile
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
