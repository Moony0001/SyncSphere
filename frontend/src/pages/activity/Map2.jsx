import React from "react";
import { formatDuration } from "../../lib/formatTime";
import { formatPace, formatSpeed } from "../../lib/metrics";

export default function Map2({ setPage, timer, pauseTimer, setIsRecording, distance }) {
  const formattedTime = formatDuration(timer);

  return (
    <div className="card p-5 shadow-2xl">
      <div className="text-center font-mono text-4xl font-bold tracking-tight text-gray-800">
        {formattedTime}
      </div>

      <div className="mt-4 grid grid-cols-3 text-center">
        <div>
          <p className="text-xs text-gray-400">Distance</p>
          <p className="text-lg font-bold text-gray-800">{(distance || 0).toFixed(2)} km</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Pace</p>
          <p className="text-lg font-bold text-gray-800">{formatPace(distance, timer)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Speed</p>
          <p className="text-lg font-bold text-gray-800">{formatSpeed(distance, timer)}</p>
        </div>
      </div>

      <button
        onClick={() => {
          setIsRecording(false);
          pauseTimer();
          setPage((prev) => ({ ...prev, second: false, third: true }));
        }}
        className="btn-danger mt-5 w-full py-3 text-lg font-bold tracking-widest"
      >
        PAUSE
      </button>
    </div>
  );
}
