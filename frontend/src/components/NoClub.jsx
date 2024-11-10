import React from 'react'
import flag from '../img/flag.png'
export default function NoClub() {
  return (
    <div className='club'>
        <div className='club-container'>
         <img src={flag}/>
         <h3>Join Clubs!</h3>
        </div>
        <p>
            Why do it alone? Join or Create a Club!
        </p>
        <a href="#">
            Create a Club
        </a>
    </div>
  )
}
