import React from 'react'
import Map from '../../components/common/Map'
export default function Map2({setPage, page, startTimer, timer, pauseTimer, setIsRecording, distance, setDistance}){
const formattedTime = new Date(timer * 1000).toISOString().slice(11, 19); // Format in HH:mm:ss
  return (
    <>
        <div className="footer-section">
            <div className="content-above">
                <div className="timer-display">
                    {formattedTime}
                </div>
            </div>
            <div className="action-container">
                <div className="launch-button">
                    <div id="dis">{(distance || 0).toFixed(2)} km</div>
                    <div id='speed'>7.0 km/hr</div>
                </div>
                <button onClick={() => {
                    setIsRecording(false);
                    pauseTimer();
                    setPage((prev) => ({ ...prev, second: false , third: true}))
                }}>
                    PAUSE
                </button>
            </div>
        </div>

    </>
  )
}
