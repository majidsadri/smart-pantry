import React, { useState } from "react";
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Ingredients = ({ pantryItems, onChange, onRefresh }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectChange = (event) => {
    setSelectedItems(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h5" gutterBottom>
        Select Ingredients
        <IconButton
          onClick={onRefresh}
          style={{ marginLeft: "10px", color: "#007bff" }} // Make the icon blue
        >
          <RefreshIcon />
        </IconButton>
      </Typography>
      <FormControl fullWidth variant="outlined" style={{ marginTop: "20px", marginBottom: "20px" }}>
        <InputLabel id="select-pantry-items-label">Select Pantry Items</InputLabel>
        <Select
          labelId="select-pantry-items-label"
          multiple
          value={selectedItems}
          onChange={handleSelectChange}
          label="Select Pantry Items"
          renderValue={(selected) => selected.join(", ")}
        >
          {pantryItems.length > 0 ? (
            pantryItems.map((item) => (
              <MenuItem key={item.id} value={item.name} style={{ display: "flex", alignItems: "center" }}>
                <Checkbox checked={selectedItems.indexOf(item.name) > -1} />
                <Avatar
                  src={item.image}
                  alt={item.name}
                  style={{ marginRight: "10px", width: "30px", height: "30px" }}
                />
                <ListItemText primary={item.name} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No pantry items available</MenuItem>
          )}
        </Select>
      </FormControl>

      <Typography variant="body1">
        {selectedItems.length > 0
          ? `Selected Ingredients: ${selectedItems.join(", ")}`
          : "No ingredients selected."}
      </Typography>
    </Paper>
  );
};

export default Ingredients;
