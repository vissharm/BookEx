import React, { useState } from 'react';

const SearchComponent = ({ 
  criteriaOptions,
  onSearch,
  placeholder = 'Enter search term...', // Default placeholder
  inputClass = '',
  dropdownClass = '',
  buttonClass = ''
 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState(criteriaOptions[0].value); // Default to first criteria

  // Handle search button click
  const handleSearch = () => {
    // Call the onSearch callback with selected criteria and search term
    onSearch(selectedCriteria, searchTerm);
  };

  return (
    <div>
      <div className="row" style={{ width: '70%', background: 'black', paddingLeft: '140px', marginTop: '10px', borderRadius: '30px' }}>
        <div class="input-field inline col s8">
          <input
            type="text"
            name="isbn"
            id="isbn"
            style={{ color: 'white' }}
            className={`${inputClass} validate`}
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label for="isbn">Search book by title or ISBN</label>
        </div>
        <div class="input-field inline col s2" style={{ height: '45px' }}>
          <select
            className={`${dropdownClass} waves-light`}
            style={{display: 'inline-block'}}
            value={selectedCriteria}
            onChange={(e) => setSelectedCriteria(e.target.value)}
          >
            {criteriaOptions.map((option) => (
              <option key={option.value} value={option.value}>
                 {option.label}
               </option>
            ))}
          </select>
        </div>
        <div className="input-field inline col s1">
          <input
            style={{ height: '45px' }}
            className={`${buttonClass} waves-effect waves-light btn`}
            type="button"
            value="Search"
            onClick={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
