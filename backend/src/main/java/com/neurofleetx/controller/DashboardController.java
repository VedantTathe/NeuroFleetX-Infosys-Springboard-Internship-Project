package com.neurofleetx.controller;

import com.neurofleetx.entity.UserRole;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DashboardController {
    
    @GetMapping("/admin/metrics")
    public Map<String, Object> getAdminMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalUsers", 1250);
        metrics.put("totalFleets", 45);
        metrics.put("totalBookings", 8967);
        metrics.put("activeUsers", 892);
        metrics.put("completedTrips", 7845);
        metrics.put("totalRevenue", 456789.50);
        return metrics;
    }
    
    @GetMapping("/fleet-manager/metrics")
    public Map<String, Object> getFleetManagerMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("activeVehicles", 38);
        metrics.put("totalFleetSize", 45);
        metrics.put("activeTrips", 12);
        metrics.put("completedTrips", 156);
        metrics.put("activeDrivers", 35);
        metrics.put("weeklyRevenue", 12456.78);
        return metrics;
    }
    
    @GetMapping("/driver/metrics")
    public Map<String, Object> getDriverMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("todaysTrips", 8);
        metrics.put("todaysEarnings", 156.78);
        metrics.put("distanceCovered", 124.5);
        metrics.put("driverRating", 4.7);
        metrics.put("completedTrips", 142);
        metrics.put("acceptanceRate", 87.5);
        return metrics;
    }
    
    @GetMapping("/customer/metrics")
    public Map<String, Object> getCustomerMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("activeBookings", 2);
        metrics.put("totalTrips", 23);
        metrics.put("totalSpent", 1234.56);
        metrics.put("amountSaved", 89.45);
        metrics.put("upcomingTrips", 3);
        metrics.put("favoriteRoutes", 5);
        return metrics;
    }
}
