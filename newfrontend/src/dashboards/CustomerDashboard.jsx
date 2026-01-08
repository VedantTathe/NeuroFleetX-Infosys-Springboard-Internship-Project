import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, bookingService } from '../services/services';
import apiClient from '../utils/apiClient';
import { 
  FaCar, FaRoute, FaLeaf, FaStar, FaCalendarCheck, FaDollarSign,
  FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaHeart, FaTag,
  FaChartLine, FaGift, FaBell, FaSearch, FaPlus
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [activeBooking, setActiveBooking] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
    fetchActiveBooking();
    fetchRecentBookings();
    fetchFavoriteRoutes();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await dashboardService.getCustomerMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
    }
  };

  const fetchActiveBooking = async () => {
    try {
      // Mock active booking
      const mockBooking = {
        id: 'BK-2024-001',
        driver: 'Michael Chen',
        driverPhoto: 'https://picsum.photos/seed/driver1/100/100.jpg',
        driverRating: 4.9,
        vehicle: 'Toyota Camry',
        vehiclePlate: 'ABC-1234',
        status: 'arriving', // arriving, in_progress, completed
        estimatedArrival: '5 mins',
        pickupAddress: '123 Main Street, Downtown',
        dropoffAddress: '456 Oak Avenue, Suburbs',
        fare: 24.50,
        distance: 12.5,
        estimatedDuration: '25 mins',
        driverPhone: '+1 234-567-8900',
        bookingTime: '2024-01-06T14:30:00Z',
        paymentMethod: 'credit_card',
        promoApplied: 'SAVE10'
      };
      setActiveBooking(mockBooking);
    } catch (err) {
      console.error('Failed to fetch active booking:', err);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('neurofleetx_user'));
      console.log('Current user from localStorage:', user);
      
      // First, let's try to get ALL bookings to see what's available
      try {
        // Get all bookings (we'll modify this to get customer-specific later)
        const allBookingsResponse = await apiClient.get('/bookings');
        console.log('All bookings response:', allBookingsResponse);
        
        let bookingsData = [];
        if (allBookingsResponse && Array.isArray(allBookingsResponse)) {
          bookingsData = allBookingsResponse;
        } else if (allBookingsResponse && allBookingsResponse.bookings && Array.isArray(allBookingsResponse.bookings)) {
          bookingsData = allBookingsResponse.bookings;
        }
        
        console.log('Bookings data found:', bookingsData);
        console.log('Number of bookings:', bookingsData.length);
        
        // Transform backend bookings to match frontend format
        const backendBookings = bookingsData.map(booking => ({
          id: `BK-${booking.id}`,
          date: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          driver: booking.driver ? booking.driver.name : 'Driver Assigned',
          driverRating: booking.driverRating || 4.5,
          vehicle: booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'Vehicle Assigned',
          fare: booking.estimatedCost || 0,
          pickup: booking.pickupAddress || 'Pickup Location',
          dropoff: booking.dropoffAddress || 'Dropoff Location',
          rating: booking.driverRating || 4,
          status: booking.status ? booking.status.toLowerCase() : 'pending'
        }));
        
        console.log('Transformed bookings:', backendBookings);
        
        // For now, show only backend bookings (no mock data)
        setRecentBookings(backendBookings);
        
      } catch (backendError) {
        console.log('Backend bookings not available, showing mock data:', backendError.message);
        
        // Fallback to mock data
        const mockBookings = [
          {
            id: 'BK-2024-001',
            date: '2024-01-15',
            driver: 'Michael Chen',
            driverRating: 4.9,
            vehicle: 'Toyota Camry',
            fare: 24.50,
            pickup: '123 Main Street, Downtown',
            dropoff: '456 Oak Avenue, Suburbs',
            rating: 5,
            status: 'completed'
          }
        ];
        setRecentBookings(mockBookings);
      }
      
    } catch (err) {
      console.error('Failed to fetch recent bookings:', err);
    }
  };

  const fetchFavoriteRoutes = async () => {
    try {
      // Mock favorite routes
      const mockRoutes = [
        {
          id: 1,
          name: 'Home to Work',
          pickup: '123 Residential Area',
          dropoff: '456 Business Park',
          frequency: 'Daily',
          avgFare: 15.50,
          savedTime: '10 mins'
        },
        {
          id: 2,
          name: 'Airport Run',
          pickup: 'Downtown Hotel',
          dropoff: 'International Airport',
          frequency: 'Weekly',
          avgFare: 45.00,
          savedTime: '15 mins'
        }
      ];
      setFavoriteRoutes(mockRoutes);
    } catch (err) {
      console.error('Failed to fetch favorite routes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mock metrics data
  const mockMetrics = {
    activeBookings: 1,
    totalTrips: 47,
    totalSpent: 892.50,
    amountSaved: 67.80,
    upcomingTrips: 2,
    favoriteRoutes: 3,
    co2Saved: 12.5
  };

  const displayMetrics = metrics || mockMetrics;

  // Mock chart data for weekly activity
  const chartData = [
    { day: 'Mon', trips: 2, amount: 35.50 },
    { day: 'Tue', trips: 1, amount: 18.75 },
    { day: 'Wed', trips: 3, amount: 52.25 },
    { day: 'Thu', trips: 0, amount: 0 },
    { day: 'Fri', trips: 2, amount: 41.80 },
    { day: 'Sat', trips: 1, amount: 22.80 },
    { day: 'Sun', trips: 2, amount: 38.90 }
  ];

  const MetricCard = ({ icon, title, value, subtitle, color = 'blue', trend }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${colorClasses[color]} bg-opacity-10`}>
              <div className={`${colorClasses[color]} text-white text-xl`}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          {trend && (
            <div className={`text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
      </div>
    );
  };

  const StarRating = ({ rating, size = 'sm' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5'
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const ActiveBookingCard = ({ booking }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'arriving': return 'bg-yellow-100 text-yellow-800';
        case 'in_progress': return 'bg-green-100 text-green-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case 'arriving': return 'Arriving';
        case 'in_progress': return 'In Progress';
        case 'completed': return 'Completed';
        default: return 'Unknown';
      }
    };

    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Active Trip</h3>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)} text-gray-800`}>
            {getStatusText(booking.status)} • {booking.estimatedArrival}
          </span>
        </div>

        {/* Driver Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={booking.driverPhoto}
            alt={booking.driver}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-lg">{booking.driver}</h4>
            <p className="text-blue-100">{booking.vehicle} • {booking.vehiclePlate}</p>
            <StarRating rating={booking.driverRating} />
          </div>
        </div>

        {/* Route */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-white rounded-full mt-1"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Pickup</p>
              <p className="text-blue-100">{booking.pickupAddress}</p>
            </div>
          </div>
          <div className="border-l-2 border-dashed border-blue-300 ml-1.5 h-4"></div>
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full mt-1"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Dropoff</p>
              <p className="text-blue-100">{booking.dropoffAddress}</p>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-blue-100">Distance</p>
            <p className="font-semibold">{booking.distance} km</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-blue-100">Duration</p>
            <p className="font-semibold">{booking.estimatedDuration}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <p className="text-sm text-blue-100">Fare</p>
            <p className="font-semibold">${booking.fare}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-medium">
            <FaMapMarkerAlt className="inline mr-2" />
            Track Live
          </button>
          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors">
            <FaPhone className="inline mr-2" />
          </button>
          <button className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-colors">
            <FaEnvelope className="inline mr-2" />
          </button>
        </div>
      </div>
    );
  };

  const RecentBookingItem = ({ booking }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-medium text-gray-900">{booking.driver}</h4>
            <p className="text-sm text-gray-600">{booking.date} • {booking.vehicle}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-600">${booking.fare}</p>
            <StarRating rating={booking.rating} />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-1" />
            {booking.pickup}
          </span>
          <span>→</span>
          <span>{booking.dropoff}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
              <p className="text-gray-600">Welcome back! Book your next ride</p>
            </div>
            <button
              onClick={() => navigate('/booking')}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <FaPlus className="inline mr-2" />
              Book a Ride
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            icon={<FaCalendarCheck />}
            title="Active Bookings"
            value={displayMetrics.activeBookings}
            subtitle="Currently active"
            color="blue"
          />
          <MetricCard
            icon={<FaRoute />}
            title="Total Trips"
            value={displayMetrics.totalTrips}
            subtitle="All-time rides"
            color="purple"
          />
          <MetricCard
            icon={<FaDollarSign />}
            title="Total Spent"
            value={`$${displayMetrics.totalSpent}`}
            subtitle="Lifetime spending"
            color="green"
          />
          <MetricCard
            icon={<FaTag />}
            title="Amount Saved"
            value={`$${displayMetrics.amountSaved}`}
            subtitle="Through offers"
            color="orange"
          />
          <MetricCard
            icon={<FaClock />}
            title="Upcoming Trips"
            value={displayMetrics.upcomingTrips}
            subtitle="Scheduled rides"
            color="yellow"
          />
          <MetricCard
            icon={<FaHeart />}
            title="Favorite Routes"
            value={displayMetrics.favoriteRoutes}
            subtitle="Saved locations"
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Booking */}
            {activeBooking ? (
              <ActiveBookingCard booking={activeBooking} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaCar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bookings</h3>
                <p className="text-gray-600 mb-4">Book a ride to get started</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {(recentBookings || []).map((booking) => (
                  <RecentBookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="trips" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2 text-center">
                {chartData.reduce((sum, day) => sum + day.trips, 0)} trips this week
              </p>
            </div>

            {/* Eco Impact */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <FaLeaf className="text-2xl" />
                <h3 className="text-lg font-semibold">Eco Impact</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{displayMetrics.co2Saved} kg</p>
              <p className="text-green-100">CO₂ emissions saved</p>
              <div className="mt-4 pt-4 border-t border-green-400">
                <p className="text-sm text-green-100">
                  You've made a positive environmental impact by choosing our eco-friendly rides!
                </p>
              </div>
            </div>

            {/* Special Offers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Special Offers</h3>
                <FaGift className="text-orange-500" />
              </div>
              <div className="space-y-3">
                <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                  <p className="font-medium text-orange-900">Weekend Special</p>
                  <p className="text-sm text-orange-700">20% off on all rides</p>
                </div>
                <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                  <p className="font-medium text-blue-900">Refer a Friend</p>
                  <p className="text-sm text-blue-700">Get $10 credit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
