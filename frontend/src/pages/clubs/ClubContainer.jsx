import { useState } from 'react'
import Club from './Club'
import ClubHeader from './ClubHeader'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import { useQuery } from '@tanstack/react-query'


export default function ClubContainer() {
    const [hamburger, setHamburger] = useState(true)
  return (
    <>
      <Header hamburger = {hamburger} setHamburger = {setHamburger}/>
      <div className='contains-club'> 
        <ClubHeader/>
      </div>
      <Footer />
    </>
  )
}
