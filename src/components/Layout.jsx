import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import bg from "../assets/bgimg.png";

export default function Layout() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/48 to-black/28 pointer-events-none z-10" />

      <Navbar />

      <main className="relative z-20 min-h-screen flex items-center justify-center pt-44 pb-10 px-5">
        <Outlet />
      </main>
    </div>
  );
}
