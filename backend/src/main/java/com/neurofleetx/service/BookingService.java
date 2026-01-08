package com.neurofleetx.service;

import com.neurofleetx.entity.Booking;
import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.entity.User;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    // Create a new booking
    public Booking createBooking(Booking booking) {
        try {
            // Set initial status and timestamps
            booking.setStatus("PENDING");
            booking.setCreatedAt(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Update vehicle availability
            if (booking.getVehicle() != null) {
                booking.getVehicle().setIsAvailable(false);
                vehicleRepository.save(booking.getVehicle());
            }
            
            return bookingRepository.save(booking);
        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            throw new RuntimeException("Failed to create booking: " + e.getMessage());
        }
    }

    // Get booking by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get bookings by customer
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    // Get bookings by vehicle
    public List<Booking> getBookingsByVehicle(Long vehicleId) {
        return bookingRepository.findByVehicleId(vehicleId);
    }

    // Get bookings by driver
    public List<Booking> getBookingsByDriver(Long driverId) {
        return bookingRepository.findByDriverId(driverId);
    }

    // Get bookings by status
    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }

    // Update booking status
    public Booking updateBookingStatus(Long bookingId, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            booking.setUpdatedAt(LocalDateTime.now());
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Cancel booking
    public Booking cancelBooking(Long bookingId) {
        return updateBookingStatus(bookingId, "CANCELLED");
    }

    // Confirm booking
    public Booking confirmBooking(Long bookingId) {
        return updateBookingStatus(bookingId, "CONFIRMED");
    }

    // Start booking (assign driver)
    public Booking startBooking(Long bookingId, Long driverId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("IN_PROGRESS");
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Assign driver (you'd need to fetch User entity here)
            // User driver = userRepository.findById(driverId).orElse(null);
            // booking.setDriver(driver);
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Complete booking
    public Booking completeBooking(Long bookingId, Double actualCost, Double actualDistance, Double actualDuration) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("COMPLETED");
            booking.setActualCost(actualCost);
            booking.setActualDistance(actualDistance);
            booking.setActualDuration(actualDuration);
            booking.setActualDropoffTime(LocalDateTime.now());
            booking.setUpdatedAt(LocalDateTime.now());
            
            // Make vehicle available again
            if (booking.getVehicle() != null) {
                booking.getVehicle().setIsAvailable(true);
                vehicleRepository.save(booking.getVehicle());
            }
            
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with ID: " + bookingId);
    }

    // Get recent bookings for customer (dashboard)
    public List<Booking> getRecentBookingsByCustomer(Long customerId, int limit) {
        List<Booking> bookings = bookingRepository.findRecentBookingsByCustomer(customerId);
        return bookings.stream().limit(limit).toList();
    }

    // Get active bookings
    public List<Booking> getActiveBookings() {
        return bookingRepository.findActiveBookings();
    }

    // Get completed bookings
    public List<Booking> getCompletedBookings() {
        return bookingRepository.findCompletedBookings();
    }

    // Delete booking
    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    // Get booking statistics
    public BookingStats getBookingStats() {
        BookingStats stats = new BookingStats();
        stats.setTotalBookings(bookingRepository.count());
        stats.setPendingBookings(bookingRepository.countByStatus("PENDING"));
        stats.setConfirmedBookings(bookingRepository.countByStatus("CONFIRMED"));
        stats.setCompletedBookings(bookingRepository.countByStatus("COMPLETED"));
        stats.setCancelledBookings(bookingRepository.countByStatus("CANCELLED"));
        stats.setTotalRevenue(bookingRepository.calculateTotalRevenue());
        return stats;
    }

    // Inner class for statistics
    public static class BookingStats {
        private Long totalBookings;
        private Long pendingBookings;
        private Long confirmedBookings;
        private Long completedBookings;
        private Long cancelledBookings;
        private Double totalRevenue;

        // Getters and Setters
        public Long getTotalBookings() { return totalBookings; }
        public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }

        public Long getPendingBookings() { return pendingBookings; }
        public void setPendingBookings(Long pendingBookings) { this.pendingBookings = pendingBookings; }

        public Long getConfirmedBookings() { return confirmedBookings; }
        public void setConfirmedBookings(Long confirmedBookings) { this.confirmedBookings = confirmedBookings; }

        public Long getCompletedBookings() { return completedBookings; }
        public void setCompletedBookings(Long completedBookings) { this.completedBookings = completedBookings; }

        public Long getCancelledBookings() { return cancelledBookings; }
        public void setCancelledBookings(Long cancelledBookings) { this.cancelledBookings = cancelledBookings; }

        public Double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(Double totalRevenue) { this.totalRevenue = totalRevenue; }
    }
}
