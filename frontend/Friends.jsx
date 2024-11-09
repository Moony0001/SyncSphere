import React from 'react'
import shield from './security.png'
export default function Friends() {
  return (
    <div className='club'>
        <div className='club-container'>
         <img src={shield}/>
         <h3>Your Friends On Strava</h3>
        </div>
        <p>
            Find and invite friends to see their 
            adventures and share some encouragement.
        </p>
        <a href="#">
            Find and invite Your Friends
        </a>
    </div>
  )
}
