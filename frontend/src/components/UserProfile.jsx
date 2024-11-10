import * as React from "react"
import { ChevronRight } from "lucide-react" // Using lucide for the icon
import userplaceholder from '../img/user.png'

export default function UserProfile() {
  return (
    <div className="profile-card">
      {/* Avatar Section */}
      <div className="avatar-section">
        <div className="avatar">
          <img src={userplaceholder} className= "avatar-img" alt="User Profile" />
        </div>
        <h2 className="name">Bhuvesh Raina</h2>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-item">
          <p className="stat-label">Following</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-item stat-divider">
          <p className="stat-label">Followers</p>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Activities</p>
          <p className="stat-value">0</p>
        </div>
      </div>
    </div>
  )
}
