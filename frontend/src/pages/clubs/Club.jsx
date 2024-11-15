import { useEffect, useState } from "react";
import gift from '../../img/gift.png';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


function Club({club}) {

  const {data: authUser} = useQuery({queryKey: ["authUser"]});

  const [membersCount, setMembersCount] = useState(club.members.length);
  const [inClub, setInClub] = useState(club.members.includes(authUser?._id));


  const clubName = club.name;
  const clubLocation = club.location;
  const clubSport = club.sport;
  const clubType = club.club_type;

  const queryClient = useQueryClient();
  
  const {mutate: joinClub, isPending: isJoining} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/clubs/join/${club._id}`, {
          method: "POST",
        });
        const data = await res.json();
        console.log(data);
        if(!res.ok) {
          throw new Error(data.error || "Failed to join club");
        }
        return data;
      } catch (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: (updatedMembers) => {
      setMembersCount(updatedMembers.length);
      setInClub(true);
      queryClient.setQueryData(["clubs"], (oldData) =>
        oldData.map((c) =>
          c._id === club._id ? { ...c, members: updatedMembers } : c
        )
      );
      queryClient.setQueryData(["authUser"], (oldAuthUser) => ({
        ...oldAuthUser,
        clubs: [...(oldAuthUser?.clubs || []), club._id],
      }));
      queryClient.invalidateQueries(["clubs"]); // Refetch all clubs
      queryClient.invalidateQueries(["authUser"]); // Refetch authUser data
    },
    onError: () => {
      toast.error(error.message);
    }
  });

  const handleJoinClub = () => {
    joinClub();
  };

  useEffect(() => {
    setMembersCount(club.members.length);
 }, [club.members]);
 

  return (
    <div className="club-card1">
      <div className="club-info">
        <div className="club-image">
          <img src={gift} alt="Club Icon" />
        </div>
        <div className="club-details">
          <p className="club-name">{clubName}</p>
          <p className="club-location">{clubLocation}</p>
          {!inClub && (
            <button className="join-button" onClick={handleJoinClub} disabled={isJoining}>
              {isJoining ? "Joining..." : "Join"}
            </button>
          )}
          <span className="first">{membersCount}</span>
          <span className="second">{clubSport}</span>
          <span className="third">{clubType}</span>
        </div>
      </div>
      <div className="club-actions">
        
        <div className="club-stats">
          <span>{membersCount}</span>
          <span>{clubSport}</span>
          <span>{clubType}</span>
        </div>
      </div>
    </div>
  );
}

export default Club;
