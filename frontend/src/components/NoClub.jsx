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
            Why do it alone? <br />
            <a href='/clubs'> Join </a> or <a href='#'> Create a Club </a>!
        </p>
    </div>
  )
}
