// src/pages/RecipeDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lookupRecipeById } from '../api/mealdb'; // Use our new API function
import { Meal, Ingredient } from '../types/recipe';

const getIngredients = (recipe: Meal): Ingredient[] => {
  // ... (this helper function remains the same as before)
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Meal];
    const measure = recipe[`strMeasure${i}` as keyof Meal];
    if (ingredient) {
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

  useEffect(() => {
    if (id) {
      setLoading(true);
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

  if (loading) return <div className="text-center p-12">Loading details...</div>;
  if (error) return <div className="text-center p-12 text-red-500">{error}</div>;
  if (!recipe) return <div className="text-center p-12">No recipe data available.</div>;

  const ingredients = getIngredients(recipe);

  return (
    // --- NEW: Full-page wrapper with a different, subtle background ---
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* The recipe content is now on a clean white "sheet" with a shadow */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
          <Link to="/" className="text-amber-600 hover:text-amber-800 font-semibold mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h2 className="text-4xl font-bold mb-4 text-slate-800">{recipe.strMeal}</h2>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-auto max-h-96 object-cover rounded-md mb-6" />

          {/* ... all the other recipe detail JSX remains the same ... */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            {/* ... category, area, youtube link ... */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
                {/* ... ingredients ... */}
            </div>
            <div className="md:col-span-3">
                {/* ... instructions ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;