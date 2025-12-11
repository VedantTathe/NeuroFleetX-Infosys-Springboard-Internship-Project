import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import bg from "../assets/bgimg.png";

export default function LayoutProfile() {
  return (
    <div
      className="min-h-screen w-full"
    >
      <Navbar />

      {/* Page Content */}
      <div className="pt-2">
        <Outlet />
      </div>
    </div>
  );
}
