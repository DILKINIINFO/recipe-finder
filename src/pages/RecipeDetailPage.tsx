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

  useEffect(() => {
    // ... (useEffect logic remains the same)
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

  if (loading) return <div className="text-center p-12 text-xl">Loading details...</div>;
  if (error) return <div className="bg-red-50 text-center p-12 text-xl text-red-600">{error}</div>;
  if (!recipe) return <div className="text-center p-12 text-xl">No recipe data available.</div>;

  const ingredients = getIngredients(recipe);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
          <Link to="/" className="text-amber-600 hover:text-amber-800 font-semibold mb-6 inline-block">
            &larr; Back to Home
          </Link>
          
          <h2 className="text-4xl font-bold mb-4 text-slate-800">{recipe.strMeal}</h2>
          
          {/* --- THE FIX FOR IMAGE SIZE --- */}
          {/* 1. We create a container with a max-height */}
          <div className="w-full max-h-[500px] bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center mb-8">
            {/* 2. The image inside uses object-contain to fit without cropping */}
            <img 
              src={recipe.strMealThumb} 
              alt={recipe.strMeal} 
              className="w-auto h-auto max-w-full max-h-full"
            />
          </div>
          {/* --- END OF FIX --- */}

          {/* The rest of the details JSX remains the same */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center border-y py-4">
            {/* ... category, area, youtube link ... */}
            <div>
              <span className="font-bold block text-lg">Category</span>
              <span className="text-gray-700">{recipe.strCategory}</span>
            </div>
            <div>
              <span className="font-bold block text-lg">Area</span>
              <span className="text-gray-700">{recipe.strArea}</span>
            </div>
            <div className="flex items-center justify-center">
               {recipe.strYoutube && (
                <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                  Watch on YouTube
                </a>
               )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-semibold mb-3 border-b-2 border-amber-300 pb-2">Ingredients</h3>
              <ul className="list-none space-y-2">
                {ingredients.map((ing, index) => (
                  <li key={index} className="flex">
                    <span className="font-semibold text-slate-800 mr-2">&bull; {ing.name}:</span>
                    <span className="text-gray-600">{ing.measure}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-2xl font-semibold mb-3 border-b-2 border-amber-300 pb-2">Instructions</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {recipe.strInstructions}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;