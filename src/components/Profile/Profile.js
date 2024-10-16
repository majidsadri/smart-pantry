import React, { useState, useEffect } from "react";
import { Paper, TextField, Button, MenuItem, Typography, Grid, IconButton } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import "./Profile.css";

const Profile = ({ updateDietPreferences }) => {
  const [profiles, setProfiles] = useState([]); // Store the list of profiles
  const [name, setName] = useState(""); // Name field for profile identification
  const [purpose, setPurpose] = useState("Single Person");
  const [familyMembers, setFamilyMembers] = useState(1);
  const [diet, setDiet] = useState("None");
  const [restrictions, setRestrictions] = useState("");
  const [cookDays, setCookDays] = useState(0);
  const [usualMeals, setUsualMeals] = useState("");

  // Fetch saved profiles from the backend on mount
  useEffect(() => {
    fetch(`http://127.0.0.1:5001/get_profiles`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched profiles:", data);
        setProfiles(data);
      })
      .catch(error => console.error("Error fetching profiles:", error));
  }, []);

  // Fetch saved profile data when a new name is selected
  useEffect(() => {
    if (name) {
      fetch(`http://127.0.0.1:5001/get_profile?name=${name}`)
        .then(response => response.json())
        .then(data => {
          console.log("Fetched profile data:", data);
          setPurpose(data.purpose || "Single Person");
          setFamilyMembers(data.familyMembers || 1);
          setCookDays(data.cookDays || 0);
          setDiet(data.diet || "None");
          setRestrictions(data.restrictions || "");
          setUsualMeals(data.usualMeals || "Regular");
        })
        .catch(error => console.error("Error fetching profile:", error));
    }
  }, [name]);

  const handleProfileSubmit = () => {
    const profileData = {
      name,
      purpose,
      familyMembers: purpose === "Family" ? familyMembers : 1,
      cookDays,
      diet,
      restrictions,
      usualMeals,
      activated: false, // Add the activated flag here
    };
  
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
        // Update all values including name in the App state
        updateDietPreferences(name, diet, restrictions, usualMeals);
        // Refresh the profile list
        setProfiles(prevProfiles => [...prevProfiles.filter(p => p.name !== name), profileData]);
      })
      .catch(error => console.error("Error saving profile:", error));
  };

  const handleProfileSelect = () => {
    fetch('http://127.0.0.1:5001/activate_profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Profile activated:", data);
      })
      .catch(error => console.error("Error activating profile:", error));
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Profile Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Profile Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new profile name or select existing"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label="Select Existing Profile"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          >
            {profiles.map(profile => (
              <MenuItem key={profile.name} value={profile.name}>
                {profile.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
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
            <MenuItem value="Regular">Regular</MenuItem>
            <MenuItem value="Persian">Persian</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="Fish and Seafood">Fish and Seafood</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton color="primary" onClick={handleProfileSubmit}>
            <SaveIcon />
          </IconButton>
          <IconButton color="secondary" onClick={handleProfileSelect}>
            <SelectAllIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Profile;
