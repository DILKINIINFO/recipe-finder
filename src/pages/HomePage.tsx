// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import RecipeSlideshow from '../components/RecipeSlideshow';
import { Meal } from '../types/recipe';

const API_SEARCH_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

const HomePage = () => {
  // --- State for the Slideshow ---
  const [slideshowRecipes, setSlideshowRecipes] = useState<Meal[]>([]);
  const [slideshowLoading, setSlideshowLoading] = useState(true);
  
  // --- State for the Search Results ---
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Meal[]>([]);
  // FIX: Initialize loading to false since we aren't fetching on load anymore.
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  // useEffect for fetching slideshow data on component mount
  useEffect(() => {
    const fetchSlideshowData = async () => {
      const featuredRecipeNames = ['Arrabiata', 'Corba', 'Tiramisu', 'Kumpir', 'Lasagne', 'Pancakes'];
      
      try {
        const promises = featuredRecipeNames.map(name =>
          fetch(`${API_SEARCH_URL}${name}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const meals = results.flatMap(result => result.meals || []);
        setSlideshowRecipes(meals);
      } catch (err) {
        console.error("Failed to fetch slideshow recipes", err);
        setSlideshowRecipes([]);
      } finally {
        setSlideshowLoading(false);
      }
    };

    fetchSlideshowData();
  }, []);

  // This function is now ONLY called when the user performs a search.
  const fetchRecipes = async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_SEARCH_URL}${term}`);
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

  return (
    <>
      {/* --- Slideshow Section --- */}
      {slideshowLoading ? (
        <div className="text-center p-10">
          <p className="text-xl">Loading featured recipes...</p>
        </div>
      ) : slideshowRecipes.length > 0 ? (
        <RecipeSlideshow recipes={slideshowRecipes} />
      ) : (
        <div className="text-center p-10">
          <p className="text-xl text-red-500">Could not load featured recipes.</p>
        </div>
      )}

      {/* --- Search Section --- */}
      <div className="text-center border-t-2 border-stone-200 pt-8 mt-8">
        <h2 className="text-3xl font-bold text-slate-700 mb-4">Search For A Recipe</h2>
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          handleSearch={handleSearch} 
        />
      </div>

      {/* --- Search Results Grid --- */}
      <div className="mt-12">
        {loading && <p className="text-center text-xl">Searching...</p>}
        {error && <p className="text-center text-xl text-red-500">{error}</p>}
        
        {/* FIX: This condition now shows a prompt on the initial page load. */}
        {!loading && !error && recipes.length === 0 && (
          <p className="text-center text-xl text-slate-500">
            Start by searching for a recipe or an ingredient above!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;