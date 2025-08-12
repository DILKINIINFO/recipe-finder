// src/api/mealdb.ts

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Function to search recipes by name
export const searchRecipesByName = async (name: string) => {
  const response = await fetch(`${BASE_URL}/search.php?s=${name}`);
  if (!response.ok) throw new Error('Network response was not ok.');
  return response.json();
};

// Function to get a list of all categories
export const listAllCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories.php`);
  if (!response.ok) throw new Error('Network response was not ok.');
  return response.json();
};

// Function to get all recipes within a specific category
export const filterByCategory = async (categoryName: string) => {
  const response = await fetch(`${BASE_URL}/filter.php?c=${categoryName}`);
  if (!response.ok) throw new Error('Network response was not ok.');
  return response.json();
};

// Function to look up a full recipe by its ID
export const lookupRecipeById = async (id: string) => {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  if (!response.ok) throw new Error('Network response was not ok.');
  return response.json();
};