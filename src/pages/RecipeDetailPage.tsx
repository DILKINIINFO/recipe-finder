// src/pages/RecipeDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lookupRecipeById } from '../api/mealdb';
import { Meal, Ingredient } from '../types/recipe';

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      lookupRecipeById(id)
        .then(data => {
          if (data.meals && data.meals.length > 0) {
            setRecipe(data.meals[0]);
          } else {
            setError('Recipe not found');
          }
        })
        .catch(err => {
          console.error(err);
          setError('Failed to load recipe. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getIngredients = (meal: Meal): Ingredient[] => {
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  const formatInstructions = (instructions: string): string[] => {
    return instructions
      .split(/\r\n|\r|\n/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-3">Loading Recipe</h2>
          <p className="text-slate-500">Preparing your delicious dish details...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-3">Recipe Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'This recipe could not be loaded.'}</p>
          <Link 
            to="/"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);
  const instructionSteps = formatInstructions(recipe.strInstructions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background Image */}
        {recipe.strMealThumb && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl" />

        <div className="relative container mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-amber-200">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              {recipe.strCategory && (
                <>
                  <Link 
                    to={`/category/${recipe.strCategory}`}
                    className="hover:text-white transition-colors"
                  >
                    {recipe.strCategory}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span className="text-white font-medium truncate">{recipe.strMeal}</span>
            </div>
          </nav>

          {/* Recipe Header */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  {recipe.strCategory && (
                    <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                      {recipe.strCategory}
                    </span>
                  )}
                  {recipe.strArea && (
                    <span className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {recipe.strArea}
                    </span>
                  )}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {recipe.strMeal}
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mb-6" />
              
              <div className="flex items-center space-x-8 text-amber-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Cook Time: 30-45 min</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Serves: 4-6</span>
                </div>
              </div>

              {/* Action Buttons - Only Back to Category */}
              <div className="mt-8">
                <Link 
                  to={`/category/${recipe.strCategory}`}
                  className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg mr-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  More {recipe.strCategory}
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {!imageLoaded && (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                )}
                <img 
                  src={recipe.strMealThumb} 
                  alt={recipe.strMeal}
                  className={`w-full h-96 object-cover transition-opacity duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/30 via-transparent to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-400/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl" />
            </div>
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
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Ingredients Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-amber-200/50 sticky top-24">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                Ingredients
              </h2>
              
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-amber-50/50 rounded-xl border border-amber-100 hover:bg-amber-100/50 transition-colors duration-200"
                  >
                    <span className="font-medium text-slate-700">
                      {ingredient.name}
                    </span>
                    <span className="text-amber-600 font-semibold text-sm bg-white/80 px-2 py-1 rounded-lg">
                      {ingredient.measure || 'As needed'}
                    </span>
                  </div>
                ))}
              </div>

              {/* YouTube Link */}
              {recipe.strYoutube && (
                <div className="mt-8 pt-6 border-t border-amber-200">
                  <a 
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Watch Video Tutorial
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-amber-200/50">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                Instructions
              </h2>
              
              <div className="space-y-6">
                {instructionSteps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-6 bg-gradient-to-r from-orange-50/50 to-red-50/50 rounded-2xl border border-orange-100/50 hover:from-orange-100/50 hover:to-red-100/50 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-700 leading-relaxed text-lg">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {recipe.strTags && (
                <div className="mt-8 pt-6 border-t border-orange-200">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.strTags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-sm rounded-full border border-amber-200"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;