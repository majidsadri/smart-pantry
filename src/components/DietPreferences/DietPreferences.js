// src/components/DietPreferences/DietPreferences.js
import React, { useState } from "react";
import "./DietPreferences.css";

const DietPreferences = ({ updateDietPreferences }) => {
  const [diet, setDiet] = useState("None");
  const [restrictions, setRestrictions] = useState("");

  const handleDietChange = (e) => {
    setDiet(e.target.value);
    updateDietPreferences(e.target.value, restrictions);
  };

  const handleRestrictionsChange = (e) => {
    setRestrictions(e.target.value);
    updateDietPreferences(diet, e.target.value);
  };

  return (
    <div className="diet-preferences">
      <h2>Diet Preferences</h2>
      <label>Preferred Diet:</label>
      <select value={diet} onChange={handleDietChange}>
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
        onChange={handleRestrictionsChange}
        placeholder="e.g., No dairy, No gluten"
      />
    </div>
  );
};

export default DietPreferences;
