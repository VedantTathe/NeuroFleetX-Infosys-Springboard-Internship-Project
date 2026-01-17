import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaClock, FaCar, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import apiClient from '../utils/apiClient';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await apiClient.get('/bookings?status=PENDING');
      if (response.bookings) {
        setBookings(response.bookings);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/confirm`);
      // Remove the confirmed booking from the list
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/cancel`);
      // Remove the rejected booking from the list
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert('Booking rejected!');
    } catch (error) {
      console.error('Error rejecting booking:', error);
      alert('Failed to reject booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Pending Bookings Approval</h3>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaCheck className="text-4xl mb-4 mx-auto text-green-300" />
          <p>No pending bookings to approve</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaUser className="text-gray-400" />
                    <span className="font-medium">Customer ID: {booking.customer?.id || 'N/A'}</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      PENDING
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span>{booking.pickupAddress} → {booking.dropoffAddress}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaCar className="text-gray-400" />
                      <span>{booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : 'No vehicle assigned'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      <span>
                        {booking.scheduledPickupTime ? 
                          new Date(booking.scheduledPickupTime).toLocaleString() : 
                          'No time set'
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-lg font-bold text-gray-900">
                    ${booking.estimatedCost || '0.00'}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleConfirmBooking(booking.id)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleRejectBooking(booking.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
