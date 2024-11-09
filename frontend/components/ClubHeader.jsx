import React, { useState, useRef, useEffect } from "react";
import gift from './gift.png'
const ClubHeader = () => {
  const [selectedSport, setSelectedSport] = useState("Running");
  const [selectedClubType, setSelectedClubType] = useState("All");
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isClubTypeDropdownOpen, setIsClubTypeDropdownOpen] = useState(false);
  const [hasClubs, setHasClubs] = useState(true); // Toggle to false if no clubs are available

  const sportDropdownRef = useRef(null);
  const clubTypeDropdownRef = useRef(null);

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setIsSportDropdownOpen(false);
  };

  const handleClubTypeSelect = (clubType) => {
    setSelectedClubType(clubType);
    setIsClubTypeDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sportDropdownRef.current && !sportDropdownRef.current.contains(event.target)) {
        setIsSportDropdownOpen(false);
      }
      if (clubTypeDropdownRef.current && !clubTypeDropdownRef.current.contains(event.target)) {
        setIsClubTypeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="clubs-component-container">
      <div className="clubs-header">
        <h1 className="clubs-title">Clubs</h1>
        <button className="clubs-create-button">Create a Club</button>
      </div>

      {hasClubs && (
        <div className="clubs-logo-container1">
        <img className="clubs-logo1" src={gift} alt="Logo" />
        <img className="clubs-logo1" src={gift} alt="Logo" />
        </div>
      )}

      <div className="clubs-search-bar">
      <div>
      <input className="clubs-search-input" type="text" placeholder="Club Name" />
      </div>
      <div>
      <input className="clubs-search-input" type="text" placeholder="Location" />
      </div>
        

        {/* Sport Type Dropdown */}
        <div className="clubs-dropdown" ref={sportDropdownRef} onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}>
          <span>{selectedSport}</span>
          {isSportDropdownOpen && (
            <div className="clubs-dropdown-menu">
              {["Running", "Cycling", "Swimming"].map((sport) => (
                <div key={sport} className="dropdown-option" onClick={() => handleSportSelect(sport)}>
                  {sport}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Club Type Dropdown */}
        <div className="clubs-dropdown" ref={clubTypeDropdownRef} onClick={() => setIsClubTypeDropdownOpen(!isClubTypeDropdownOpen)}>
          <span>{selectedClubType}</span>
          {isClubTypeDropdownOpen && (
            <div className="clubs-dropdown-menu">
              {["All", "Public", "Private"].map((clubType) => (
                <div key={clubType} className="dropdown-option" onClick={() => handleClubTypeSelect(clubType)}>
                  {clubType}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="clubs-search-button">Search</button>
      </div>

      <p className="clubs-search-info">Search for a club above.</p>
    </div>
  );
};

export default ClubHeader;
