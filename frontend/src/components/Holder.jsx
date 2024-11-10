import React from 'react'
import UserProfile from './UserProfile'
import Middle from './Middle'
import NoClub from './NoClub'
import Friends from './Friends'

export default function Holder({hamburger,setHamburger}) {
  return (
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
  )
}
