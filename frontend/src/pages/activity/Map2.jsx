import React from 'react'
import Map from '../../components/common/Map'
export default function Map2({setPage, timer, pauseTimer}){
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
                    <div id='dis'>0.00 km</div>
                    <div id='speed'>7.0 km/hr</div>
                </div>
                <button onClick={() => {
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
