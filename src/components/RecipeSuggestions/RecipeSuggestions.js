// src/components/RecipeSuggestions/RecipeSuggestions.js
import React from "react";
import "./RecipeSuggestions.css";

const RecipeSuggestions = () => {
  const recipes = [
    { name: "Tomato Soup", ingredients: ["Tomatoes", "Onions", "Garlic"] },
    { name: "Grilled Chicken Salad", ingredients: ["Chicken", "Lettuce", "Cucumber"] },
  ];

  return (
    <div className="recipe-suggestions">
      <h2>Recipe Suggestions</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>
            <strong>{recipe.name}</strong> - {recipe.ingredients.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeSuggestions;
