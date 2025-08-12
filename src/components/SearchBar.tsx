// src/components/SearchBar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Meal } from '../types/recipe';
import { useDebounce } from '../hooks/useDebounce';

const API_SEARCH_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  onSuggestionSelect: (term: string) => void; // New prop to handle selection
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState<Meal[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms delay
  const searchContainerRef = useRef<HTMLDivElement>(null); // Ref for the component container

  // Effect to fetch suggestions when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      fetch(`${API_SEARCH_URL}${debouncedSearchTerm}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data.meals || []);
          setIsLoading(false);
          setIsDropdownOpen(true);
        })
        .catch(err => {
          console.error("Failed to fetch suggestions", err);
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [debouncedSearchTerm]);

  // Effect to handle clicks outside the search bar to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <div className="relative w-full max-w-md" ref={searchContainerRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setIsDropdownOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="e.g. Chicken"
          className="w-full p-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
          autoComplete="off"
        />
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 text-gray-500">Loading...</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.map(meal => (
                  <li 
                    key={meal.idMeal} 
                    className="p-3 hover:bg-amber-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(meal.strMeal)}
                  >
                    {meal.strMeal}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-gray-500">No suggestions found.</div>
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="bg-amber-500 text-white p-3 rounded-r-lg hover:bg-amber-600 transition-colors font-semibold ml-[-1px]"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;