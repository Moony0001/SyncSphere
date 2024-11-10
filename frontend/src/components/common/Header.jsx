import React, { useState } from "react";
import arrow from '../../img/arrow.png'
import glass from '../../img/loupe.png'
import gift from '../../img/gift.png'
import bell from '../../img/bell.png'
import user from '../../img/user.png'
import more from '../../img/more.png'
import cross from '../../img/cross.png'
import SearchFilter from "../SearchFilter";
import SideBarMenu from "../SideBarMenu";
import { useQueryClient } from "@tanstack/react-query";


export default function Header({hamburger,setHamburger}) {
  
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [showTrainingDropdown, setShowTrainingDropdown] = useState(false);
  const [clicked , setClicked] = useState(false)
  const [profile,setProfile] = useState(false);
  const authUser = useQueryClient().getQueryData("authUser");

  return (
    <>
    <nav className="navbar">
      {/* Left section with logo, search, and dropdowns */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <span className="logo-text" style={{color: '#1177FF'}}>SyncSphere</span>
        </div>

        <div className="navbar-search">
          <span className="icon magnifying-glass" onClick={()=>{setClicked(!clicked)}}>
            {clicked ? "":
            <img src={glass}/>}
          </span>
          <span className="icon magnifying-glass"  onClick={()=>{setClicked(!clicked)}}>
            {!clicked ? "":
            <img src={cross} id='cross'/>}
          </span>
        </div>
        { clicked ? <SearchFilter/> :
         (     
         <> 
         <div 
          className="menu-item"
          onMouseEnter={() => setShowDashboardDropdown(true)}
          onMouseLeave={() => setShowDashboardDropdown(false)}
        >
          Dashboard 
          <span>
            <img src={arrow}/>
          </span>
          {showDashboardDropdown && (
            <div className="dropdown dropdown-wide">
              <a href="#" className="dropdown-item">My Activities</a>
              <a href="#" className="dropdown-item">Friends' Activities</a>
              <a href="#" className="dropdown-item">Stats</a>
            </div>
          )}
        </div>

        <div 
          className="menu-item"
          onMouseEnter={() => setShowTrainingDropdown(true)}
          onMouseLeave={() => setShowTrainingDropdown(false)}
        >
          Training 
          <span>
            <img src={arrow}/>
          </span>
          {showTrainingDropdown && (
            <div className="dropdown dropdown-wide">
              <a href="#" className="dropdown-item">Training Plans</a>
              <a href="#" className="dropdown-item">My Workouts</a>
              <a href="#" className="dropdown-item">Goals</a>
            </div>
          )}
        </div> 
        </> ) }
      </div>

      {/* Right section with action buttons */}
      {authUser ? <div className="navbar-right">
        <button className="gift-button">
        <img src={gift}/>
        <p>Give a Gift</p>
        
        
        </button>
        <button className="trial-button">Start Trial</button>
        
        
        <div 
          className="menu-item"
          onMouseEnter={() => setProfile(true)}
          onMouseLeave={() => setProfile(false)}
        >
        <span className="icon profile-icon">
            <img src={user}/>
        </span>
          {profile && (
            <div className="dropdown dropdown-wide">
              <a href="#" className="dropdown-item">My Profile</a>
              <a href="#" className="dropdown-item">My friends</a>
               <a href="#" className="dropdown-item">
                 <b>Log Out</b>
              </a> 
            </div>
          )}
        </div>
        <span className="icon">
            <img src={bell}/>
        </span>
      </div> 
      : 
      <button type="submit" className="signup-button">
          Log In
      </button>
      }
      <img src={more} className="hamburger" onClick={()=>setHamburger(!hamburger)}/>
      {!hamburger?<SideBarMenu/>:""}
    </nav>
    </>
  );
}
