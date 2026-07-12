import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import userplaceholder from "../img/user.png";

function Stat({ label, value }) {
  return (
    <div className="px-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-gray-800">{value}</p>
    </div>
  );
}

export default function UserProfile() {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="card p-5">
      <Link to={`/profile/${authUser?._id}`} className="flex flex-col items-center">
        <img
          src={authUser?.profileImg || userplaceholder}
          alt="Profile"
          className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
        />
        <h2 className="mt-3 text-base font-semibold text-gray-800">
          {authUser?.firstname} {authUser?.lastname}
        </h2>
      </Link>

      <div className="mt-4 grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 pt-4 text-center">
        <Stat label="Following" value={authUser?.following?.length ?? 0} />
        <Stat label="Followers" value={authUser?.followers?.length ?? 0} />
        <Stat label="Activities" value={authUser?.activities?.length ?? 0} />
      </div>
    </div>
  );
}
