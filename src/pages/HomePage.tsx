// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeSlideshow from '../components/RecipeSlideshow';
import CategoryCard from '../components/CategoryCard';
import { searchRecipesByName, listAllCategories } from '../api/mealdb';
import { Meal } from '../types/recipe';

// Define the Category type based on the API response
interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

const HomePage = () => {
  const [slideshowRecipes, setSlideshowRecipes] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        setLoading(true);
        // Fetch both slideshow recipes and categories at the same time
        const featuredRecipeNames = ['Arrabiata', 'Corba', 'Tiramisu', 'Kumpir', 'Lasagne'];
        const recipePromises = featuredRecipeNames.map(name => searchRecipesByName(name));
        const categoryPromise = listAllCategories();

        const [categoryData, ...recipeResults] = await Promise.all([categoryPromise, ...recipePromises]);
        
        const meals = recipeResults.flatMap(result => result.meals || []);
        
        setSlideshowRecipes(meals);
        setCategories(categoryData.categories || []);

      } catch (error) {
        console.error("Failed to load home page data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to the search results page with the query
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div>
      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-800 text-white pt-10 pb-20 mb-16">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="h-96 flex justify-center items-center"><p>Loading...</p></div>
          ) : (
            <RecipeSlideshow recipes={slideshowRecipes} />
          )}

          {/* Simple Search Bar integrated into Hero */}
          <div className="mt-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Your Next Favorite Meal</h2>
            <p className="max-w-xl mx-auto mb-6 text-slate-300">
              Enter an ingredient or dish name to get started.
            </p>
            <form onSubmit={handleSearchSubmit} className="flex justify-center">
              <input 
                type="text"
                value={searchTerm}
                // <-- THE FIX IS HERE: Corrected typo from "e.targe" to "e.target"
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Salmon, Pizza, Curry..."
                className="w-full max-w-lg p-3 rounded-l-lg border-0 text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-400"
              />
              <button 
                type="submit"
                className="bg-amber-500 text-white p-3 rounded-r-lg hover:bg-amber-600 font-semibold transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- CATEGORY BROWSE SECTION --- */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-2">Browse by Category</h2>
        <p className="text-center text-slate-500 mb-8">Not sure what to cook? Get some inspiration.</p>
        
        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat.idCategory} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;