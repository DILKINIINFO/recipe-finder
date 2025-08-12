// src/components/RecipeCard.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Meal } from '../types/recipe';

interface RecipeCardProps {
  recipe: Meal;
  // We no longer need the onSelectRecipe prop!
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    // Wrap the entire card in a Link component
    <Link to={`/recipe/${recipe.idMeal}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transform hover:scale-105 transition-transform duration-300">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <h3 className="font-bold text-lg text-slate-800 truncate">{recipe.strMeal}</h3>
          <p className="text-sm text-gray-600">{recipe.strArea} • {recipe.strCategory}</p>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;