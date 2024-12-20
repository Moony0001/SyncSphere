import React from 'react';
import gift from '../img/gift.png'
import like from '../img/like.png'
import cycle from '../img/cycle.png'
import comment from '../img/comment.png'
import profile from '../img/profile.png'
import map from '../img/map.png'
const OnlyMap = () => {
  return (
    <div className="ride-card">
      <div className="ride-details">
      <div className='title'>
      <img src={cycle}/>
      <h2>Random ride</h2>
      </div>
        <div className="stats">
          <div className="stat">
            <p>Distance</p>
            <h3>6.44 km</h3>
          </div>
          <div className="stat">
            <p>Elev Gain</p>
            <h3>69 m</h3>
          </div>
          <div className="stat">
            <p>Time</p>
            <h3>27m 4s</h3>
          </div>
        </div>
        <img src={map} alt="Map Placeholder" className="ride-map" />
        <div className="ride-footer">
          <div className='comment'>
          <img src={profile}/>
          <p>1 kudos</p>
          </div>
          <div className="ride-actions">
            <button>
                <img src={like}/>
            </button>
            <button>
                <img src={comment}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlyMap;
