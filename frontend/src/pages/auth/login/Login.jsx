import React from 'react'
import left from '../../../img/left.png'
import right from '../../../img/right.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../../../components/common/Header';
import Footer from '../../../components/common/Footer';


export default function Login() {
      const [hamburger,setHamburger] = useState(true);

      const [formData, setFormData] = useState({
        email: '',
        password: '',
      });

      const queryClient = useQueryClient();

      const {mutate: loginMutation, isError, isPending, error } = useMutation({
        mutationFn: async ({email, password}) => {
          try {
            const res = await fetch ("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({email, password}),
            });
            const data = await res.json();
            if(!res.ok) {
              throw new Error(data.error || "Failed to login");
            }
            console.log(data);
            return data;
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        onSuccess: () => {
          // Handle success here
          queryClient.invalidateQueries({queryKey: ["authUser"]});
        }
      })
    
      const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
      };

      const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

  return (
  <>
  <Header hamburger={hamburger} setHamburger={setHamburger}/>
  <div className='wrapper'>
  <div className='login-box'>
    <div className='left'>
    <img src={left}/>
    </div>
    <div className="signup-card">
      <h2 style={{color: '#C8C1C1'}}>Community-Powered Motivation</h2>
      <p>
        Not a member yet? <Link to="/signup" style={{color: 'orange'}}>Sign Up</Link>
      </p>
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
        <br />
        <button type="submit" className="signup-button">
          {isPending ? "Loading..." : "Log In"}
        </button>
        {isError && <p className='text-red-500'>{error.message}</p>}
      </form>
    </div>
    <div className='right'>
    <img src={right}/>
    </div>
    </div>
  </div>
  <Footer />
  </>
    
  )
}
