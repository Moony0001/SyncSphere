import * as React from "react"
import { ChevronRight } from "lucide-react" // Using lucide for the icon
import userplaceholder from '../img/user.png'
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const {data: authUser} = useQuery({queryKey: ["authUser"]});
  
  return (
    <div className="profile-card">
      {/* Avatar Section */}
      <Link to = {`/profile/${authUser?._id}`}>
        <div className="avatar-section">
          <div className="avatar">
            <img src={userplaceholder} className= "avatar-img" alt="User Profile" />
          </div>
          <h2 className="name">{authUser?.firstname} {authUser?.lastname}</h2>
        </div>
      </Link>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stat-item">
          <p className="stat-label">Following</p>
          <p className="stat-value">{authUser?.following.length}</p>
        </div>
        <div className="stat-item stat-divider">
          <p className="stat-label">Followers</p>
          <p className="stat-value">{authUser?.followers.length}</p>
        </div>
        <div className="stat-item">
          <p className="stat-label">Activities</p>
          <p className="stat-value">{authUser?.activities.length}</p>
        </div>
      </div>
    </div>
  )
}
