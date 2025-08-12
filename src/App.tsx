// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CategoryPage from '../src/components/CategoryPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-center items-center">
            <Link to="/" className="no-underline">
              <h1 className="text-3xl text-center text-amber-600 font-bold tracking-wider">
                Recipe Finder
              </h1>
            </Link>
          </div>
        </header>

        {/* The main content will grow to fill the space */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
          </Routes>
        </main>

        {/* --- NEW FOOTER --- */}
        <footer className="bg-slate-800 text-slate-400 py-6 mt-16">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Recipe Finder. All Rights Reserved.</p>
            <p className="text-sm mt-1">
              Powered by{' '}
              <a 
                href="https://www.themealdb.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-400 hover:underline"
              >
                TheMealDB API
              </a>
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;