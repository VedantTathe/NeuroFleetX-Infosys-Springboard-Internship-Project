import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="w-full max-w-4xl text-center text-white">
      <div className="relative z-10 text-center">
        <h1 className="text-[52px] font-bold text-white text-shado">Welcome to NeuroFleetX</h1>
        <p className="mt-3 text-xl text-white drop-shadow drop-shadow-md">Smart fleet automation & real-time tracking platform</p>

        <Link to="/signup">
          <button className="mt-6 px-8 py-3 bg-white rounded-xl border-none cursor-pointer text-indigo-900 text-lg transition-colors duration-300 hover:bg-gray-200">Get Started</button>
        </Link>
      </div>
    </section>
  );
}
