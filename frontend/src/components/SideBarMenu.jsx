import React from 'react';
import gift from '../img/gift.png'
import SearchFilter from './SearchFilter';
const SideBarMenu = () => {
  return (
    <div className="sidebar-menu">
      <div className="menu-section">
        <ul>
          <li className="active">
          <h3>Dashboard</h3></li>
          <li><a href="#">Activity Feed</a></li>
        </ul>
        <br />
        <ul>
          <li className="active">
          <h3>Training</h3>
          </li>
          <li><a href="#">My Activity</a></li>
        </ul>
        <br />
        <ul>
          <li className="active">
          <h3>Socials</h3>
          </li>
          <li><a href="#">Find Friends</a></li>
        </ul>
        <br />
        <ul className='active'>
        </ul>
      </div>

      <div className="menu-section subscription">
        <h4>Subscription</h4>
        <ul>
          <li>Training Log</li>
          <li>Training Plans</li>
          <li>Power Curve</li>
          <li>Fitness & Freshness</li>
        </ul>
      </div>
      <div className="user-section">
        <div className="user-profile">
          <a href="#">
            User Profile
          </a>
        </div>
        <div className="logout">Logout</div>
      </div>
    </div>
  );
};

export default SideBarMenu;
