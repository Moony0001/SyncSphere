import { useState } from 'react'
import Club from './Club'
import ClubHeader from './ClubHeader'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'


export default function ClubContainer() {
    const arr = [<Club/>,<Club/>,<Club/>,<Club/>,<Club/>]
    const [hamburger, setHamburger] = useState(false)
  return (
    <>
      <Header hamburger = {hamburger} setHamburger = {setHamburger}/>
      <div className='contains-club'> 
        <ClubHeader/>
        {arr}
      </div>
      <Footer />
    </>
  )
}
