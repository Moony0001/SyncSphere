import React from "react";
import gift from '../../../public/img/gift.png';
function Club() {
  return (
    <div className="club-card1">
      <div className="club-info">
        <div className="club-image">
          <img src={gift} alt="Club Icon" />
        </div>
        <div className="club-details">
          <p className="club-name">KothrudRunners</p>
          <p className="club-location">Pune, Maharashtra, India</p>
          <button className="join-button">Join</button>
          <span className="first">521 members</span>
          <span className="second">Running</span>
          <span className="third">Club</span>
        </div>
      </div>
      <div className="club-actions">
        
        <div className="club-stats">
          <span>521 members</span>
          <span>Running</span>
          <span>Club</span>
        </div>
      </div>
    </div>
  );
}

export default Club;
