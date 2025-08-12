// src/components/RecipeCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Meal } from '../types/recipe';

interface RecipeCardProps {
  // Allow a partial Meal object, as the filter API returns less data
  recipe: Partial<Meal> & { idMeal: string; strMeal: string; strMealThumb: string };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transform hover:scale-105 transition-transform duration-300">
        <img 
          src={recipe.strMealThumb} 
          alt={recipe.strMeal} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <h3 className="font-bold text-lg text-slate-800">{recipe.strMeal}</h3>
          {/* Conditionally render this part since it might not exist */}
          {recipe.strArea && recipe.strCategory && (
            <p className="text-sm text-gray-600">{recipe.strArea} • {recipe.strCategory}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;