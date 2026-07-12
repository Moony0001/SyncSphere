import React from "react";

export default function Map2({ setPage, timer, pauseTimer, setIsRecording, distance }) {
  const formattedTime = new Date(timer * 1000).toISOString().slice(11, 19);

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
