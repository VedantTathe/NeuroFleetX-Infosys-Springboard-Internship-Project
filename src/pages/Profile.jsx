import React from "react";
import { Link } from "react-router-dom";
import avatarImg from "../assets/img.png";
import AddressManager from "../components/AddressManager";
import { useState, useEffect } from "react";



// Display-only profile with dummy backend data (no inputs)
const dummyProfile = {
  avatar: avatarImg,
  role: "driver",
  firstName: "Ravi",
  lastName: "Kumar",
  gender: "male",
  dateOfBirth: "1990-06-15",
  email: "ravi.kumar@example.com",
  phone: "+91 98765 43210",
  secondaryPhone: "+91 91234 56789",
  aadhaarNumber: "1234 5678 9012",
  panNumber: "ABCDE1234F",
  drivingLicenseNumber: "DL-0420110000001",
  addressLine: "12, MG Road",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  username: "ravi.driver",
  memberSince: "2023-01-15",

  // Driver-specific
  licenseExpiry: "2028-06-30",
  vehicleType: "Diesel Van",
  vehicleModel: "Toyota Hiace",
  vehicleNumber: "KA-01-AB-1234",
  assignedRoute: "Route 12 - South Loop",

  // Fleet manager example fields (not shown for driver role)
  fleetId: "FLEET-009",
  totalVehicles: 28,
  department: "Logistics",

  // Admin fields
  employeeId: "EMP-7788",
  adminLevel: "normal",

  // Customer fields
  defaultPaymentMethod: "VISA **** 4242",
  emergencyContact: "+91 99876 54321",
};

// const [showManager, setShowManager] = useState(false);
// const [defaultAddress, setDefaultAddress] = useState(null);

// useEffect(() => {
//   const saved = JSON.parse(localStorage.getItem("addresses"));
//   if (saved && saved.length > 0) setDefaultAddress(saved[0]);
// }, []);


export default function Profile() {
  const [showManager, setShowManager] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState(null);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("addresses"));
    if (saved && saved.length > 0) setDefaultAddress(saved[0]);
  }, []);
  
  const p = dummyProfile;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-50 px-5 py-30 flex items-start justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <header className="flex items-center justify-between px-7 py-5.5 border-b border-blue-100 bg-gradient-to-r from-blue-50/60 to-white/45">
          <h1 className="text-lg text-gray-900 m-0">Profile</h1>
          <Link to="/" className="text-gray-500 no-underline px-3 py-2 rounded-lg border border-gray-200">Close</Link>
        </header>

        <div className="flex gap-7 px-7 py-7">
          <aside className="w-72 px-3 flex flex-col items-center gap-3">
            <img src={p.avatar} alt={`${p.firstName} avatar`} className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white" />
            <h2 className="text-xl text-gray-900 mt-1.5 m-0">{p.firstName} {p.lastName}</h2>
            <div className="text-slate-600 text-sm mt-1.5">{p.vehicleModel} • {p.vehicleType}</div>
            <div className="text-gray-600 text-xs mt-2">Role: <strong>{p.role}</strong></div>
            <div className="w-full mt-3 grid grid-cols-1 gap-2.5">
              <div><strong className="text-gray-700">Member since</strong><div className="text-gray-900 font-bold mt-1">{p.memberSince}</div></div>
              <div><strong className="text-gray-700">Username</strong><div className="text-gray-900 font-bold mt-1">{p.username}</div></div>
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-3.5">
            <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="m-0 mb-2 text-base text-gray-900">Contact Information</h3>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Email</span><span className="text-gray-900 font-bold">{p.email}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Phone</span><span className="text-gray-900 font-bold">{p.phone}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Secondary Phone</span><span className="text-gray-900 font-bold">{p.secondaryPhone}</span></div>
            </section>

            <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="m-0 mb-2 text-base text-gray-900">Identity / Verification</h3>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Aadhaar</span><span className="text-gray-900 font-bold">{p.aadhaarNumber}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">PAN</span><span className="text-gray-900 font-bold">{p.panNumber}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Driving License</span><span className="text-gray-900 font-bold">{p.drivingLicenseNumber}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Vehicle Number</span><span className="text-gray-900 font-bold">{p.vehicleNumber}</span></div>
            </section>

            {/* <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="m-0 mb-2 text-base text-gray-900">Address</h3>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Address</span><span className="text-gray-900 font-bold text-right">{p.addressLine}, {p.city}, {p.state} - {p.pincode}</span></div>
            </section> */}
            <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="text-base text-gray-900 mb-2">Address</h3>

              <div className="flex justify-between items-center border-t border-dashed py-2">
                <span className="text-slate-600 text-sm">Default Address</span>

                <div className="text-right">
                  <span className="font-bold text-gray-900">
                    {defaultAddress?.address ||
                      `${p.addressLine}, ${p.city}, ${p.state} - ${p.pincode}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowManager(true)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Manage Addresses
              </button>

              {/* Popup */}
              {showManager && (
                <AddressManager
                  apiKey="YOUR_GOOGLE_MAP_API_KEY"
                  onClose={() => setShowManager(false)}
                  onSelectDefault={(a) => setDefaultAddress(a)}
                />
              )}
            </section>

            <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
              <h3 className="m-0 mb-2 text-base text-gray-900">Account Info</h3>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Member Since</span><span className="text-gray-900 font-bold">{p.memberSince}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Username</span><span className="text-gray-900 font-bold">{p.username}</span></div>
              <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Role</span><span className="text-gray-900 font-bold">{p.role}</span></div>
            </section>

            {p.role === "driver" && (
              <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="m-0 mb-2 text-base text-gray-900">Driver Details</h3>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">License Expiry</span><span className="text-gray-900 font-bold">{p.licenseExpiry}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Vehicle Type</span><span className="text-gray-900 font-bold">{p.vehicleType}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Vehicle Model</span><span className="text-gray-900 font-bold">{p.vehicleModel}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Assigned Route</span><span className="text-gray-900 font-bold">{p.assignedRoute}</span></div>
              </section>
            )}

            {p.role === "fleetManager" && (
              <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="m-0 mb-2 text-base text-gray-900">Fleet Manager Details</h3>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Fleet ID</span><span className="text-gray-900 font-bold">{p.fleetId}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Total Vehicles</span><span className="text-gray-900 font-bold">{p.totalVehicles}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Department</span><span className="text-gray-900 font-bold">{p.department}</span></div>
              </section>
            )}

            {p.role === "admin" && (
              <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="m-0 mb-2 text-base text-gray-900">Admin Details</h3>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Employee ID</span><span className="text-gray-900 font-bold">{p.employeeId}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Admin Level</span><span className="text-gray-900 font-bold">{p.adminLevel}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Department</span><span className="text-gray-900 font-bold">{p.department}</span></div>
              </section>
            )}

            {p.role === "customer" && (
              <section className="bg-blue-50 px-4.5 py-4.5 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="m-0 mb-2 text-base text-gray-900">Customer Details</h3>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed first:border-t-0"><span className="text-slate-600 text-sm">Default Payment Method</span><span className="text-gray-900 font-bold">{p.defaultPaymentMethod}</span></div>
                <div className="flex justify-between py-2 border-t border-gray-300 border-dashed"><span className="text-slate-600 text-sm">Emergency Contact</span><span className="text-gray-900 font-bold">{p.emergencyContact}</span></div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

