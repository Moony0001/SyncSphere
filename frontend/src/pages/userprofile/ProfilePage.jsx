import React, { useEffect, useRef, useState } from 'react'
import Profile from '../../components/Profile'
import Social from '../../components/Social'
import Stats from '../../components/Stats'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Post from '../../components/common/Post'
import { useParams } from 'react-router-dom'
import useFollow from '../../hooks/useFollow'
import { useQuery } from '@tanstack/react-query'
import aim from '../../img/aim.png'
import gift from '../../img/gift.png'
import userplaceholder from '../../img/user.png'

export default function ProfilePage() {

    const [hamburger, setHamburger] = useState(true);
    const [profileImg, setProfileImg] = useState(null);
    
    const profileImgRef = useRef(null);

    const { id } = useParams();

    const { follow, isPending } = useFollow();
    const { data: authUser } = useQuery({queryKey: ["authUser"]});

    const { data: user, isLoading, refetch, isRefetching } = useQuery({
      queryKey: ["userProfile"],
      queryFn: async () => {
        try {
          const res = await fetch(`/api/user/profile/${id}`);
          const data = await res.json();

          if(!res.ok) {
            throw new Error(data.error || "Failed to fetch user profile");
          }

          return data;
        } catch (error) {
          throw new Error(error);
        }
      }
    });

    const isMyProfile = authUser?._id === user?._id;
    const amIFollowing = authUser?.following.includes(user?._id);

    const handleImgChange = (e, state) => {
      const file = e.target.files[0];
      if(file) {
        const reader = new FileReader();
        reader.onload = () => { 
          state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch()
  }, [id, refetch]);


    return (
      <>
        <Header hamburger={hamburger} setHamburger={setHamburger}/>
        {(isLoading || isRefetching) && "Loading..."}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
                <div className='placeholder'>
                {!isLoading && !isRefetching && user && (
						      <>
                    <div className='f'>
                      <div className="user-profile1">
                        <div className="profile-avatar1">
                          <img src={(user?.profileImg === "") ? userplaceholder : user?.profileImg} alt="" className='avatar-img'/>
                        </div>
                        <h2 className="profile-name">{user?.firstname} {user?.lastname}</h2>
                      <br />
                      {!isMyProfile && <div className="profile-actions">
                        <button className="follow-button">Follow</button>
                      </div>}
                    </div>
                    <div className="user-stats">
                      <div className="social-stats-section">
                        <h3>Social Stats</h3>
                        <div className="social-stats">
                          <div className="stat">
                            <span className="stat-number">{user?.following.length}</span>
                            <span className="stat-label">Following</span>
                          </div>
                          <div className="stat">
                            <span className="stat-number">{user?.followers.length}</span>
                            <span className="stat-label">Followers</span>
                          </div>
                        </div>
                      </div>
                      <div className="clubs-section">
                        <h3>Clubs</h3>
                        <div className="club-logos">
                          <img src={gift} className="club-logo" />
                          <img src={gift} className="club-logo" />
                        </div>
                      </div>
                    </div>
              </div>
            </>
					)}
              <div className='s'>
                  <Post/>
              </div>
              <div className='t'>
                <Stats/>
              </div>
          </div>
        <Footer />
      </>
    )
  }
  