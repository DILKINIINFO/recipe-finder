// src/components/RecipeCard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Meal } from '../types/recipe';

interface RecipeCardProps {
  // Allow a partial Meal object, as the filter API returns less data
  recipe: Partial<Meal> & { idMeal: string; strMeal: string; strMealThumb: string };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/recipe/${recipe.idMeal}`} className="block h-full group">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden h-full transform hover:scale-105 transition-all duration-500 border border-white/50 hover:border-amber-200">
        {/* Image container with loading state */}
        <div className="relative overflow-hidden">
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          
          {/* Recipe image */}
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal} 
            className={`w-full h-48 object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Floating action indicator */}
          <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          
          {/* Category badge if available */}
          {recipe.strCategory && (
            <div className="absolute bottom-3 left-3 px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              {recipe.strCategory}
            </div>
          )}
        </div>
        
        {/* Content section */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300">
            {recipe.strMeal}
          </h3>
          
          {/* Recipe metadata */}
          {recipe.strArea && recipe.strCategory && (
            <p className="text-sm text-gray-600 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {recipe.strArea} • {recipe.strCategory}
            </p>
          )}
          
          {/* Call to action */}
          <div className="flex items-center justify-between">
            <span className="text-amber-600 font-semibold text-sm group-hover:text-amber-700 transition-colors duration-300">
              View Recipe
            </span>
            <div className="flex items-center text-amber-600 transform group-hover:translate-x-1 transition-transform duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Subtle border animation */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-300/30 rounded-2xl transition-all duration-500 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default RecipeCard;