import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import apiClient from '../utils/apiClient';

const Booking = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    vehicleType: '',
    passengers: 1,
    evPreference: false
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Mock available vehicles (fallback)
  const availableVehicles = [
    {
      id: 1,
      type: 'sedan',
      name: 'Toyota Camry',
      plate: 'ABC-123',
      rating: 4.5,
      pricePerKm: 2.5,
      features: ['AC', 'Music System', 'GPS'],
      available: true,
      driver: 'John Doe',
      driverRating: 4.8
    },
    {
      id: 2,
      type: 'suv',
      name: 'Honda CR-V',
      plate: 'XYZ-789',
      rating: 4.7,
      pricePerKm: 3.2,
      features: ['AC', 'Music System', 'GPS', 'Leather Seats'],
      available: true,
      driver: 'Jane Smith',
      driverRating: 4.9
    },
    {
      id: 3,
      type: 'ev',
      name: 'Tesla Model 3',
      plate: 'EV-456',
      rating: 4.9,
      pricePerKm: 2.8,
      features: ['AC', 'Autopilot', 'Music System', 'GPS'],
      available: true,
      driver: 'Mike Johnson',
      driverRating: 4.7
    }
  ];

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setBookingData(prev => ({ ...prev, date: today }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateBookingForm = () => {
    const newErrors = {};
    
    // Validate pickup address
    if (!bookingData.pickup || bookingData.pickup.trim().length < 5) {
      newErrors.pickup = 'Pickup address must be at least 5 characters';
    }
    
    // Validate dropoff address
    if (!bookingData.dropoff || bookingData.dropoff.trim().length < 5) {
      newErrors.dropoff = 'Dropoff address must be at least 5 characters';
    }
    
    // Validate passenger count
    const passengers = parseInt(bookingData.passengers);
    if (!passengers || passengers < 1 || passengers > 8) {
      newErrors.passengers = 'Passenger count must be between 1 and 8';
    }
    
    // Validate date (not in the past)
    if (bookingData.date) {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Booking date cannot be in the past';
      }
    }
    
    // Validate time (if date is today)
    if (bookingData.date && bookingData.time) {
      const selectedDate = new Date(bookingData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate.getTime() === today.getTime()) {
        const selectedTime = bookingData.time.split(':');
        const currentTime = new Date();
        const selectedDateTime = new Date();
        selectedDateTime.setHours(parseInt(selectedTime[0]), parseInt(selectedTime[1]), 0, 0);
        
        if (selectedDateTime <= currentTime) {
          newErrors.time = 'Booking time must be at least 30 minutes in the future';
        }
      }
    }
    
    return newErrors;
  };

  const getRecommendations = async () => {
    const validationErrors = validateBookingForm();
    
    // Check for critical errors that would prevent recommendations
    if (validationErrors.pickup || validationErrors.dropoff || validationErrors.passengers) {
      setError('Please fix the form errors before getting recommendations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const criteria = {
        vehicleType: bookingData.vehicleType || null,
        passengerCount: parseInt(bookingData.passengers) || 1,
        evPreference: bookingData.evPreference || false
      };

      let recommendations = [];
      
      // Try to get recommendations from backend
      try {
        const backendResponse = await apiClient.post('/bookings/recommendations', criteria);
        
        // Handle the new response format with vehicles array
        if (backendResponse.vehicles && Array.isArray(backendResponse.vehicles)) {
          recommendations = backendResponse.vehicles.map(vehicle => ({
            id: vehicle.id,
            type: vehicle.type.toLowerCase(),
            name: `${vehicle.make} ${vehicle.model}`,
            plate: vehicle.licensePlate,
            rating: 4.5 + Math.random() * 0.5, // Mock rating
            pricePerKm: vehicle.basePricePerKm,
            features: vehicle.type === 'EV' ? ['AC', 'Autopilot', 'Music System'] : ['AC', 'Music System'],
            available: vehicle.isAvailable,
            driver: 'Driver Assigned', // Mock driver name
            driverRating: 4.5 + Math.random() * 0.5 // Mock driver rating
          }));
        }
      } catch (backendError) {
        console.log('Backend recommendations not available, using local data:', backendError.message);
      }

      // Fallback to local available vehicles if backend fails or returns empty
      if (recommendations.length === 0) {
        recommendations = availableVehicles.filter(vehicle => {
          if (bookingData.vehicleType && vehicle.type !== bookingData.vehicleType.toLowerCase()) {
            return false;
          }
          if (bookingData.evPreference && vehicle.type !== 'ev') {
            return false;
          }
          if (vehicle.passengerCapacity < parseInt(bookingData.passengers || 1)) {
            return false;
          }
          return vehicle.available;
        });
      }

      setRecommendations(recommendations);
      setShowRecommendations(true);
      
    } catch (err) {
      console.error('Recommendations error:', err);
      setError(err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (vehicle) => {
    setLoading(true);
    setError(null);

    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('neurofleetx_user'));

      if (!user) {
        setError('Please login to create a booking');
        return;
      }

      // Combine date and time for scheduled pickup
      const scheduledDateTime = bookingData.date && bookingData.time 
        ? `${bookingData.date}T${bookingData.time}:00`
        : new Date().toISOString();

      const bookingPayload = {
        customerId: user.id,
        vehicleId: vehicle.id,
        pickupAddress: bookingData.pickup,
        dropoffAddress: bookingData.dropoff,
        pickupLatitude: 40.7128, // Default NYC coordinates (should use geocoding API)
        pickupLongitude: -74.0060,
        dropoffLatitude: 40.7589,
        dropoffLongitude: -73.9851,
        scheduledPickupTime: scheduledDateTime,
        estimatedDistance: 15.0, // Mock distance (should use maps API)
        estimatedDuration: 25.0, // Mock duration in minutes
        estimatedCost: calculateEstimatedCost(vehicle),
        passengerCount: bookingData.passengers,
        paymentMethod: 'credit_card',
        promoCode: null,
        discountAmount: 0
      };

      // Create real booking in backend
      const createdBooking = await apiClient.post('/bookings', bookingPayload);
      
      console.log('Booking created successfully:', createdBooking);
      
      // Show success message
      alert('Booking created successfully! Redirecting to dashboard...');
      
      // Redirect to customer dashboard on success
      navigate('/customer/dashboard');
      
    } catch (err) {
      console.error('Booking creation error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimatedCost = (vehicle) => {
    // Mock distance calculation (in real app, would use Google Maps API)
    const distance = 15; // km
    return (distance * vehicle.pricePerKm).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Trip Details</h2>
            
            <div className="space-y-4">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Pickup Location
                </label>
                <input
                  type="text"
                  name="pickup"
                  value={bookingData.pickup}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pickup address"
                />
              </div>

              {/* Dropoff Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Dropoff Location
                </label>
                <input
                  type="text"
                  name="dropoff"
                  value={bookingData.dropoff}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dropoff address"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaClock className="inline mr-2" />
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaCar className="inline mr-2" />
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={bookingData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Vehicle</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="ev">Electric Vehicle</option>
                </select>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUsers className="inline mr-2" />
                  Number of Passengers
                </label>
                <input
                  type="number"
                  name="passengers"
                  value={bookingData.passengers}
                  onChange={handleInputChange}
                  min="1"
                  max="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* EV Preference */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="evPreference"
                  checked={bookingData.evPreference}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Prefer Electric Vehicle
                </label>
              </div>

              {/* Get Recommendations Button */}
              <button
                onClick={getRecommendations}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
              >
                {loading ? 'Finding Vehicles...' : 'Get Vehicle Recommendations'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recommended Vehicles</h2>
            
            {showRecommendations ? (
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                          <p className="text-sm text-gray-600">{vehicle.plate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">
                            ${calculateEstimatedCost(vehicle)}
                          </p>
                          <p className="text-sm text-gray-500">Estimated cost</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FaUsers className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{vehicle.type}</span>
                          </div>
                          <div className="flex items-center">
                            <FaDollarSign className="text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">${vehicle.pricePerKm}/km</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 ml-1">{vehicle.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Driver:</span> {vehicle.driver} (★{vehicle.driverRating})
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          vehicle.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {vehicle.available ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {vehicle.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => createBooking(vehicle)}
                        disabled={!vehicle.available || loading}
                        className={`w-full py-2 px-4 rounded-md transition duration-200 ${
                          vehicle.available && !loading
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {loading ? 'Creating Booking...' : 'Book This Vehicle'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No vehicles available matching your criteria
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaCar className="mx-auto text-gray-300 text-4xl mb-4" />
                <p className="text-gray-500">
                  Enter your trip details and click "Get Vehicle Recommendations" to see available vehicles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
