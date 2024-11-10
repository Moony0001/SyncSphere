import React from 'react'
import Profile from './Profile'
import Social from './Social'
import Stats from './Stats'
import Map from './Map'
import OnlyMap from './OnlyMap'
export default function PlaceHolder() {
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
  