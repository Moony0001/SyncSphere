import * as React from "react";
import { Link } from "react-router-dom";
import watch from "../img/watch.png";

export default function Middle() {
  return (
    <div className="card overflow-hidden">
      <img src={watch} alt="Getting started" className="h-44 w-full object-cover" />

      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Getting Started</h1>

        <div className="mt-4 flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-brand text-xs font-bold text-brand">
            1
          </span>
          <div>
            <h2 className="font-semibold text-gray-800">Record your first activity</h2>
            <p className="mt-1 text-sm text-gray-500">
              Set up your GPS device and seamlessly upload your workouts right here.
            </p>
          </div>
        </div>

        <Link to="/post/create">
          <button className="btn-primary mt-6">Record Activity</button>
        </Link>
      </div>
    </div>
  );
}
