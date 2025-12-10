import { useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = () => {
    const data = JSON.parse(localStorage.getItem("userData"));

    if (!data) {
      alert("No registered user found!");
      return;
    }

    if (email === data.email && password === data.password) {
      alert("Signin Successful!");
      window.location.href = "/";  // Redirect
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="max-h-screen flex justify-center items-center relative">
      <div className="w-96 bg-white px-9 py-9 rounded-3xl relative z-10 shadow-2xl border border-gray-200">
        <h1 className="text-center text-indigo-900 mb-1 text-xl font-bold">NeuroFleetX</h1>
        <h2 className="text-center mb-4 text-gray-800 text-lg font-semibold">Sign In</h2>

        <label className="text-gray-700 font-medium text-sm">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="text-gray-700 font-medium text-sm mt-2.5 block">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button onClick={handleSignin} className="w-full py-3 bg-indigo-900 text-white rounded-3xl border-none cursor-pointer text-base font-bold mt-5 hover:bg-indigo-800 transition-colors duration-200">Sign In</button>

        <p className="text-center mt-3 text-gray-600 text-sm">
          Don't have an account?
          <a href="/signup" className="text-indigo-900 font-bold no-underline"> Register Now</a>
        </p>
      </div>
    </div>
  );
}
