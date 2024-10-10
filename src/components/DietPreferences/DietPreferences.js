// src/components/DietPreferences/DietPreferences.js
import React, { useState } from "react";
import "./DietPreferences.css";

const DietPreferences = () => {
  const [diet, setDiet] = useState("");
  const [restrictions, setRestrictions] = useState("");

  return (
    <div className="diet-preferences">
      <h2>Diet Preferences</h2>
      <label>Preferred Diet:</label>
      <select value={diet} onChange={(e) => setDiet(e.target.value)}>
        <option value="None">None</option>
        <option value="Vegan">Vegan</option>
        <option value="Keto">Keto</option>
        <option value="Low-Carb">Low-Carb</option>
      </select>
      <br />
      <label>Dietary Restrictions:</label>
      <input
        type="text"
        value={restrictions}
        onChange={(e) => setRestrictions(e.target.value)}
        placeholder="e.g., No dairy, No gluten"
      />
    </div>
  );
};

export default DietPreferences;
