import React from 'react'
import Map from '../src/components/common/Map'
export default function Map3({setPage,page}){
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
        <div className='trigger' >
        <button id='resume' onClick={() => setPage((prev) => ({ ...prev, third: false , second: true}))}>
            RESUME
        </button>
        <button id='finish' onClick={() => setPage((prev) => ({ ...prev, fourth: true }))}>
            FINISH
        </button>
        </div>
        
    </div>
</div>
    </>
  )
}
