import aim from '../img/aim.png'
const Profile = () => {
  return (
    <div className="user-profile1">
      <div className="profile-avatar1">
        <span className="avatar-text">P</span>
      </div>
      <h2 className="profile-name">Sid B</h2>
      <div className='text' >
      <span className="location-icon">
            <img src={aim}/>
      </span>
      <p className="profile-location">
        <span>
        Malhanwada, Madhya Pradesh, India
        </span>
      </p>
      </div>
      <br />
      <div className="profile-actions">
        {/* {() ? <button className="follow-button">Follow</button> : ""} */}
      </div>
    </div>
  );
};

export default Profile;
