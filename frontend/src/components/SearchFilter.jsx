import React, { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";

const options = ["Athletes", "Teams", "Leagues", "Sports"];

const SearchFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Athletes");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex w-full max-w-md items-center gap-2">
      {/* Category select */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:border-brand"
        >
          {selected}
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        {isOpen && (
          <ul className="absolute z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          className="input pl-9 pr-9"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
