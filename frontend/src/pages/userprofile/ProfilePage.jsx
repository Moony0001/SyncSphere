import React from 'react'
import Profile from '../../components/Profile'
import Social from '../../components/Social'
import Stats from '../../components/Stats'
import Map from '../../components/common/Post'
import OnlyMap from '../../components/OnlyMap'

export default function ProfilePage() {
    return (
      <div className='placeholder'>
          <div className='f'>
              <Profile/>
              <Social/>
          </div>
          <div className='s'>
             <div className='above-map'>
              <Profile/>
              <Social/>
             </div>
              <Map/>
              <OnlyMap/>
          </div>
          <div className='t'>
             <Stats/>
          </div>
      </div>
    )
  }
  