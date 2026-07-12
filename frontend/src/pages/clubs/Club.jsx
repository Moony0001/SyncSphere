import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

function Club({ club }) {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [membersCount, setMembersCount] = useState(club.members.length);
  const [inClub, setInClub] = useState(club.members.includes(authUser?._id));

  const queryClient = useQueryClient();

  const { mutate: joinClub, isPending: isJoining } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/clubs/join/${club._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join club");
      return data;
    },
    onSuccess: (updatedMembers) => {
      setMembersCount(updatedMembers.length);
      setInClub(true);
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    setMembersCount(club.members.length);
  }, [club.members]);

  return (
    <div className="card flex items-center justify-between gap-4 p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          {club.logo ? (
            <img src={club.logo} alt="Club" className="h-full w-full object-cover" />
          ) : (
            <Users className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-brand">{club.name}</p>
          <p className="truncate text-sm text-gray-500">{club.location}</p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
            <span>{membersCount} members</span>
            <span>{club.sport}</span>
            <span>{club.club_type}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        {inClub ? (
          <span className="text-sm font-medium text-gray-400">Joined</span>
        ) : (
          <button onClick={() => joinClub()} disabled={isJoining} className="btn-primary">
            {isJoining ? "Joining..." : "Join"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Club;
