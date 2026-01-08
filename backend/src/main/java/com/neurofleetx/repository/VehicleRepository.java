package com.neurofleetx.repository;

import com.neurofleetx.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    // Find vehicle by license plate
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    
    // Find vehicles by type
    List<Vehicle> findByType(String type);
    
    // Find available vehicles
    List<Vehicle> findByIsAvailableTrue();
    
    // Find vehicles by type and availability
    List<Vehicle> findByTypeAndIsAvailable(String type, Boolean isAvailable);
    
    // Find vehicles by passenger capacity
    List<Vehicle> findByPassengerCapacityGreaterThanEqual(Integer passengerCount);
}
