// src/components/SearchBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Meal } from '../types/recipe';
import { useDebounce } from '../hooks/useDebounce';

const API_SEARCH_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  onSuggestionSelect: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to fetch suggestions when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 1) {
      setIsLoading(true);
      fetch(`${API_SEARCH_URL}${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => {
          const meals = data.meals || [];
          setSuggestions(meals.slice(0, 6)); // Limit to 6 suggestions
          setIsLoading(false);
          setIsDropdownOpen(true);
          setSelectedIndex(-1);
        })
        .catch(err => {
          console.error("Failed to fetch suggestions", err);
          setIsLoading(false);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
    }
  }, [debouncedSearchTerm]);

  // Effect to handle clicks outside the search bar to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSuggestionClick = (mealName: string) => {
    onSuggestionSelect(mealName);
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || suggestions.length === 0) {
      if (event.key === 'Enter') {
        handleSearch();
        setIsDropdownOpen(false);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex].strMeal);
        } else {
          handleSearch();
          setIsDropdownOpen(false);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() 
        ? <span key={index} className="bg-amber-200 font-semibold">{part}</span>
        : part
    );
  };

  return (
    <div className="flex justify-center my-8">
      <div className="relative w-full max-w-2xl" ref={searchContainerRef}>
        <div className="relative">
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm && suggestions.length > 0) {
                setIsDropdownOpen(true);
              }
            }}
            onKeyDown={onKeyDown}
            placeholder="Search recipes... (e.g. Chicken Curry, Pasta)"
            className="w-full p-4 pr-16 text-lg border-2 border-amber-300/50 rounded-l-2xl focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl placeholder-slate-400"
            autoComplete="off"
          />
          
          {/* Search icon or loading spinner */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
            ) : (
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-50 border border-amber-200/50 overflow-hidden max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-3"></div>
                <p className="text-slate-500">Finding recipes...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-100">
                  <p className="text-sm text-amber-700 font-medium">
                    {suggestions.length} recipe{suggestions.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <ul>
                  {suggestions.map((meal, index) => (
                    <li 
                      key={meal.idMeal} 
                      className={`p-4 cursor-pointer transition-all duration-200 flex items-center space-x-4 border-b border-gray-100/50 last:border-b-0 ${
                        index === selectedIndex 
                          ? 'bg-amber-50 border-amber-200' 
                          : 'hover:bg-amber-50/50'
                      }`}
                      onClick={() => handleSuggestionClick(meal.strMeal)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      {/* Recipe image */}
                      <div className="flex-shrink-0">
                        <img
                          src={meal.strMealThumb}
                          alt={meal.strMeal}
                          className="w-14 h-14 rounded-xl object-cover shadow-md"
                        />
                      </div>
                      
                      {/* Recipe details */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-lg mb-1 truncate">
                          {highlightText(meal.strMeal, searchTerm)}
                        </div>
                        <div className="flex items-center text-sm text-slate-500 space-x-2">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {meal.strArea}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {meal.strCategory}
                          </span>
                        </div>
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {/* Show all results footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => {
                      handleSearch();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-center text-amber-600 hover:text-amber-700 font-semibold py-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
                  >
                    Show all results for "{searchTerm}" →
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-500 mb-2">No recipes found for "{searchTerm}"</p>
                <p className="text-sm text-slate-400">Try searching for something else or browse categories</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Enhanced search button */}
      <button
        onClick={() => {
          handleSearch();
          setIsDropdownOpen(false);
        }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-r-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
      >
        <span>Search</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;