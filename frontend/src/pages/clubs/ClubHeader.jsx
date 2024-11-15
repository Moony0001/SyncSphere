import React, { useState, useRef, useEffect, useMemo } from "react";
import gift from '../../img/gift.png'
import { useQuery } from "@tanstack/react-query";
import Club from "./Club";


const ClubHeader = () => {
  const {data: authUser} = useQuery({queryKey: ["authUser"]});

  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedClubType, setSelectedClubType] = useState("All");
  const [isSportDropdownOpen, setIsSportDropdownOpen] = useState(false);
  const [isClubTypeDropdownOpen, setIsClubTypeDropdownOpen] = useState(false);
  const [hasClubs, setHasClubs] = useState(false); // Toggle to false if no clubs are available
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

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
    if (authUser?.clubs?.length) {
      setHasClubs(true);
    } else {
      setHasClubs(false);
    }
  }, [authUser]);  

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

  const [formData, setFormData] = useState({
    clubName: "",
    location: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (formData.clubName) params.append("clubname", formData.clubName);
    if (formData.location) params.append("location", formData.location);
    if (selectedSport !== "All") params.append("sport", selectedSport);  
    if (selectedClubType !== "All") params.append("scope", selectedClubType);
    return params.toString();
  }, [formData, selectedSport, selectedClubType]);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearchTriggered(true);
    refetch();
  };

  const {data: clubs, isLoading, refetch, isRefetching} = useQuery({
    queryKey: ["clubs", queryParams.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/clubs?${queryParams.toString()}`);
      const data = await res.json();
      if(!res.ok) {
        throw new Error(data.error || "Failed to fetch clubs");
      }
      return data;
    },
    enabled: false,
  });

  useEffect(() => {
    if (queryParams.toString() === "") {
      refetch();
    }
  }, [queryParams]);

  return (
      <div className="clubs-component-container">
        <div className="clubs-header">
          <h1 className="clubs-title">Clubs</h1>
          <button className="clubs-create-button">Create a Club</button>
        </div>

        {hasClubs && authUser?.clubs?.length > 0 ? (
          <div className="clubs-logo-container1">
        {authUser.clubs.map((club, index) => (
          <img key={index} className="clubs-logo1" src={gift} alt="Logo" />
        ))}
          </div>
        ) : null}

      <form onSubmit={handleSubmit}>
        <div className="clubs-search-bar">
            <div>
              <input 
                autoComplete="off"
                name="clubName"
                value={formData.clubName}
                className="clubs-search-input" 
                type="text" 
                placeholder="Club Name"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input 
                autoComplete="off"
                name="location"
                value={formData.location}
                className="clubs-search-input" 
                type="text" 
                placeholder="Location"
                onChange={handleInputChange} 
              />
            </div>
          

          {/* Sport Type Dropdown */}
            <div className="clubs-dropdown" ref={sportDropdownRef} onClick={() => setIsSportDropdownOpen(!isSportDropdownOpen)}>
              <span>{selectedSport}</span>
              {isSportDropdownOpen && (
                <div className="clubs-dropdown-menu">
                  {["All","Running", "Cycling", "Swimming"].map((sport) => (
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
    </form>
      <br />
      {isSearchTriggered ? (
        isLoading ? (
          <p>Loading...</p>
        ) : clubs?.length ? (
          clubs.map((club) => <Club key={club._id} club={club} />)
        ) : (
          <p>No clubs found.</p>
        )
      ) : (
        <p>Enter search criteria and click "Search".</p>
      )}
    </div>
  );
};

export default ClubHeader;
