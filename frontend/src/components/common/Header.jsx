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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useLocation, Link } from 'react-router-dom';


export default function Header({hamburger,setHamburger}) {
  
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);
  const [showTrainingDropdown, setShowTrainingDropdown] = useState(false);
  const [clicked , setClicked] = useState(false)
  const [profile,setProfile] = useState(false);
  const queryClient = useQueryClient();

  const{mutate: Logout} = useMutation({
    mutationFn: async () =>{
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST"
        })

        const data = await res.json();

        if(!res.ok){throw new Error(data.error || "Failed to Logout")}
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: () => {
      toast.error("Failed to logout")
    }
  });

  const {data: authUser} = useQuery({queryKey: ["authUser"]});
  const location = useLocation();

  return (
    <>
    <header>
      <nav className="navbar">
        {/* Left section with logo, search, and dropdowns */}
        <div className="navbar-left">
          <Link to={"/"}>
          <div className="navbar-logo">
            <span className="logo-text" style={{color: '#1177FF'}}>SyncSphere</span>
          </div>
          </Link>

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
                <a href="/" className="dropdown-item">My Activities</a>
                <a href="#" className="dropdown-item">Friend's Activities</a>
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
        {authUser ? 
        <div>
          <div className="navbar-right">          
            <div 
              className="menu-item"
              onMouseEnter={() => setProfile(true)}
              onClick={() => setProfile(false)}
            >
            <span className="icon profile-icon">
                <img src={user}/>
            </span>
              {profile && (
                <div className="dropdown dropdown-wide">
                  <a href="#" className="dropdown-item">My Profile</a>
                  <a href="#" className="dropdown-item">My friends</a>
                  <a href="#" onClick= {(e) => {
                    e.preventDefault();
                    Logout();
                  }}
                  className="dropdown-item">
                    <b>Log Out</b>
                  </a> 
                </div>
              )}
            </div>
            <span className="icon">
                <img src={bell}/>
            </span>
          </div></div>
          : 
          (<Link 
            to={location.pathname === "/login" ? "/signup" : "/login"}
            className="signup-button"
          >
            {location.pathname === "/login" ? "Sign Up" : "Log In"}
          </Link>)
        }
        <img src={more} className="hamburger" onClick={()=>setHamburger(!hamburger)}/>
        {!hamburger?<SideBarMenu/>:""}
      </nav>
    </header>
    </>
  );
}
