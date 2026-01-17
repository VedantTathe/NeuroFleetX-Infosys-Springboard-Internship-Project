package com.neurofleetx.service;

import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Create a new vehicle
    @Transactional
    public Vehicle createVehicle(Vehicle vehicle) {
        try {
            vehicle.setCreatedAt(LocalDateTime.now());
            vehicle.setUpdatedAt(LocalDateTime.now());
            
            // Set default values if not provided
            if (vehicle.getCurrentFuelLevel() == null) {
                vehicle.setCurrentFuelLevel(100.0);
            }
            // Set fuel type based on vehicle type
            if (vehicle.getFuelType() == null) {
                if ("EV".equals(vehicle.getType())) {
                    vehicle.setFuelType("ELECTRIC");
                } else if ("SEDAN".equals(vehicle.getType())) {
                    vehicle.setFuelType("GASOLINE");
                } else if ("SUV".equals(vehicle.getType())) {
                    vehicle.setFuelType("GASOLINE");
                } else {
                    vehicle.setFuelType("GASOLINE");
                }
            }
            // Set default status
            if (vehicle.getStatus() == null) {
                vehicle.setStatus("ACTIVE");
            }
            // For non-EV vehicles, set batteryLevel to 0.0 to avoid NOT NULL constraint
            if (vehicle.getBatteryLevel() == null) {
                vehicle.setBatteryLevel("EV".equals(vehicle.getType()) ? 100.0 : 0.0);
            }
            if (vehicle.getHealthScore() == null) {
                vehicle.setHealthScore(95.0);
            }
            
            return vehicleRepository.save(vehicle);
        } catch (Exception e) {
            System.err.println("Error creating vehicle: " + e.getMessage());
            throw new RuntimeException("Failed to create vehicle: " + e.getMessage());
        }
    }

    // Get vehicle by ID
    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    // Get all vehicles
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    // Get vehicle by license plate
    public Optional<Vehicle> getVehicleByLicensePlate(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate);
    }

    // Get vehicles by type
    public List<Vehicle> getVehiclesByType(String type) {
        return vehicleRepository.findByType(type);
    }

    // Get available vehicles
    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByIsAvailableTrue();
    }

    // Get vehicles by type and availability
    public List<Vehicle> getAvailableVehiclesByType(String type) {
        return vehicleRepository.findByTypeAndIsAvailable(type, true);
    }

    // Update vehicle
    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setMake(vehicleDetails.getMake());
            vehicle.setModel(vehicleDetails.getModel());
            vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
            vehicle.setType(vehicleDetails.getType());
            vehicle.setPassengerCapacity(vehicleDetails.getPassengerCapacity());
            vehicle.setYear(vehicleDetails.getYear());
            vehicle.setColor(vehicleDetails.getColor());
            vehicle.setBasePricePerKm(vehicleDetails.getBasePricePerKm());
            vehicle.setIsAvailable(vehicleDetails.getIsAvailable());
            vehicle.setUpdatedAt(LocalDateTime.now());
            return vehicleRepository.save(vehicle);
        }
        throw new RuntimeException("Vehicle not found with ID: " + id);
    }

    // Update vehicle availability
    public Optional<Vehicle> updateVehicleAvailability(Long id, Boolean isAvailable) {
        Optional<Vehicle> vehicleOpt = vehicleRepository.findById(id);
        if (vehicleOpt.isPresent()) {
            Vehicle vehicle = vehicleOpt.get();
            vehicle.setIsAvailable(isAvailable);
            vehicle.setUpdatedAt(LocalDateTime.now());
            return Optional.of(vehicleRepository.save(vehicle));
        }
        return Optional.empty();
    }

    // Delete vehicle
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    // Get vehicles by passenger capacity
    public List<Vehicle> getVehiclesByPassengerCapacity(Integer passengerCount) {
        return vehicleRepository.findByPassengerCapacityGreaterThanEqual(passengerCount);
    }

    // Get vehicles needing maintenance (simplified version)
    public List<Vehicle> getVehiclesNeedingMaintenance() {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        return allVehicles.stream()
            .filter(v -> v.getHealthScore() != null && v.getHealthScore() < 70.0)
            .filter(v -> v.getCurrentFuelLevel() != null && v.getCurrentFuelLevel() < 20.0)
            .toList();
    }

    // Search vehicles (simplified version)
    public List<Vehicle> searchVehicles(String searchTerm) {
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        String searchLower = searchTerm.toLowerCase();
        return allVehicles.stream()
            .filter(v -> v.getMake().toLowerCase().contains(searchLower) || 
                       v.getModel().toLowerCase().contains(searchLower))
            .toList();
    }

    // Get vehicle statistics
    public VehicleStats getVehicleStats() {
        VehicleStats stats = new VehicleStats();
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        
        stats.setTotalVehicles((long) allVehicles.size());
        stats.setAvailableVehicles(allVehicles.stream().mapToLong(v -> v.getIsAvailable() ? 1L : 0L).sum());
        stats.setSedanVehicles(allVehicles.stream().mapToLong(v -> "SEDAN".equals(v.getType()) ? 1L : 0L).sum());
        stats.setSuvVehicles(allVehicles.stream().mapToLong(v -> "SUV".equals(v.getType()) ? 1L : 0L).sum());
        stats.setEvVehicles(allVehicles.stream().mapToLong(v -> "EV".equals(v.getType()) ? 1L : 0L).sum());
        stats.setVehiclesNeedingMaintenance(getVehiclesNeedingMaintenance().stream().count());
        
        return stats;
    }

    // AI-powered vehicle recommendations
    public List<Vehicle> getVehicleRecommendations(String vehicleType, Integer passengerCount, Boolean evPreference) {
        List<Vehicle> availableVehicles = getAvailableVehicles();
        
        return availableVehicles.stream()
            .filter(vehicle -> {
                // Filter by type if specified
                if (vehicleType != null && !vehicleType.isEmpty()) {
                    if (!vehicle.getType().equalsIgnoreCase(vehicleType)) {
                        return false;
                    }
                }
                
                // Filter by passenger capacity
                if (passengerCount != null && vehicle.getPassengerCapacity() < passengerCount) {
                    return false;
                }
                
                // Filter by EV preference
                if (evPreference != null && evPreference && !"EV".equals(vehicle.getType())) {
                    return false;
                }
                
                return true;
            })
            .sorted((v1, v2) -> {
                // Sort by health score and price
                int healthCompare = v2.getHealthScore().compareTo(v1.getHealthScore());
                if (healthCompare != 0) return healthCompare;
                return v1.getBasePricePerKm().compareTo(v2.getBasePricePerKm());
            })
            .limit(5) // Return top 5 recommendations
            .toList();
    }

    // Inner class for statistics
    public static class VehicleStats {
        private Long totalVehicles;
        private Long availableVehicles;
        private Long sedanVehicles;
        private Long suvVehicles;
        private Long evVehicles;
        private Long vehiclesNeedingMaintenance;

        // Getters and Setters
        public Long getTotalVehicles() { return totalVehicles; }
        public void setTotalVehicles(Long totalVehicles) { this.totalVehicles = totalVehicles; }

        public Long getAvailableVehicles() { return availableVehicles; }
        public void setAvailableVehicles(Long availableVehicles) { this.availableVehicles = availableVehicles; }

        public Long getSedanVehicles() { return sedanVehicles; }
        public void setSedanVehicles(Long sedanVehicles) { this.sedanVehicles = sedanVehicles; }

        public Long getSuvVehicles() { return suvVehicles; }
        public void setSuvVehicles(Long suvVehicles) { this.suvVehicles = suvVehicles; }

        public Long getEvVehicles() { return evVehicles; }
        public void setEvVehicles(Long evVehicles) { this.evVehicles = evVehicles; }

        public Long getVehiclesNeedingMaintenance() { return vehiclesNeedingMaintenance; }
        public void setVehiclesNeedingMaintenance(Long vehiclesNeedingMaintenance) { this.vehiclesNeedingMaintenance = vehiclesNeedingMaintenance; }
    }
}
