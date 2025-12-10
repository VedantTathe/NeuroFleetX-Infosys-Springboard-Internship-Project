import { Link } from "react-router-dom";
import { useState } from "react";
import avatar from "../assets/img.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-120px)] max-w-5xl px-5 py-3 rounded-2xl bg-gradient-to-b from-black/20 to-white/5 backdrop-blur-lg border border-white/10 shadow-2xl z-50 flex justify-between items-center" aria-expanded={open}>
      <h2 className="text-3xl font-bold text-white">NeuroFleetX</h2>

      <button
        className="flex md:hidden bg-transparent border-none w-10 h-8 flex-col justify-between cursor-pointer"
        aria-label="Toggle menu"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <span className={`block h-1 bg-white rounded transition-transform duration-200 ${open ? "translate-y-3 rotate-45" : ""}`} />
        <span className={`block h-1 bg-white rounded transition-opacity duration-150 ${open ? "opacity-0" : ""}`} />
        <span className={`block h-1 bg-white rounded transition-transform duration-200 ${open ? "-translate-y-3 -rotate-45" : ""}`} />
      </button>

      <div className={`${open ? "flex" : "hidden md:flex"} gap-3 items-center`} onClick={() => setOpen(false)}>
        <Link className="ml-4 px-4 py-2 border border-white/20 rounded-lg text-white no-underline transition-all duration-180 font-semibold hover:bg-white/95 hover:text-black" to="/">Home</Link>
        <Link className="ml-4 px-4 py-2 border border-white/20 rounded-lg text-white no-underline transition-all duration-180 font-semibold hover:bg-white/95 hover:text-black" to="/signin">Sign In</Link>
        <Link className="ml-4 px-4 py-2 border border-white/20 rounded-lg text-white no-underline transition-all duration-180 font-semibold hover:bg-white/95 hover:text-black" to="/signup">Sign Up</Link>
        <Link className="ml-4 px-4 py-2 border border-white/20 rounded-lg text-white no-underline transition-all duration-180 font-semibold hover:bg-white/95 hover:text-black" to="/profile" aria-label="Open profile">
          <img src={avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
        </Link>
      </div>
    </nav>
  );
}
