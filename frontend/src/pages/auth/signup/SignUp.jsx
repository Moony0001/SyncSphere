import { Link } from 'react-router-dom'
import { useState } from 'react';

import { useMutation, useQuery } from "@tanstack/react-query";
import React from 'react'
import left from '../../../img/left.png'
import right from '../../../img/right.png'
import google from '../../../img/google.png'
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';
import { toast } from 'react-hot-toast';


export default function SignUp() {
    
    const [hamburger,setHamburger] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        gender: '',
      });

      const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async({email, password, firstname, lastname, gender}) => {
          try {
            const res = await fetch("/api/auth/signup",{
              method: "POST",
              headers: {
                "Content-Type": "application/json" ,
              },
              body: JSON.stringify({email, password, firstname, lastname, gender}),
            })

            const data = await res.json();
            if(!res.ok) {
              throw new Error(data.error || "Failed to Create Account");
            };
            console.log(data);
            return data;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        onSuccess: () => {
          // Handle success here
          toast.success("Account created successfully");
        }
      });
    
      const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
      };
      
      const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleGoogleSignUp = () => {
        window.location.href = "/api/auth/googleauth";
      };

      return (
        <>
        <Header hamburger={hamburger} setHamburger={setHamburger}/>
        <div className='login-box'>
        <div className='left'>
        <img src={left}/>
        </div>
        <div className="signup-card">
          <h2>Community-Powered Motivation</h2>
          <p>
            Already a Member? <Link to="/login" style={{color: 'orange'}}>Log In</Link>
          </p>
          <button className="google-signup-button" onClick={handleGoogleSignUp}>
          <img src={google} alt="Google Icon" className="icon1" />
          <div>
          Sign Up With Google
          </div>
          </button>
          <br />
          <br />
          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              autoComplete='off'
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              autoComplete='off'
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <input
              autoComplete='off'
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              autoComplete='off'
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="signup-button">
              {isPending ? "Loading..." : "Sign Up"}
            </button>
            {isError && <p className="text-red-500">{error.message}</p>}
          </form>
        </div>
        <div className='right'>
        <img src={right}/>
        </div>
        </div>
        <Footer />
        </>
      )
}
