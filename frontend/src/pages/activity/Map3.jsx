import React from 'react'
import Map from '../../components/common/Map'
export default function Map3({setPage, page, timer, startTimer, pauseTimer, setIsRecording, distance}){
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
        <div className='trigger' >
        <button id='resume' onClick={() => {
            setIsRecording(true);
            startTimer();
            setPage((prev) => ({ ...prev, third: false , second: true}))}}>
            RESUME
        </button>
        <button id='finish' onClick={() => {
            setIsRecording(false);
            pauseTimer();
            setPage((prev) => ({ ...prev, fourth: true }))}}>
            FINISH
        </button>
        </div>
        
    </div>
</div>
    </>
  )
}
