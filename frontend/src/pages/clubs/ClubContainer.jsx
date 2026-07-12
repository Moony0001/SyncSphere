import { useState } from "react";
import ClubHeader from "./ClubHeader";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

export default function ClubContainer() {
  const [hamburger, setHamburger] = useState(true);
  return (
    <div className="flex min-h-screen flex-col">
      <Header hamburger={hamburger} setHamburger={setHamburger} />
      <main className="flex-1">
        <ClubHeader />
      </main>
      <Footer />
    </div>
  );
}
