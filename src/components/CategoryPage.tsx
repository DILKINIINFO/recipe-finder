// src/pages/CategoryPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filterByCategory } from '../api/mealdb';
import RecipeCard from '../components/RecipeCard'; // We reuse the same card!

// The filter API returns a simpler Meal object, let's type it
interface FilteredMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const CategoryPage = () => {
  const { name } = useParams<{ name: string }>(); // Get category name from URL
  const [recipes, setRecipes] = useState<FilteredMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (name) {
      setLoading(true);
      filterByCategory(name)
        .then(data => {
          setRecipes(data.meals || []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [name]);

  return (
    <div className="bg-stone-100 min-h-screen">
        <div className="container mx-auto px-4 py-8">
            <Link to="/" className="text-amber-600 hover:text-amber-800 font-semibold mb-6 inline-block">
                &larr; Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800 mb-8">
                Recipes in: <span className="text-amber-600">{name}</span>
            </h1>

            {loading ? (
                <p className="text-center">Loading recipes...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {recipes.map(recipe => (
                        // We need to adapt the RecipeCard to accept the simpler FilteredMeal type
                        // For now, let's cast it. A better solution would be to make RecipeCard more flexible.
                        <RecipeCard key={recipe.idMeal} recipe={recipe as any} />
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default CategoryPage;