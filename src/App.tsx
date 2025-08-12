// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from '../src/pages/RecipeDetailPage';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-stone-100 min-h-screen font-sans">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-6">
            <a href="/" className="no-underline">
              <h1 className="text-4xl text-center text-amber-600 font-bold tracking-wider">
                Recipe Finder
              </h1>
            </a>
            <p className="text-center text-slate-600 mt-2">
              Discover delicious recipes from around the world.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* Route for the home page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Route for the recipe detail page. ":id" is a URL parameter. */}
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;