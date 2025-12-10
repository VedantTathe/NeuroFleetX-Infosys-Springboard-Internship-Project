import { useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSignup = () => {
    if (!role || !gender || !mobile || !email || !password || !confirmPass) {
      alert("Please fill all details");
      return;
    }

    if (mobile.length !== 10) {
      alert("Mobile number must be exactly 10 digits");
      return;
    }

    if (password !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    const user = { role, gender, mobile, email, password };
    localStorage.setItem("userData", JSON.stringify(user));

    alert("Signup Successful!");
    window.location.href = "/signin";
  };

  return (
    <div className="max-h-screen flex justify-center items-center relative">
      <div className="w-96 bg-white px-9 py-9 rounded-3xl relative z-10 shadow-2xl border border-gray-200 max-h-screen overflow-y-auto">
        <h1 className="text-center text-indigo-900 mb-1 text-xl font-bold">NeuroFleetX</h1>
        <h2 className="text-center mb-4 text-gray-800 text-lg font-semibold">Signup Here</h2>

        <label className="text-gray-700 font-medium text-sm">Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200">
          <option value="">-- Select Role --</option>
          <option value="Admin">Admin</option>
          <option value="Fleet Manager">Fleet Manager</option>
          <option value="Driver">Driver</option>
          <option value="Customer">Customer</option>
        </select>

        <label className="text-gray-700 font-medium text-sm mt-3 block">Gender</label>
        <div className="flex gap-3 mt-1.5">
          {["Male", "Female", "Other"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                value={g}
                checked={gender === g}
                onChange={() => setGender(g)}
                className="cursor-pointer"
              />
              {g}
            </label>
          ))}
        </div>

        <label className="text-gray-700 font-medium text-sm mt-3 block">Mobile</label>
        <input
          type="text"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => {
            if (/^\d{0,10}$/.test(e.target.value)) setMobile(e.target.value);
          }}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="text-gray-700 font-medium text-sm mt-3 block">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="text-gray-700 font-medium text-sm mt-3 block">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <label className="text-gray-700 font-medium text-sm mt-3 block">Confirm Password</label>
        <input
          type="password"
          placeholder="Re-enter Password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          className="w-full px-3 py-3 rounded-2xl border border-gray-300 mt-1.5 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />

        <button onClick={handleSignup} className="w-full py-3 bg-indigo-900 text-white rounded-3xl border-none cursor-pointer text-base font-bold mt-5 hover:bg-indigo-800 transition-colors duration-200">Signup</button>

        <p className="text-center mt-3 text-gray-600 text-sm">
          Already have an account?
          <a href="/signin" className="text-indigo-900 font-bold no-underline"> Login</a>
        </p>
      </div>
    </div>
  );
}
