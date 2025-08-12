// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CategoryPage from '../src/components/CategoryPage';
import SearchResultsPage from './pages/SearchResultsPage'; // <-- 1. Import the new page

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-40">
          {/* ... header JSX remains the same ... */}
          <div className="container mx-auto px-4 py-4 flex justify-center items-center">
            <Link to="/" className="no-underline">
              <h1 className="text-3xl text-center text-amber-600 font-bold tracking-wider">
                Recipe Finder
              </h1>
            </Link>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/search/:query" element={<SearchResultsPage />} /> {/* <-- 2. Add the new route */}
          </Routes>
        </main>

        <footer className="bg-slate-800 text-slate-400 py-6 mt-16">
          {/* ... footer JSX remains the same ... */}
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