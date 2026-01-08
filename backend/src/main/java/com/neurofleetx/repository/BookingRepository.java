package com.neurofleetx.repository;

import com.neurofleetx.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by customer
    List<Booking> findByCustomerId(Long customerId);
    
    // Find bookings by vehicle
    List<Booking> findByVehicleId(Long vehicleId);
    
    // Find bookings by driver
    List<Booking> findByDriverId(Long driverId);
    
    // Find bookings by status
    List<Booking> findByStatus(String status);
    
    // Find bookings by customer and status
    List<Booking> findByCustomerIdAndStatus(Long customerId, String status);
    
    // Find bookings within date range
    @Query("SELECT b FROM Booking b WHERE b.scheduledPickupTime BETWEEN :startDate AND :endDate")
    List<Booking> findBookingsInDateRange(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    // Count bookings by status
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    Long countByStatus(@Param("status") String status);
    
    // Calculate total revenue
    @Query("SELECT SUM(b.estimatedCost) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    Double calculateTotalRevenue();
    
    // Find recent bookings for a customer
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookingsByCustomer(@Param("customerId") Long customerId);
    
    // Find active bookings
    @Query("SELECT b FROM Booking b WHERE b.status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS')")
    List<Booking> findActiveBookings();
    
    // Find completed bookings
    @Query("SELECT b FROM Booking b WHERE b.status = 'COMPLETED' ORDER BY b.createdAt DESC")
    List<Booking> findCompletedBookings();
}
