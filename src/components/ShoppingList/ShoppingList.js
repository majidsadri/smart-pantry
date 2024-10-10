// src/components/ShoppingList/ShoppingList.js
import React, { useState } from "react";
import "./ShoppingList.css";

const ShoppingList = () => {
  const [shoppingList, setShoppingList] = useState([]);

  const addToList = () => {
    const newItem = prompt("Enter an item to add to the shopping list:");
    if (newItem) {
      setShoppingList([...shoppingList, newItem]);
    }
  };

  return (
    <div className="shopping-list">
      <h2>Shopping List</h2>
      <button onClick={addToList}>Add Item</button>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingList;
