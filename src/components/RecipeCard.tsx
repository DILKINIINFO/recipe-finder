// src/components/RecipeCard.tsx
import React from 'react';
import { Meal } from '../types/recipe';

interface RecipeCardProps {
  recipe: Meal;
  onSelectRecipe: (recipe: Meal) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelectRecipe }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
      onClick={() => onSelectRecipe(recipe)}
    >
      <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800">{recipe.strMeal}</h3>
        <p className="text-sm text-gray-600">{recipe.strArea} • {recipe.strCategory}</p>
      </div>
    </div>
  );
};

export default RecipeCard;