import React from 'react'
import UserProfile from './UserProfile'
import Middle from './Middle'
import NoClub from './NoClub'
import Friends from './Friends'

export default function Holder({hamburger,setHamburger}) {
  return (
    <div style={{boxSizing: "border-box"}} id='top-holder'>
      <div className='holder' onClick={()=>setHamburger(true)}>
          <div className='tc1'>
              <UserProfile/>
              <NoClub/>
          </div>
          <div className='tc2'>
              <Middle/>
          </div>
          <div className='tc3'>
              <NoClub/>
              <Friends/>
          </div>
      </div>
    </div>
  )
}
