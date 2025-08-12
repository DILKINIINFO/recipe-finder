// src/components/CategoryCard.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/category/${category.strCategory}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl shadow-xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl aspect-square bg-gradient-to-br from-gray-200 to-gray-300">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        
        {/* Category image */}
        <img 
          src={category.strCategoryThumb} 
          alt={category.strCategory} 
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/40 transition-all duration-500" />
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        {/* Category title with enhanced styling */}
        <div className="absolute inset-0 flex items-end justify-center p-6">
          <div className="text-center transform group-hover:-translate-y-2 transition-transform duration-500">
            <h3 className="text-white text-xl md:text-2xl font-bold drop-shadow-2xl mb-2 group-hover:text-amber-200 transition-colors duration-300">
              {category.strCategory}
            </h3>
            <div className="w-12 h-0.5 bg-amber-400 mx-auto rounded-full opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-500"></div>
          </div>
        </div>
        
        {/* Subtle border animation */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-2xl transition-all duration-500"></div>
        
        {/* Corner accent */}
        <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[40px] border-l-transparent border-b-[40px] border-b-amber-500/80 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      </div>
    </Link>
  );
};

export default CategoryCard;