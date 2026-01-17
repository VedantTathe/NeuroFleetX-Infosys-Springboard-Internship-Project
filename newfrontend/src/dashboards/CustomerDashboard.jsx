import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCar, FaRoute, FaLeaf, FaCalendarCheck, FaDollarSign, FaClock, FaHeart, FaTag, FaPlus, FaTachometerAlt
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../utils/apiClient';

// Sub-components defined at top level
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

const DashboardHome = ({ displayMetrics, customerBookings, chartData }) => {
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Recent Bookings</h3>
        {customerBookings && customerBookings.length > 0 ? (
          <div className="space-y-3">
            {customerBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {booking.pickupAddress} → {booking.dropoffAddress}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.scheduledPickupTime).toLocaleDateString()} at {new Date(booking.scheduledPickupTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vehicle: {booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Not assigned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${booking.estimatedCost || '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaCar className="text-4xl mb-4 mx-auto text-gray-300" />
            <p>No bookings found. Book your first ride to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main CustomerDashboard component
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [customerBookings, setCustomerBookings] = useState(null);
  const [displayMetrics, setDisplayMetrics] = useState({
    activeBookings: 0, totalTrips: 0, totalSpent: 0, amountSaved: 0,
    upcomingTrips: 0, favoriteRoutes: 0, co2Saved: 0
  });

  // Fetch customer bookings on component mount
  useEffect(() => {
    const fetchCustomerBookings = async () => {
      try {
        // Get current user from localStorage (assuming user is logged in)
        const user = JSON.parse(localStorage.getItem('neurofleetx_user') || '{}');
        
        if (user.id) {
          const response = await apiClient.get(`/bookings/customer/${user.id}`);
          if (response.bookings) {
            setCustomerBookings(response.bookings);
            
            // Calculate real metrics from bookings
            const bookings = response.bookings;
            const activeBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED').length;
            const totalTrips = bookings.filter(b => b.status === 'COMPLETED').length;
            const totalSpent = bookings
              .filter(b => b.status === 'COMPLETED')
              .reduce((sum, b) => sum + (b.estimatedCost || 0), 0);
            const upcomingTrips = bookings.filter(b => 
              b.status === 'PENDING' || b.status === 'CONFIRMED'
            ).length;
            
            setDisplayMetrics({
              activeBookings,
              totalTrips,
              totalSpent: totalSpent.toFixed(2),
              amountSaved: (totalSpent * 0.1).toFixed(2), // Mock 10% savings
              upcomingTrips,
              favoriteRoutes: 3, // Mock data
              co2Saved: (totalTrips * 2.5).toFixed(1) // Mock CO2 calculation
            });
          }
        }
      } catch (error) {
        console.error('Error fetching customer bookings:', error);
      }
    };

    fetchCustomerBookings();
  }, []);

  const chartData = [
    { day: 'Mon', trips: 2 }, { day: 'Tue', trips: 1 }, { day: 'Wed', trips: 3 },
    { day: 'Thu', trips: 0 }, { day: 'Fri', trips: 2 }, { day: 'Sat', trips: 1 }, { day: 'Sun', trips: 2 }
  ];

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
        <DashboardHome 
          displayMetrics={displayMetrics}
          customerBookings={customerBookings}
          chartData={chartData}
        />
      </div>
    </div>
  );
};

export default CustomerDashboard;