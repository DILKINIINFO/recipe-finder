// src/App.tsx
import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import { Meal } from './types/recipe';

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${term}`);
      const data = await response.json();
      setRecipes(data.meals || []); // API returns null if no meals are found
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm);
    }
  };
  
  // Fetch some default recipes on initial load
  useEffect(() => {
    fetchRecipes('chicken');
  }, []);

  return (
    <div className="bg-stone-100 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl text-center text-amber-600 font-bold">
            Recipe Finder
          </h1>
          <p className="text-center text-slate-600 mt-2">
            Discover delicious recipes from around the world.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          handleSearch={handleSearch} 
        />

        {loading && <p className="text-center text-xl">Loading...</p>}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}
        {!loading && !error && recipes.length === 0 && (
          <p className="text-center text-xl">No recipes found. Try another search!</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} onSelectRecipe={() => alert(recipe.strMeal)} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;