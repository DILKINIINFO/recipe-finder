// src/components/RecipeSlideshow.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Meal } from '../types/recipe';

interface RecipeSlideshowProps {
  recipes: Meal[];
}

const RecipeSlideshow: React.FC<RecipeSlideshowProps> = ({ recipes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || recipes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % recipes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [recipes.length, isAutoPlaying]);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % recipes.length;
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + recipes.length) % recipes.length;
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!recipes.length) {
    return (
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 h-72 md:h-96 lg:h-[500px] bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xl font-medium">No featured recipes available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
      {/* Main slideshow container */}
      <div className="relative h-72 md:h-96 lg:h-[500px]">
        {recipes.map((recipe, index) => (
          <div
            key={`${recipe.idMeal}-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <Link 
              to={`/recipe/${recipe.idMeal}`} 
              className="block w-full h-full"
            >
              {/* Background Image */}
              <div 
                className="w-full h-full bg-cover bg-center transform transition-transform duration-[7s] hover:scale-105"
                style={{ backgroundImage: `url(${recipe.strMealThumb})` }}
              >
                {/* Enhanced gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                  <div className="max-w-2xl">
                    {/* Category badge */}
                    {recipe.strCategory && (
                      <div className="mb-4">
                        <span className="inline-flex items-center px-4 py-2 bg-amber-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-amber-400/50">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {recipe.strCategory}
                        </span>
                      </div>
                    )}
                    
                    {/* Recipe title */}
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                      {recipe.strMeal}
                    </h2>
                    
                    {/* Recipe details */}
                    {recipe.strArea && (
                      <div className="flex items-center space-x-6 text-amber-200 mb-6">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-lg font-medium">{recipe.strArea}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Call to action */}
                    <div className="flex items-center text-white">
                      <span className="text-lg font-semibold mr-3">View Recipe</span>
                      <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-30"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {recipes.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / recipes.length) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {currentIndex + 1} / {recipes.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 bg-black/40 backdrop-blur-sm hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isAutoPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Category indicator (shows which category the current recipe is from) */}
      {recipes[currentIndex]?.strCategory && (
        <div className="absolute bottom-20 left-6">
          <Link 
            to={`/category/${recipes[currentIndex].strCategory}`}
            className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            More {recipes[currentIndex].strCategory}
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecipeSlideshow;