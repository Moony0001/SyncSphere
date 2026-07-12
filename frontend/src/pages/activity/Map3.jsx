import React from "react";
import { formatDuration } from "../../lib/formatTime";

export default function Map3({ setPage, timer, startTimer, pauseTimer, setIsRecording, distance }) {
  const formattedTime = formatDuration(timer);

  return (
    <div className="card p-5 shadow-2xl">
      <div className="text-center font-mono text-4xl font-bold tracking-tight text-gray-800">
        {formattedTime}
      </div>

      <div className="mt-4 flex justify-around text-center">
        <div>
          <p className="text-xs text-gray-400">Distance</p>
          <p className="text-lg font-bold text-gray-800">{(distance || 0).toFixed(2)} km</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Speed</p>
          <p className="text-lg font-bold text-gray-800">7.0 km/hr</p>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => {
            setIsRecording(true);
            startTimer();
            setPage((prev) => ({ ...prev, third: false, second: true }));
          }}
          className="flex-1 rounded-lg bg-green-500 py-3 text-lg font-bold tracking-wide text-white transition-colors hover:bg-green-600"
        >
          RESUME
        </button>
        <button
          onClick={() => {
            setIsRecording(false);
            pauseTimer();
            setPage((prev) => ({ ...prev, third: false, fourth: true }));
          }}
          className="btn-danger flex-1 py-3 text-lg font-bold tracking-wide"
        >
          FINISH
        </button>
      </div>
    </div>
  );
}
