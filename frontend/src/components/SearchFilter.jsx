import React, { useState } from 'react';
import arrow from './arrow.png'
import cross from './cross.png'
const SearchFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('Athletes');
  const [searchTerm, setSearchTerm] = useState('');

  const options = ['Athletes', 'Teams', 'Leagues', 'Sports'];

  const toggleSelect = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="search-filter">
      {/* Custom Select */}
      <div className="custom-select">
        <div className="select-box" onClick={toggleSelect}>
          {selected}
          <span className="arrow">
            <img src={arrow}/>
          </span>
        </div>
        {isOpen && (
          <ul className="select-options">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="option"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search Input */}
      <div className="search-input-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search"
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="clear-button"
          >
            <img src={cross} id='searchbox'/>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
