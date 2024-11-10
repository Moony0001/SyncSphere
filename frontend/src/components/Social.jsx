import React from 'react';
import gift from '../../public/img/gift.png'
const Social = () => {
  return (
    <div className="user-stats">
      <div className="clubs-section">
        <h3>Clubs</h3>
        <div className="club-logos">
          <img src={gift} className="club-logo" />
          <img src={gift} className="club-logo" />
        </div>
      </div>
      <div className="social-stats-section">
        <h3>Social Stats</h3>
        <div className="social-stats">
          <div className="stat">
            <span className="stat-number">2</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat">
            <span className="stat-number">2</span>
            <span className="stat-label">Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Social;
