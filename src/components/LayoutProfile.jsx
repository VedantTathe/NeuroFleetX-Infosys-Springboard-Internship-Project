import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import bg from "../assets/bgimg.png";

export default function LayoutProfile() {
  return (
    <div
      className="Profile-container"
      backgroundImage={`url(${bg})`}
    >
      {/* <div className="Profile-overlay" /> */}

      <Navbar />
    
    


      {/* <main className="page-main"> */}
        <Outlet />
      {/* </main> */}
      
    </div>
  );
}
