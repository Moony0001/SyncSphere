import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import userplaceholder from "../img/user.png";
import useFollow from "../hooks/useFollow";

export default function Friends() {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      const res = await fetch("/api/user/suggested");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch suggested users");
      return data;
    },
    retry: false,
  });

  const { follow, isPending } = useFollow();

  if (!isLoading && suggestedUsers?.length === 0) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-brand" />
        <h3 className="font-semibold text-gray-800">Suggested Friends</h3>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {isLoading && <span className="text-sm text-gray-400">Loading...</span>}

        {!isLoading &&
          suggestedUsers?.map((user) => (
            <div key={user._id} className="flex items-center justify-between gap-3">
              <Link to={`/profile/${user._id}`} className="flex min-w-0 items-center gap-3">
                <img
                  src={user.profileImg || userplaceholder}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="truncate text-sm font-medium text-gray-700">
                  {user.firstname} {user.lastname}
                </span>
              </Link>
              <button
                onClick={() => follow(user._id)}
                disabled={isPending}
                className="btn-outline shrink-0 px-3 py-1.5 text-xs"
              >
                Follow
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
