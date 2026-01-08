package com.neurofleetx.controller;

import com.neurofleetx.entity.Vehicle;
import com.neurofleetx.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    // Get all vehicles
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicle by ID
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        try {
            return vehicleService.getVehicleById(id)
                    .map(vehicle -> ResponseEntity.ok(vehicle))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicle by license plate
    @GetMapping("/license/{licensePlate}")
    public ResponseEntity<Vehicle> getVehicleByLicensePlate(@PathVariable String licensePlate) {
        try {
            return vehicleService.getVehicleByLicensePlate(licensePlate)
                    .map(vehicle -> ResponseEntity.ok(vehicle))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicles by type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Vehicle>> getVehiclesByType(@PathVariable String type) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByType(type);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get available vehicles
    @GetMapping("/available")
    public ResponseEntity<List<Vehicle>> getAvailableVehicles() {
        try {
            List<Vehicle> vehicles = vehicleService.getAvailableVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get available vehicles by type
    @GetMapping("/available/{type}")
    public ResponseEntity<List<Vehicle>> getAvailableVehiclesByType(@PathVariable String type) {
        try {
            List<Vehicle> vehicles = vehicleService.getAvailableVehiclesByType(type);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Create new vehicle
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> createVehicle(@RequestBody Vehicle vehicle) {
        System.out.println("=== VEHICLE CREATION REQUEST ===");
        System.out.println("Vehicle data: " + vehicle.getMake() + " " + vehicle.getModel());
        
        try {
            // Simplified validation for testing
            if (vehicle.getMake() == null || vehicle.getMake().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Vehicle make is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (vehicle.getModel() == null || vehicle.getModel().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Vehicle model is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Set default values for testing
            if (vehicle.getLicensePlate() == null || vehicle.getLicensePlate().trim().isEmpty()) {
                vehicle.setLicensePlate("TEST-" + System.currentTimeMillis());
            }
            
            if (vehicle.getType() == null || vehicle.getType().trim().isEmpty()) {
                vehicle.setType("SEDAN");
            }
            
            if (vehicle.getPassengerCapacity() == null) {
                vehicle.setPassengerCapacity(4);
            }
            
            if (vehicle.getYear() == null) {
                vehicle.setYear(2022);
            }
            
            if (vehicle.getBasePricePerKm() == null) {
                vehicle.setBasePricePerKm(2.5);
            }
            
            if (vehicle.getIsAvailable() == null) {
                vehicle.setIsAvailable(true);
            }
            
            Vehicle createdVehicle = vehicleService.createVehicle(vehicle);
            System.out.println("VEHICLE CREATED SUCCESSFULLY: " + createdVehicle.getId());
            
            // Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Vehicle created successfully");
            response.put("vehicle", createdVehicle);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create vehicle: " + e.getMessage());
            System.out.println("VEHICLE CREATION ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        try {
            System.out.println("=== VEHICLE UPDATE REQUEST ===");
            System.out.println("Updating vehicle ID: " + id);
            
            Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDetails);
            System.out.println("VEHICLE UPDATED SUCCESSFULLY: " + id);
            return ResponseEntity.ok(updatedVehicle);
            
        } catch (Exception e) {
            System.err.println("Error updating vehicle: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Update vehicle availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<Vehicle> updateVehicleAvailability(@PathVariable Long id, @RequestBody Map<String, Boolean> availabilityRequest) {
        try {
            Boolean isAvailable = availabilityRequest.get("available");
            Optional<Vehicle> updatedVehicle = vehicleService.updateVehicleAvailability(id, isAvailable);
            System.out.println("VEHICLE AVAILABILITY UPDATED: " + id + " -> " + isAvailable);
            
            if (updatedVehicle.isPresent()) {
                return ResponseEntity.ok(updatedVehicle.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error updating vehicle availability: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        try {
            System.out.println("=== VEHICLE DELETION REQUEST ===");
            System.out.println("Deleting vehicle ID: " + id);
            
            vehicleService.deleteVehicle(id);
            System.out.println("VEHICLE DELETED SUCCESSFULLY: " + id);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            System.err.println("Error deleting vehicle: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicles needing maintenance
    @GetMapping("/maintenance-needed")
    public ResponseEntity<List<Vehicle>> getVehiclesNeedingMaintenance() {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesNeedingMaintenance();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Search vehicles
    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchVehicles(@RequestParam String q) {
        try {
            List<Vehicle> vehicles = vehicleService.searchVehicles(q);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicles by passenger capacity
    @GetMapping("/capacity/{passengerCount}")
    public ResponseEntity<List<Vehicle>> getVehiclesByPassengerCapacity(@PathVariable Integer passengerCount) {
        try {
            List<Vehicle> vehicles = vehicleService.getVehiclesByPassengerCapacity(passengerCount);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get vehicle statistics
    @GetMapping("/stats")
    public ResponseEntity<VehicleService.VehicleStats> getVehicleStats() {
        try {
            VehicleService.VehicleStats stats = vehicleService.getVehicleStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Simulate vehicle telemetry update
    @PostMapping("/{id}/telemetry")
    public ResponseEntity<Map<String, Object>> updateTelemetry(@PathVariable Long id, @RequestBody Map<String, Object> telemetryData) {
        try {
            System.out.println("=== TELEMETRY UPDATE ===");
            System.out.println("Vehicle ID: " + id);
            System.out.println("Telemetry data: " + telemetryData);
            
            // In a real application, this would update vehicle telemetry
            // For now, just return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Telemetry updated successfully");
            response.put("vehicleId", id);
            response.put("timestamp", java.time.LocalDateTime.now().toString());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error updating telemetry: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
