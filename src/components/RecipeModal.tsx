// src/components/RecipeModal.tsx
import React from 'react';
import { Meal, Ingredient } from '../types/recipe';

interface RecipeModalProps {
  recipe: Meal;
  onClose: () => void;
}

// Helper function to parse ingredients
const getIngredients = (recipe: Meal): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredientKey = `strIngredient${i}` as keyof Meal;
    const measureKey = `strMeasure${i}` as keyof Meal;
    
    const ingredient = recipe[ingredientKey];
    const measure = recipe[measureKey];

    if (ingredient && ingredient.trim() !== '') {
      ingredients.push({ name: ingredient, measure: measure || '' });
    }
  }
  return ingredients;
};


const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const ingredients = getIngredients(recipe);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
        
        <h2 className="text-3xl font-bold mb-4 text-amber-600">{recipe.strMeal}</h2>
        <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-64 object-cover rounded-md mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <span className="font-bold block text-lg">Category</span>
            <span className="text-gray-700">{recipe.strCategory}</span>
          </div>
          <div className="text-center">
            <span className="font-bold block text-lg">Area</span>
            <span className="text-gray-700">{recipe.strArea}</span>
          </div>
          <div className="text-center">
             {recipe.strYoutube && (
              <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Watch on YouTube
              </a>
             )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3 border-b-2 border-amber-300 pb-2">Ingredients</h3>
            <ul className="list-disc list-inside">
              {ingredients.map((ing, index) => (
                <li key={index} className="mb-1">
                  <span className="font-semibold">{ing.name}</span> - {ing.measure}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-3 border-b-2 border-amber-300 pb-2">Instructions</h3>
            <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {recipe.strInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;