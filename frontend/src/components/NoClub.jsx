import React from 'react'
import flag from '../../public/img/flag.png'
export default function NoClub() {
  return (
    <div className='club'>
        <div className='club-container'>
         <img src={flag}/>
         <h3>Clubs on Strava</h3>
        </div>
        <p>
            Why do it alone? Get more out of your Strava 
            experience by joining or creating a club.
        </p>
        <a href="#">
            Create a Club on Strava
        </a>
    </div>
  )
}
