// src/pages/CategoryPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filterByCategory } from '../api/mealdb';
import RecipeCard from '../components/RecipeCard';

interface FilteredMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const CategoryPage = () => {
  const { name } = useParams<{ name: string }>();
  const [recipes, setRecipes] = useState<FilteredMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (name) {
      setLoading(true);
      setError(null);
      filterByCategory(name)
        .then(data => {
          if (data.meals) {
            setRecipes(data.meals);
          } else {
            setRecipes([]);
            setError('No recipes found in this category');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load recipes. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative container mx-auto px-4 py-16">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-slate-300 hover:text-amber-300 font-medium transition-colors duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </nav>

          {/* Category Header */}
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-slate-700/40 backdrop-blur-sm rounded-full text-sm font-semibold text-amber-200 border border-slate-600/50">
                Recipe Category
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
              {name}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full mb-6"></div>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover delicious {name?.toLowerCase()} recipes from around the world
            </p>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-8 text-orange-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200"></div>
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
            </div>
            <p className="text-slate-600 mt-6 text-lg font-medium">Loading delicious recipes...</p>
            <p className="text-slate-400 text-sm mt-2">Finding the best {name?.toLowerCase()} dishes for you</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">Oops! Something went wrong</h2>
            <p className="text-slate-500 mb-6 text-center max-w-md">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-3">No Recipes Found</h2>
            <p className="text-slate-500 mb-6 text-center max-w-md">
              We couldn't find any {name?.toLowerCase()} recipes at the moment. Try exploring other categories!
            </p>
            <Link 
              to="/"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore Categories
            </Link>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-slate-500">
                  Discover amazing {name?.toLowerCase()} dishes from our collection
                </p>
              </div>
              
              {/* View options - could be expanded later */}
              <div className="hidden md:flex items-center space-x-2 bg-white rounded-full p-1 shadow-md">
                <button className="p-2 bg-amber-500 text-white rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recipes.map((recipe, index) => (
                <div 
                  key={recipe.idMeal}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <RecipeCard recipe={recipe as any} />
                </div>
              ))}
            </div>

            {/* Load more section placeholder */}
            <div className="mt-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/50">
                <h3 className="text-xl font-semibold text-slate-700 mb-3">
                  Enjoying these {name?.toLowerCase()} recipes?
                </h3>
                <p className="text-slate-500 mb-6">
                  Explore more categories to discover new flavors and cooking techniques!
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Browse All Categories
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add fadeInUp animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;