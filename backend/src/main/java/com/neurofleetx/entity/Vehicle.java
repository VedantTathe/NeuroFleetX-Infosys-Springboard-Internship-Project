package com.neurofleetx.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private User driver;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(name = "license_plate", nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false)
    private String type;

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(name = "vehicle_year", nullable = false)
    private Integer year;

    @Column(nullable = false)
    private String color;

    @Column(name = "base_price_per_km", nullable = false)
    private Double basePricePerKm;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable;

    @Column(name = "current_fuel_level", nullable = false)
    private Double currentFuelLevel;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "status")
    private String status;

    @Column(name = "battery_level")
    private Double batteryLevel;

    @Column(name = "health_score")
    private Double healthScore;

    @Column(name = "last_maintenance_date")
    private String lastMaintenanceDate;

    @Column(name = "current_latitude")
    private Double currentLatitude;

    @Column(name = "current_longitude")
    private Double currentLongitude;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

    // Constructors
    public Vehicle() {}

    public Vehicle(String make, String model, String licensePlate, String type, 
                Integer passengerCapacity, Integer year, String color, 
                Double basePricePerKm, Boolean isAvailable) {
        this.make = make;
        this.model = model;
        this.licensePlate = licensePlate;
        this.type = type;
        this.passengerCapacity = passengerCapacity;
        this.year = year;
        this.color = color;
        this.basePricePerKm = basePricePerKm;
        this.isAvailable = isAvailable;
        this.currentFuelLevel = 100.0;
        this.batteryLevel = type.equals("EV") ? 100.0 : null;
        this.healthScore = 95.0;
        this.createdAt = java.time.LocalDateTime.now().toString();
        this.updatedAt = java.time.LocalDateTime.now().toString();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPassengerCapacity() { return passengerCapacity; }
    public void setPassengerCapacity(Integer passengerCapacity) { this.passengerCapacity = passengerCapacity; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Double getBasePricePerKm() { return basePricePerKm; }
    public void setBasePricePerKm(Double basePricePerKm) { this.basePricePerKm = basePricePerKm; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Double getCurrentFuelLevel() { return currentFuelLevel; }
    public void setCurrentFuelLevel(Double currentFuelLevel) { this.currentFuelLevel = currentFuelLevel; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Double batteryLevel) { this.batteryLevel = batteryLevel; }

    public Double getHealthScore() { return healthScore; }
    public void setHealthScore(Double healthScore) { this.healthScore = healthScore; }

    public String getLastMaintenanceDate() { return lastMaintenanceDate; }
    public void setLastMaintenanceDate(String lastMaintenanceDate) { this.lastMaintenanceDate = lastMaintenanceDate; }

    public Double getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(Double currentLatitude) { this.currentLatitude = currentLatitude; }

    public Double getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(Double currentLongitude) { this.currentLongitude = currentLongitude; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
