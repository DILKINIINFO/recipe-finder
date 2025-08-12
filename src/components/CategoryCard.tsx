// src/components/CategoryCard.tsx

import React from 'react';
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
  return (
    <Link to={`/category/${category.strCategory}`} className="group block">
      <div className="relative overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 group-hover:scale-105">
        <img src={category.strCategoryThumb} alt={category.strCategory} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold text-center drop-shadow-lg p-2">
            {category.strCategory}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;