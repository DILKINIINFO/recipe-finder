// src/pages/RecipeDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Meal, Ingredient } from '../types/recipe';

const API_URL_BY_ID = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

// We can reuse the helper function from our old modal
const getIngredients = (recipe: Meal): Ingredient[] => {
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
  const { id } = useParams<{ id: string }>(); // Get the 'id' from the URL
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL_BY_ID}${id}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        setError('Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) return <p className="text-center text-xl">Loading details...</p>;
  if (error) return <p className="text-center text-xl text-red-500">{error}</p>;
  if (!recipe) return <p className="text-center text-xl">No recipe data available.</p>;

  const ingredients = getIngredients(recipe);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
       <Link to="/" className="text-amber-600 hover:text-amber-800 font-semibold mb-6 inline-block">
        &larr; Back to Search Results
       </Link>
       
       <h2 className="text-4xl font-bold mb-4 text-slate-800">{recipe.strMeal}</h2>
       <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-auto max-h-96 object-cover rounded-md mb-6" />

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
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
               <li key={index}>
                 <span className="font-semibold text-slate-800">{ing.name}</span>: <span className="text-gray-600">{ing.measure}</span>
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
  );
};

export default RecipeDetailPage;