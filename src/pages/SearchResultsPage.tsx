// src/pages/SearchResultsPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchRecipesByName } from '../api/mealdb';
import RecipeCard from '../components/RecipeCard';
import { Meal } from '../types/recipe';

const SearchResultsPage = () => {
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
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center text-amber-600 hover:text-amber-800 font-semibold text-lg mb-8 group transition-colors duration-300"
        >
          <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 inline-block">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Search Results
            </h1>
            <div className="flex items-center justify-center space-x-3 text-2xl mb-4">
              <span className="text-slate-600">for</span>
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-bold">
                "{query}"
              </span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-xl font-medium text-slate-700">Searching for delicious recipes...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-red-200 inline-block">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xl font-medium text-red-700 mb-2">Oops!</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && recipes.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200 inline-block max-w-md">
              <svg className="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">No Recipes Found</h3>
              <p className="text-slate-600 mb-6">
                Sorry, we couldn't find any recipes matching "{query}". 
                <br />
                Try searching with different keywords or browse our categories.
              </p>
              
              {/* Suggestions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-500">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Chicken', 'Pasta', 'Curry', 'Soup', 'Dessert'].map(suggestion => (
                    <Link
                      key={suggestion}
                      to={`/search/${suggestion}`}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm hover:bg-amber-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && recipes.length > 0 && (
          <>
            {/* Results count */}
            <div className="text-center mb-8">
              <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-2xl px-6 py-3 inline-block">
                <p className="text-green-700 font-medium">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Found {recipes.length} delicious recipe{recipes.length !== 1 ? 's' : ''} for you!
                </p>
              </div>
            </div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.idMeal} recipe={recipe} />
              ))}
            </div>

            {/* Call to action */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Want to explore more?</h3>
                <p className="text-slate-600 mb-6">Discover recipes from different categories and cuisines</p>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6" />
                  </svg>
                  <span>Browse Categories</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;