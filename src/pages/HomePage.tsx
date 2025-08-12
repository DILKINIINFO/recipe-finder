// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { Meal } from '../types/recipe';

const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${term}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      fetchRecipes(searchTerm);
    }
  };
  
  useEffect(() => {
    fetchRecipes('Pasta');
  }, []);

  return (
    <>
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        handleSearch={handleSearch} 
      />

      {loading && <p className="text-center text-xl">Loading recipes...</p>}
      {error && <p className="text-center text-xl text-red-500">{error}</p>}
      {!loading && !error && recipes.length === 0 && (
        <p className="text-center text-xl">No recipes found. Try another search!</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.idMeal} recipe={recipe} />
        ))}
      </div>
    </>
  );
};

export default HomePage;