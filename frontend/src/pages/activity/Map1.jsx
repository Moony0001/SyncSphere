import React from 'react'
import Map from '../../components/common/Map'
import shoe from '../../img/shoe.png'
import sneakers from '../../img/sneakers.png'
import cycle from '../../img/cycle.png'
export default function Map1({setPage,page,setIsRecording,setSelectedSport}) {

  const handleSportSelection = (sport) => {
    setSelectedSport(sport); // Update selected sport in parent state
  };
  
  return (
    <>
      <div className='bottom-section'>
      <div className='below-map'>
          <div className='one' onClick={() => handleSportSelection('Cycling')}>
          <img src={cycle}/>
          </div>
          <div className='two' onClick={() => handleSportSelection('Running')}>
          <img src={shoe}/>
          </div>
          <div className='three' onClick={() => handleSportSelection('Walking')}>
          <img src={sneakers}/>
          </div>
      </div>
      <div className='bottom-container'>
          <div className='start-button' onClick={() => {
            setIsRecording(true);
            setPage((prev) => ({ ...prev, first: false , second: true}))
          }}
        >
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
