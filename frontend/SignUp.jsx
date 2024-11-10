import React from 'react'
import left from './left.png'
import right from './right.png'
import google from './google.png'
import { useState } from 'react';
export default function SignUp() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
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
      <button className="google-signup-button">
      <img src={google} alt="Google Icon" className="icon1" />
      <div>
      Sign Up With Google
      </div>
      </button>
      <br />
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
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="signup-button">
          Sign Up
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
  )
}
