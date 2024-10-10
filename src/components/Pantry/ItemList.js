import React from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import "./Pantry.css";

const ItemList = ({ items }) => {
  return (
    <div className="item-list">
      <Typography variant="h6" gutterBottom>
        Current Pantry Items:
      </Typography>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ItemList;
