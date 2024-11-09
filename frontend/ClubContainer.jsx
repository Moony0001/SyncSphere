import React from 'react'
import Club from './club'
import ClubHeader from './ClubHeader'
export default function ClubContainer() {
    const arr = [<Club/>]
  return (
    <div className='contains-club'> 
      <ClubHeader/>
      {arr}
    </div>
  )
}
