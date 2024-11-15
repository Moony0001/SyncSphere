import React from 'react'
import Map from '../../components/common/Map'
export default function Map2({setPage,page}){
  return (
    <>
<div class="footer-section">
    <div class="content-above">
        <div class="timer-display">
            00:00:00
        </div>
    </div>
    <div class="action-container">
        <div class="launch-button">
            <div id='dis'>0.00 km</div>
            <div id='speed'>7.0 km/hr</div>
        </div>
        <button onClick={() => setPage((prev) => ({ ...prev, second: false , third: true}))}>
            PAUSE
        </button>
    </div>
</div>

    </>
  )
}
