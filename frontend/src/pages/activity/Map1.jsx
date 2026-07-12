import React, { useState } from "react";
import cycle from "../../img/cycle.png";
import shoe from "../../img/shoe.png";
import sneakers from "../../img/sneakers.png";

const SPORTS = [
  { name: "Cycling", icon: cycle },
  { name: "Running", icon: shoe },
  { name: "Walking", icon: sneakers },
];

export default function Map1({ setPage, setIsRecording, setSelectedSport, startTimer }) {
  const [selected, setSelected] = useState("Cycling");

  const select = (name) => {
    setSelected(name);
    setSelectedSport(name);
  };

  return (
    <div className="card p-5 shadow-2xl">
      <div className="flex justify-center gap-3">
        {SPORTS.map((s) => (
          <button
            key={s.name}
            onClick={() => select(s.name)}
            className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 transition ${
              selected === s.name ? "border-brand bg-brand/5" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img src={s.icon} alt={s.name} className="h-8 w-8 object-contain" />
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setSelectedSport(selected);
          setIsRecording(true);
          setPage((prev) => ({ ...prev, first: false, second: true }));
          startTimer();
        }}
        className="btn-primary mt-5 w-full py-3 text-lg font-bold tracking-widest"
      >
        START
      </button>
      <p className="mt-3 text-center text-sm text-gray-400">
        Adventure awaits — start your journey now!
      </p>
    </div>
  );
}
