import React from 'react';
import shoe from '../../public/img/shoe.png'
import cycle from '../../public/img/cycle.png'
import fashion from '../../public/img/fashion.png'
const Stats = () => {
  return (
    <div className="comparison-table">
      <h2>Side by Side Comparison</h2>
      <div className="profile-row">
        <div className="icons-row">
        <div id='a'>
        <img src={shoe} alt="Bike" className="activity-icon" />
        </div>
        <div id='b'>
        <img src={cycle} alt="Run" className="activity-icon" />
        </div>
        <div id='c'>
        <img src={fashion} alt="Run" className="activity-icon" />
        </div>
        </div>
        <div className="profile-avatar">
            P
        </div>
      </div>
      <table>
        <tbody>
          <tr>
            <th colSpan="3">Last 4 Weeks</th>
          </tr>
          <tr>
            <td>Activities / Week</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Avg Distance / Week</td>
            <td>0 km</td>
            <td>0 km</td>
          </tr>
          <tr>
            <td>Elev Gain / Week</td>
            <td>0 m</td>
            <td>0 m</td>
          </tr>
          <tr>
            <td>Avg Time / Week</td>
            <td>0h 0m</td>
            <td>0h 0m</td>
          </tr>

          <tr>
            <th colSpan="3">Best Efforts</th>
          </tr>
          <tr>
            <td>Longest Ride</td>
            <td>26.6 km</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Biggest Climb</td>
            <td>13 m</td>
            <td>-</td>
          </tr>
          <tr>
            <td>Elevation Gain</td>
            <td>290 m</td>
            <td>-</td>
          </tr>
          <tr>
            <td>5 mile</td>
            <td>25:17</td>
            <td>-</td>
          </tr>
          <tr>
            <td>10K</td>
            <td>32:06</td>
            <td>-</td>
          </tr>
          <tr>
            <td>10 mile</td>
            <td>58:53</td>
            <td>-</td>
          </tr>
          <tr>
            <td>20K</td>
            <td>1:20:40</td>
            <td>-</td>
          </tr>

          <tr>
            <th colSpan="3">2024</th>
          </tr>
          <tr>
            <td>Activities</td>
            <td>1</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Distance</td>
            <td>6.4 km</td>
            <td>0 km</td>
          </tr>
          <tr>
            <td>Elev Gain</td>
            <td>69 m</td>
            <td>0 m</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>27m 4s</td>
            <td>0h 0m</td>
          </tr>

          <tr>
            <th colSpan="3">All-Time</th>
          </tr>
          <tr>
            <td>Activities</td>
            <td>16</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Distance</td>
            <td>163.0 km</td>
            <td>0 km</td>
          </tr>
          <tr>
            <td>Elev Gain</td>
            <td>1,709 m</td>
            <td>0 m</td>
          </tr>
          <tr>
            <td>Time</td>
            <td>11h 2m</td>
            <td>0h 0m</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Stats;
