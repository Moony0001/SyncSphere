import React, { useEffect, useRef, useState } from "react";
import Map1 from "./Map1";
import Map2 from "./Map2";
import Map3 from "./Map3";
import Form from "./Form";
import Map from "../../components/common/Map";

export default function RecordActivity() {
  const [page, setPage] = useState({ first: true, second: false, third: false, fourth: false });
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSport, setSelectedSport] = useState("Cycling");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [distance, setDistance] = useState(0);

  const timerRef = useRef(null);
  const routeRef = useRef([]); // recorded [lat,lng] points, shared with Map + Form

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div className="fixed inset-0">
      {/* Full-screen map */}
      <Map isRecording={isRecording} setDistance={setDistance} routeRef={routeRef} />

      {/* Bottom control sheet */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] flex justify-center p-4">
        <div className="pointer-events-auto w-full max-w-md">
          {page.first && (
            <Map1
              setPage={setPage}
              setIsRecording={setIsRecording}
              setSelectedSport={setSelectedSport}
              startTimer={startTimer}
            />
          )}
          {page.second && (
            <Map2
              setPage={setPage}
              pauseTimer={pauseTimer}
              setIsRecording={setIsRecording}
              distance={distance}
              timer={timer}
            />
          )}
          {page.third && (
            <Map3
              setPage={setPage}
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              setIsRecording={setIsRecording}
              distance={distance}
              timer={timer}
            />
          )}
        </div>
      </div>

      {/* Save form modal */}
      {page.fourth && (
        <div className="absolute inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16">
          <Form
            selectedSport={selectedSport}
            finalTime={timer}
            finalDistance={distance.toFixed(2)}
            route={routeRef.current}
          />
        </div>
      )}
    </div>
  );
}
