import React from 'react'
import left from '../../../img/left.png'
import right from '../../../img/right.png'
import google from '../../../img/google.png'
import { useState } from 'react';
export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
      };
  return (
  <>
  <div className='wrapper'>
  <div className='login-box'>
    <div className='left'>
    <img src={left}/>
    </div>
    <div className="signup-card">
      <h2>Community-Powered Motivation</h2>
      <p>
        Track your progress and cheer each other on. Join over 100 million
        active people on Strava for free.
      </p>
      <br />
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit" className="signup-button">
          Log In
        </button>
      </form>
      <p className="terms">
        By signing up for Strava, you agree to the{' '}
        <a href="#">Terms of Service</a>. View our <a href="#">Privacy Policy</a>.
      </p>
    </div>
    <div className='right'>
    <img src={right}/>
    </div>
    </div>
  </div>

  </>
    
  )
}
