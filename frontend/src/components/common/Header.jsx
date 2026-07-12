import React, { useState } from "react";
import { Search, Bell, Menu, X, ChevronDown, User } from "lucide-react";
import SearchFilter from "../SearchFilter";
import SideBarMenu from "../SideBarMenu";
import logo from "../../img/syncsphere.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

const dropdownPanel =
  "invisible absolute left-0 top-full z-50 mt-1 min-w-[190px] rounded-lg border border-gray-200 bg-white py-1 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100";
const dropdownItem =
  "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand";

function NavDropdown({ label, children }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 rounded-md px-3 py-2 text-[15px] font-medium text-gray-700 transition-colors hover:text-brand">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      <div className={dropdownPanel}>{children}</div>
    </div>
  );
}

export default function Header({ hamburger, setHamburger }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to Logout");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: () => toast.error("Failed to logout"),
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-container items-center justify-between px-4 sm:px-6">
        {/* Left: logo + nav / search */}
        <div className="flex flex-1 items-center gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <img src={logo} alt="SyncSphere" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-brand">SyncSphere</span>
          </Link>

          <div className="hidden flex-1 items-center gap-1 lg:flex">
            {searchOpen ? (
              <SearchFilter />
            ) : (
              <>
                <NavDropdown label="Dashboard">
                  <Link to="/" className={dropdownItem}>My Activities</Link>
                  <a href="#" className={dropdownItem}>Friend's Activities</a>
                  <a href="#" className={dropdownItem}>Stats</a>
                </NavDropdown>
                <NavDropdown label="Training">
                  <a href="#" className={dropdownItem}>Training Plans</a>
                  <a href="#" className={dropdownItem}>My Workouts</a>
                  <a href="#" className={dropdownItem}>Goals</a>
                </NavDropdown>
              </>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Toggle search"
            className="hidden rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand lg:inline-flex"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>

          {authUser ? (
            <>
              <div className="group relative">
                <button
                  aria-label="Profile menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-brand hover:text-white"
                >
                  <User className="h-5 w-5" />
                </button>
                <div className={dropdownPanel + " left-auto right-0"}>
                  <Link to={`/profile/${authUser._id}`} className={dropdownItem}>My Profile</Link>
                  <a href="#" className={dropdownItem}>My Friends</a>
                  <button
                    onClick={() => logout()}
                    className={dropdownItem + " w-full text-left font-semibold text-red-500 hover:text-red-600"}
                  >
                    Log Out
                  </button>
                </div>
              </div>
              <button
                aria-label="Notifications"
                className="hidden rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-brand sm:inline-flex"
              >
                <Bell className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link
              to={location.pathname === "/login" ? "/signup" : "/login"}
              className="btn-primary hidden lg:inline-flex"
            >
              {location.pathname === "/login" ? "Sign Up" : "Log In"}
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            aria-label="Menu"
            onClick={() => setHamburger(!hamburger)}
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {!hamburger && <SideBarMenu authUser={authUser} onLogout={() => logout()} onClose={() => setHamburger(true)} />}
    </header>
  );
}
