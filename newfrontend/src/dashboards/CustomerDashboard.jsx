import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, FaRoute, FaLeaf, FaCalendarCheck, FaDollarSign, FaClock, FaHeart, FaTag, FaPlus, FaTachometerAlt
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- SUB-COMPONENT: METRICS ---
const DashboardHome = () => {
  // Mock Metrics Data
  const displayMetrics = {
    activeBookings: 1, totalTrips: 47, totalSpent: 892.50, amountSaved: 67.80,
    upcomingTrips: 2, favoriteRoutes: 3, co2Saved: 12.5
  };
  
  const chartData = [
    { day: 'Mon', trips: 2 }, { day: 'Tue', trips: 1 }, { day: 'Wed', trips: 3 },
    { day: 'Thu', trips: 0 }, { day: 'Fri', trips: 2 }, { day: 'Sat', trips: 1 }, { day: 'Sun', trips: 2 }
  ];

  const MetricCard = ({ icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 text-xl`}>{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
       {/* Metrics Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
         <MetricCard icon={<FaCalendarCheck />} title="Active Bookings" value={displayMetrics.activeBookings} subtitle="Currently active" color="blue" />
         <MetricCard icon={<FaRoute />} title="Total Trips" value={displayMetrics.totalTrips} subtitle="All-time rides" color="purple" />
         <MetricCard icon={<FaDollarSign />} title="Total Spent" value={`$${displayMetrics.totalSpent}`} subtitle="Lifetime spending" color="green" />
         <MetricCard icon={<FaTag />} title="Amount Saved" value={`$${displayMetrics.amountSaved}`} subtitle="Through offers" color="orange" />
         <MetricCard icon={<FaClock />} title="Upcoming Trips" value={displayMetrics.upcomingTrips} subtitle="Scheduled rides" color="yellow" />
         <MetricCard icon={<FaLeaf />} title="CO2 Saved" value={`${displayMetrics.co2Saved} kg`} subtitle="Eco Impact" color="green" />
       </div>

       {/* Chart Section */}
       <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
             <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trips" stroke="#3B82F6" strokeWidth={2} />
             </LineChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};

// --- MAIN DASHBOARD WRAPPER ---
const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaCar className="text-blue-600"/> Customer Dashboard
                </h1>
                <button 
                   onClick={() => navigate('/booking')}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
                >
                    <FaPlus /> Book a Ride
                </button>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex space-x-8 mt-2">
                <button 
                    className="pb-3 text-sm font-medium border-b-2 border-blue-600 text-blue-600 flex items-center gap-2"
                >
                    <FaTachometerAlt /> Dashboard Overview
                </button>
                
                <button 
                    onClick={() => navigate('/route-optimization')}
                    className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-green-600 hover:border-gray-300 flex items-center gap-2 transition-colors"
                >
                    <FaRoute /> Route Optimization [AI]
                </button>
            </div>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="bg-gray-50 min-h-[calc(100vh-140px)]">
           <DashboardHome /> 
      </div>

    </div>
  );
};

export default CustomerDashboard;