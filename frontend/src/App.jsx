//React imports
import { useState } from 'react'

//Component imports
import './App.css'
import HomePage from './pages/home/HomePage'
import Login from './pages/auth/login/Login'
import SignUp from './pages/auth/signup/SignUp'
import ProfilePage from './pages/userprofile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'
import { Navigate, Route, Routes } from 'react-router-dom'
import ClubContainer from './pages/clubs/ClubContainer'
import Map from './components/common/Map'

function App() {
  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async() => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) {
          return null;
        }
        if(!res.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }
        console.log("authUser is here: ", data);
        return data;
        
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if(isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  return (
     <>
     <Routes>
      <Route path='/' element={authUser ? <HomePage/> : <Navigate to ="/login" />}/>
      <Route path='/login' element={!authUser ? <Login/> : <Navigate to ="/" />}/>
      <Route path='/signup' element={!authUser ? <SignUp/> : <Navigate to ="/" />}/>
      <Route path='/profile/:id' element={authUser ? <ProfilePage/> : <Navigate to ="/login" />}/>
      <Route path='/clubs' element={authUser ? <ClubContainer/> : <Navigate to ="/login" />}/>
     </Routes>
     {/* <HomePage/> */}
     <Toaster/>
     {/* <Map/> */}
     </>
  )
}

export default App
