import React from "react";
import { Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoClub() {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <Flag className="h-5 w-5 text-brand" />
        <h3 className="font-semibold text-gray-800">Join Clubs!</h3>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Why do it alone?{" "}
        <Link to="/clubs" className="font-medium text-brand hover:underline">
          Join
        </Link>{" "}
        or{" "}
        <a href="#" className="font-medium text-brand hover:underline">
          Create a Club
        </a>
        !
      </p>
    </div>
  );
}
