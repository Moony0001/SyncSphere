import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import SearchFilter from "./SearchFilter";

function Section({ title, links, onNavigate }) {
  return (
    <div>
      <h3 className="section-title text-brand">{title}</h3>
      <ul className="mt-2 space-y-2">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} onClick={onNavigate} className="text-gray-700 transition-colors hover:text-brand">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SideBarMenu = ({ authUser, onLogout, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col gap-6 overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-brand">SyncSphere</span>
          <button onClick={onClose} aria-label="Close menu" className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <SearchFilter />

        <nav className="space-y-6 text-sm">
          <Section
            title="Dashboard"
            onNavigate={onClose}
            links={[["My Activities", "/"], ["Friend's Activities", "#"], ["Stats", "#"]]}
          />
          <Section
            title="Training"
            onNavigate={onClose}
            links={[["Training Plans", "#"], ["My Workouts", "#"], ["Goals", "#"]]}
          />
          <Section
            title="Socials"
            onNavigate={onClose}
            links={[["Find Friends", "#"], ["Clubs", "/clubs"]]}
          />
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-4">
          {authUser ? (
            <div className="flex items-center justify-between">
              <Link to={`/profile/${authUser._id}`} onClick={onClose} className="text-sm font-medium text-gray-700">
                My Profile
              </Link>
              <button onClick={onLogout} className="text-sm font-semibold text-red-500 hover:text-red-600">
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={onClose} className="btn-primary w-full">
              Log In
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SideBarMenu;
