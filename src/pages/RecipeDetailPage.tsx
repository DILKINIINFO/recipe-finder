// src/pages/RecipeDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lookupRecipeById } from '../api/mealdb';
import { Meal, Ingredient } from '../types/recipe';

const getIngredients = (recipe: Meal): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Meal];
    const measure = recipe[`strMeasure${i}` as keyof Meal];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({ name: ingredient, measure: measure || '' });
    }
  }
  return ingredients;
};

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      lookupRecipeById(id)
        .then(data => {
          if (data.meals && data.meals.length > 0) {
            setRecipe(data.meals[0]);
          } else {
            setError('Recipe not found.');
          }
        })
        .catch(err => setError('Failed to fetch recipe details.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-2xl font-medium text-slate-700">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-red-50/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-red-200">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-2xl font-medium text-red-700 mb-2">Oops!</p>
          <p className="text-red-600">{error}</p>
          <Link 
            to="/" 
            className="inline-block mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
          <p className="text-2xl font-medium text-slate-700">No recipe data available.</p>
          <Link 
            to="/" 
            className="inline-block mt-4 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center text-amber-600 hover:text-amber-800 font-semibold text-lg mb-8 group transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        {/* Recipe Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          {/* Header Section */}
          <div className="relative">
            {/* Recipe Image */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              )}
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal} 
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                  {recipe.strMeal}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-amber-200">
                  <span className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {recipe.strArea}
                  </span>
                  <span className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {recipe.strCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Action buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
              
              {/* --- IMPROVED LOGIC FOR YOUTUBE BUTTON --- */}
              {/* This checks that strYoutube exists AND is not an empty string */}
              {recipe.strYoutube && recipe.strYoutube.trim() !== '' && (
                <a
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>Watch Tutorial</span>
                </a>
              )}
              
              <button className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Save Recipe</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Ingredients Section */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-white/80 to-amber-50/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200/50 sticky top-28">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3a2 2 0 112 0v2M9 5a2 2 0 012 0" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Ingredients</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {ingredients.map((ing, index) => (
                      <li key={index} className="flex items-start group hover:bg-amber-50/50 p-2 rounded-lg transition-colors duration-200">
                        <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-amber-200 transition-colors duration-200">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-slate-800 block">{ing.name}</span>
                          {ing.measure && (
                            <span className="text-amber-600 text-sm font-medium">{ing.measure}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 pt-6 border-t border-amber-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-amber-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-amber-600">{ingredients.length}</div>
                        <div className="text-sm text-slate-600">Ingredients</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-600">~45m</div>
                        <div className="text-sm text-slate-600">Cook Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Instructions Section */}
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Instructions</h3>
                  </div>
                  
                  <div className="prose prose-lg prose-slate max-w-none">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                      {recipe.strInstructions.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                        <p key={index} className="mb-4 p-4 bg-gray-50/50 rounded-xl border-l-4 border-blue-400 hover:bg-gray-50 transition-colors duration-200">
                          {paragraph.trim()}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;