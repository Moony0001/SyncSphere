import React from "react";
import UserProfile from "./UserProfile";
import Middle from "./Middle";
import NoClub from "./NoClub";
import Friends from "./Friends";

export default function Holder({ setHamburger }) {
  return (
    <div
      onClick={() => setHamburger(true)}
      className="mx-auto grid max-w-container grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]"
    >
      {/* Left column */}
      <aside className="hidden flex-col gap-6 lg:flex">
        <UserProfile />
        <NoClub />
      </aside>

      {/* Center feed */}
      <div className="min-w-0">
        <Middle />
      </div>

      {/* Right column */}
      <aside className="hidden flex-col gap-6 lg:flex">
        <Friends />
      </aside>
    </div>
  );
}
