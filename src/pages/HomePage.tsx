// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeSlideshow from '../components/RecipeSlideshow';
import CategoryCard from '../components/CategoryCard';
import { filterByCategory, listAllCategories } from '../api/mealdb';
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
        
        // get all categories
        const categoryData = await listAllCategories();
        const allCategories = categoryData.categories || [];
        setCategories(allCategories);
        
        console.log('Available categories:', allCategories.map((c: { strCategory: any; }) => c.strCategory));
        
        // Get one recipe from each category for the slideshow
        const categoryRecipePromises = allCategories.map(async (category: { strCategory: string; }) => {
          try {
            const categoryRecipes = await filterByCategory(category.strCategory);
            if (categoryRecipes.meals && categoryRecipes.meals.length > 0) {
              // Get the first recipe from this category and fetch its full details
              const firstRecipe = categoryRecipes.meals[0];
              
              
              // The filter API returns: idMeal, strMeal, strMealThumb
              
              const enhancedRecipe: Meal = {
                idMeal: firstRecipe.idMeal,
                strMeal: firstRecipe.strMeal,
                strMealThumb: firstRecipe.strMealThumb,
                strCategory: category.strCategory,
                strArea: 'International', // Default since filter API doesn't provide this
                strInstructions: '', // Will be loaded when user clicks
                strDrinkAlternate: null,
                strTags: '',
                strYoutube: ''
              };
              
              console.log(`Found recipe for ${category.strCategory}:`, enhancedRecipe.strMeal);
              return enhancedRecipe;
            }
            return null;
          } catch (error) {
            console.error(`Failed to load recipes for category ${category.strCategory}:`, error);
            return null;
          }
        });
        
        // Wait for all category recipes to load
        const categoryRecipes = await Promise.all(categoryRecipePromises);
        
        // Filter out null results and shuffle the array
        const validRecipes = categoryRecipes.filter(recipe => recipe !== null) as Meal[];
        const shuffledRecipes = validRecipes.sort(() => Math.random() - 0.5);
        
        // Limit to 15 recipes for better performance
        const finalRecipes = shuffledRecipes.slice(0, 15);
        
        console.log('Final slideshow recipes:', finalRecipes.map(r => ({ 
          id: r.idMeal, 
          name: r.strMeal, 
          category: r.strCategory 
        })));
        
        setSlideshowRecipes(finalRecipes);

      } catch (error) {
        console.error("Failed to load home page data:", error);
        // Fallback: try to load some default recipes if category loading fails
        try {
          const { searchRecipesByFirstLetter } = await import('../api/mealdb');
          const fallbackData = await searchRecipesByFirstLetter('c');
          if (fallbackData.meals) {
            setSlideshowRecipes(fallbackData.meals.slice(0, 10));
          }
        } catch (fallbackError) {
          console.error("Fallback recipe loading also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHomePageData();
  }, []);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* --- ENHANCED HERO SECTION --- */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white pt-10 pb-20 mb-16 overflow-hidden">
        {/* Enhanced decorative background shapes with animations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-70 animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="h-96 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-xl font-medium">Loading featured recipes from all categories...</p>
                <p className="text-amber-200 text-sm mt-2">Discovering delicious dishes from around the world</p>
              </div>
            </div>
          ) : slideshowRecipes.length > 0 ? (
            <RecipeSlideshow recipes={slideshowRecipes} />
          ) : (
            <div className="h-96 flex justify-center items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-red-200">Failed to load featured recipes</p>
                <p className="text-amber-200 text-sm mt-2">Please try refreshing the page</p>
              </div>
            </div>
          )}

          {/* Enhanced Search Bar integrated into Hero */}
          <div className="mt-12 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
              Find Your Next Favorite Meal
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-slate-200 leading-relaxed">
              Discover thousands of delicious recipes from around the world. 
              <br />
              <span className="text-amber-300 font-medium">Search by ingredient, dish name, or get inspired by browsing categories.</span>
            </p>
            <form onSubmit={handleSearchSubmit} className="flex justify-center max-w-3xl mx-auto group">
              <div className="relative flex-1">
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Try 'Chicken Curry', 'Pasta', 'Chocolate Cake'..."
                  className="w-full p-4 pr-12 text-lg rounded-l-2xl border-2 border-amber-400/30 bg-white/90 backdrop-blur-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-amber-400/50 focus:border-amber-400 focus:bg-white transition-all duration-300 shadow-xl"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white font-bold rounded-r-2xl hover:from-amber-600 hover:via-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group-hover:shadow-amber-500/25"
              >
                <span className="flex items-center">
                  Search
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
              </button>
            </form>
            
            {/* Quick search suggestions */}
            <div className="mt-6">
              <p className="text-slate-300 text-sm mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Chicken', 'Pasta', 'Curry', 'Dessert', 'Vegetarian'].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTerm(term);
                      navigate(`/search/${term}`);
                    }}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-amber-400/50"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ENHANCED CATEGORY BROWSE SECTION --- */}
      <div className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text mb-4 leading-tight">
             Browse by Category
          </h2>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Not sure what to cook? Get some inspiration by exploring different cuisines and meal types.
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-lg text-slate-600">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
            {categories.map(cat => (
              <CategoryCard key={cat.idCategory} category={cat} />
            ))}
          </div>
        )}
      </div>
      
      {/* Enhanced Features Section */}
      <div className="bg-white/50 backdrop-blur-sm py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Recipe Finder?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Smart Search</h4>
              <p className="text-slate-600">Find recipes by ingredients, dish names, or dietary preferences with intelligent suggestions.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Curated Collection</h4>
              <p className="text-slate-600">Access thousands of tested recipes from various cuisines and cooking styles worldwide.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 015 0H17" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Video Tutorials</h4>
              <p className="text-slate-600">Watch step-by-step cooking videos to master new recipes and cooking techniques.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;