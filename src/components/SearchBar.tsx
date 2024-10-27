import React, { useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    e.target.value = value;
    debouncedSetSearchTerm(value);
  };

  return (
    <div className="relative max-w-3xl mx-auto mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-2xl blur-xl opacity-20 transform -rotate-1" />
      <div className="relative bg-white rounded-2xl shadow-xl p-2 transform transition-all duration-300 hover:shadow-2xl">
        <div className="relative">
          <input
            type="text"
            defaultValue={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search recipes, ingredients, tags, categories, or chefs..."
            className="w-full pl-14 pr-6 py-4 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-gray-400 transition-all duration-300 text-lg"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-100 rounded-lg p-2">
            <Search className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
