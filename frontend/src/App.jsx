import UserProfile from './components/UserProfile'
import Header from '../src/components/common/Header'
import Middle from './components/Middle'
import './App.css'
import NoClub from './components/NoClub'
import Friends from './components/Friends'
import Holder from './components/Holder'
import Footer from '../src/components/common/Footer'
import SearchFilter from './components/SearchFilter'
import SideBarMenu from './components/SideBarMenu'
import ClubHeader from '../src/pages/clubs/ClubHeader'
import Club from '../src/pages/clubs/Club'
import ClubContainer from '../src/pages/clubs/ClubContainer'
import Profile from './components/Profile'
import { useState } from 'react'
import Stats from './components/Stats'
import Social from './components/Social'
import Map from './components/Map'
function App() {
  const [hamburger,setHamburger] = useState(true);
  return (
     <>
     {/* <Header hamburger={hamburger} setHamburger={setHamburger}/> */}
     <Map/>
     </>
  )
}

export default App
