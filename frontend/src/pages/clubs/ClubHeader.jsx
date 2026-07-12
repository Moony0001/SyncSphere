import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Club from "./Club";

const SPORTS = ["All", "Cycling", "Running"];
// These match the Club model's club_type enum, so the filter works end-to-end.
const CLUB_TYPES = ["All", "Club", "Racing Team", "Company/Workplace", "Shop"];

const ClubHeader = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedClubType, setSelectedClubType] = useState("All");
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [formData, setFormData] = useState({ clubName: "", location: "" });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (formData.clubName) params.append("clubname", formData.clubName);
    if (formData.location) params.append("location", formData.location);
    if (selectedSport !== "All") params.append("sport", selectedSport);
    if (selectedClubType !== "All") params.append("scope", selectedClubType);
    return params.toString();
  }, [formData, selectedSport, selectedClubType]);

  const { data: clubs, isLoading, refetch } = useQuery({
    queryKey: ["clubs", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/clubs?${queryParams}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch clubs");
      return data;
    },
    enabled: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearchTriggered(true);
    refetch();
  };

  useEffect(() => {
    if (queryParams === "") refetch();
  }, [queryParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand">Clubs</h1>
        <button className="btn-primary">Create a Club</button>
      </div>

      {authUser?.clubs?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {authUser.clubs.map((_, index) => (
            <div key={index} className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-400">
              {index + 1}
            </div>
          ))}
        </div>
      )}

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            className="input md:flex-1"
            autoComplete="off"
            name="clubName"
            value={formData.clubName}
            type="text"
            placeholder="Club Name"
            onChange={handleInputChange}
          />
          <input
            className="input md:flex-1"
            autoComplete="off"
            name="location"
            value={formData.location}
            type="text"
            placeholder="Location"
            onChange={handleInputChange}
          />
          <select
            className="input md:w-40"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="input md:w-48"
            value={selectedClubType}
            onChange={(e) => setSelectedClubType(e.target.value)}
          >
            {CLUB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary md:w-auto">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {isSearchTriggered ? (
          isLoading ? (
            <p className="text-center text-sm text-gray-400">Loading...</p>
          ) : clubs?.length ? (
            clubs.map((club) => <Club key={club._id} club={club} />)
          ) : (
            <p className="text-center text-sm text-gray-400">No clubs found.</p>
          )
        ) : (
          <p className="text-center text-sm text-gray-400">
            Enter search criteria and click "Search".
          </p>
        )}
      </div>
    </div>
  );
};

export default ClubHeader;
