import React from "react";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const columns = [
  { title: "About", links: ["About SyncSphere", "Features", "Careers"] },
  { title: "Explore", links: ["Routes", "Segments", "Clubs"] },
  { title: "Help", links: ["Support", "Privacy", "Terms"] },
];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-container grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-3 md:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand">SyncSphere</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-gray-500">
            Community-powered motivation. Track your activities, share your progress,
            and move together.
          </p>
          <div className="mt-4 flex gap-3 text-gray-500">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full p-2 transition-colors hover:bg-gray-100 hover:text-brand"
                aria-label="Social link"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-gray-800">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-500 transition-colors hover:text-brand">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} SyncSphere. All rights reserved.
      </div>
    </footer>
  );
}
