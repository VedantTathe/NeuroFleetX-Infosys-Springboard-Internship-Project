-- Insert sample vehicles for testing
INSERT INTO vehicles (make, model, license_plate, type, passenger_capacity, vehicle_year, color, base_price_per_km, is_available, current_fuel_level, battery_level, fuel_type, health_score, status, created_at, updated_at) VALUES
('Toyota', 'Camry', 'ABC-123', 'SEDAN', 5, 2022, 'Silver', 0.50, true, 80.0, 0.0, 'GASOLINE', 95.0, 'ACTIVE', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Honda', 'CR-V', 'XYZ-789', 'SUV', 7, 2023, 'Black', 0.75, true, 90.0, 0.0, 'GASOLINE', 92.0, 'ACTIVE', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Tesla', 'Model 3', 'EV-001', 'EV', 5, 2023, 'White', 0.60, true, 100.0, 95.0, 'ELECTRIC', 98.0, 'ACTIVE', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Ford', 'Mustang', 'MUS-456', 'SEDAN', 4, 2021, 'Red', 0.80, false, 60.0, 0.0, 'GASOLINE', 88.0, 'ACTIVE', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('BMW', 'X5', 'BMW-789', 'SUV', 7, 2022, 'Blue', 0.90, true, 75.0, 0.0, 'GASOLINE', 94.0, 'ACTIVE', '2024-01-01 10:00:00', '2024-01-01 10:00:00');

-- Insert sample users for testing (matching actual User entity structure)
INSERT INTO users (name, email, password, role, company_name, license_number, active, created_at, updated_at) VALUES
('Admin User', 'admin@neurofleetx.com', '$2a$10$YourHashedPasswordHere', 'ADMIN', 'NeuroFleetX', 'ADMIN-001', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('John Doe', 'customer1@neurofleetx.com', '$2a$10$YourHashedPasswordHere', 'CUSTOMER', 'Personal', 'CUST-001', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
('Mike Wilson', 'driver1@neurofleetx.com', '$2a$10$YourHashedPasswordHere', 'DRIVER', 'NeuroFleetX', 'DRV-001', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00');
