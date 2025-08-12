// src/components/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, handleSearch }) => {
  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="flex justify-center my-8">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder="e.g. Arrabiata"
        className="w-full max-w-md p-3 border-2 border-amber-300 rounded-l-lg focus:outline-none focus:border-amber-500 transition-colors"
      />
      <button
        onClick={handleSearch}
        className="bg-amber-500 text-white p-3 rounded-r-lg hover:bg-amber-600 transition-colors font-semibold"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;