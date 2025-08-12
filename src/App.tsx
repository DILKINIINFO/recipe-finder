// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CategoryPage from '../src/components/CategoryPage'; // <-- Import new page

function App() {
  return (
    <BrowserRouter>
      {/* The background color is now managed by the pages themselves */}
      <div>
        <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-center items-center">
            <Link to="/" className="no-underline">
              <h1 className="text-3xl text-center text-amber-600 font-bold tracking-wider">
                Recipe Finder
              </h1>
            </Link>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/category/:name" element={<CategoryPage />} /> {/* <-- Add new route */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;