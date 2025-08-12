// src/pages/SearchResultsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchRecipesByName } from '../api/mealdb';
import RecipeCard from '../components/RecipeCard';
import { Meal } from '../types/recipe';

const SearchResultsPage = () => {
  // Get the search query from the URL (e.g., /search/chicken -> query = "chicken")
  const { query } = useParams<{ query: string }>(); 
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      searchRecipesByName(query)
        .then(data => {
          setRecipes(data.meals || []);
        })
        .catch(err => {
          console.error(err);
          setError("Failed to fetch search results.");
        })
        .finally(() => setLoading(false));
    }
  }, [query]); // Re-run the search whenever the query in the URL changes

  return (
    <div className="bg-stone-100 min-h-full py-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-amber-600 hover:text-amber-800 font-semibold mb-6 inline-block">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Search Results for: <span className="text-amber-600">{query}</span>
        </h1>

        {loading && <p className="text-center text-xl">Searching for recipes...</p>}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}

        {!loading && recipes.length === 0 && (
          <p className="text-center text-xl text-slate-600">
            Sorry, no recipes found for "{query}". Please try another search.
          </p>
        )}

        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.idMeal} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;