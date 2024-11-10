import Header from "../../components/common/Header";
import Holder from "../../components/Holder";
import Footer from "../../components/common/Footer";
import { useState } from "react";
import ClubContainer from "../clubs/ClubContainer";
import Club from "../clubs/Club";
import Profile from "../../components/Profile";
import UserProfile from "../../components/UserProfile";
import PlaceHolder from "../userprofile/ProfilePage";
import Login from "../auth/login/Login";
import SignUp from "../auth/signup/SignUp";


const HomePage = () => {
    const [hamburger,setHamburger] = useState(true);
    return (
        <>
        <Header hamburger={hamburger} setHamburger={setHamburger}/>
        <Holder/>
        <Footer/>
        </>
    );
};

export default HomePage; 