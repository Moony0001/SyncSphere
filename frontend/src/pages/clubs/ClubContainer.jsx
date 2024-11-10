import React from 'react'
import Club from './Club'
import ClubHeader from './ClubHeader'
export default function ClubContainer() {
    const arr = [<Club/>,<Club/>,<Club/>,<Club/>,<Club/>]
  return (
    <div className='contains-club'> 
      <ClubHeader/>
      {arr}
    </div>
  )
}
