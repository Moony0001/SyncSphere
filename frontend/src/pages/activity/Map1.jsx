import React from 'react'
import Map from '../../components/common/Map'
import shoe from '../src/img/shoe.png'
import sneakers from '../src/img/sneakers.png'
import cycle from '../src/img/cycle.png'
export default function Map1({setPage,page}){
  return (
    <>
      <div className='bottom-section'>
      <div className='below-map'>
          <div className='one'>
          <img src={cycle}/>
          </div>
          <div className='two'>
          <img src={shoe}/>
          </div>
          <div className='three'>
          <img src={sneakers}/>
          </div>
      </div>
      <div className='bottom-container'>
          <div className='start-button' onClick={() => setPage((prev) => ({ ...prev, first: false , second: true}))}>
           START
          </div>
          <div className='start-tagline'>
          <br />
          <div id='btm'>
          Adventure awaits — start your journey now!
          </div>
          </div>
      </div>
      
      </div>
      
    </>
  )
}
