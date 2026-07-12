import Header from "../../components/common/Header";
import Holder from "../../components/Holder";
import Footer from "../../components/common/Footer";
import { useState } from "react";

const HomePage = () => {
  const [hamburger, setHamburger] = useState(true);
  return (
    <div className="flex min-h-screen flex-col">
      <Header hamburger={hamburger} setHamburger={setHamburger} />
      <main className="flex-1">
        <Holder hamburger={hamburger} setHamburger={setHamburger} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
