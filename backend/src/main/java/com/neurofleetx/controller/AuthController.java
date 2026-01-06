package com.neurofleetx.controller;

import com.neurofleetx.entity.User;
import com.neurofleetx.entity.UserRole;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.util.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("=== LOGIN REQUEST RECEIVED ===");
        System.out.println("Email: " + loginRequest.get("email"));
        
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            // Find user by email
            User user = userRepository.findByEmail(email)
                    .orElse(null);
            
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                System.out.println("LOGIN FAILED: User not found - " + email);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid credentials");
                System.out.println("LOGIN FAILED: Invalid password for " + email);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if user is active
            if (!user.isActive()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Account is deactivated");
                System.out.println("LOGIN FAILED: Account deactivated - " + email);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Generate JWT token (simple UUID for now)
            String token = UUID.randomUUID().toString();
            
            // Prepare user response (without password)
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", user.getId());
            userResponse.put("name", user.getName());
            userResponse.put("email", user.getEmail());
            userResponse.put("role", user.getRole().toString());
            userResponse.put("companyName", user.getCompanyName());
            userResponse.put("licenseNumber", user.getLicenseNumber());
            
            // Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", userResponse);
            response.put("message", "Login successful");
            
            System.out.println("LOGIN SUCCESSFUL FOR: " + email + " with role: " + user.getRole());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Login failed: " + e.getMessage());
            System.out.println("LOGIN ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registerRequest) {
        System.out.println("=== REGISTER REQUEST RECEIVED ===");
        System.out.println("Request data: " + registerRequest);
        
        try {
            String name = (String) registerRequest.get("name");
            String email = (String) registerRequest.get("email");
            String password = (String) registerRequest.get("password");
            String roleStr = (String) registerRequest.getOrDefault("role", "CUSTOMER");
            
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Password: " + (password != null ? "***" : "NULL"));
            System.out.println("Role: " + roleStr);
            
            // Validate required fields
            if (name == null || name.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Name is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (email == null || email.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (password == null || password.length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validate role
            UserRole role;
            try {
                role = UserRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid role. Must be one of: ADMIN, FLEET_MANAGER, DRIVER, CUSTOMER");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                System.out.println("REGISTRATION FAILED: Email already exists - " + email);
                return ResponseEntity.badRequest().body(error);
            }
            
            // Create new user
            User user = new User();
            user.setName(name.trim());
            user.setEmail(email.trim().toLowerCase());
            user.setPassword(passwordEncoder.encode(password)); // Encrypt password
            user.setRole(role);
            user.setActive(true);
            
            // Set role-specific fields
            if (role == UserRole.FLEET_MANAGER) {
                String companyName = (String) registerRequest.get("companyName");
                if (companyName != null && !companyName.trim().isEmpty()) {
                    user.setCompanyName(companyName.trim());
                }
            } else if (role == UserRole.DRIVER) {
                String licenseNumber = (String) registerRequest.get("licenseNumber");
                if (licenseNumber != null && !licenseNumber.trim().isEmpty()) {
                    user.setLicenseNumber(licenseNumber.trim());
                }
            }
            
            // Save user to database
            User savedUser = userRepository.save(user);
            System.out.println("USER SAVED: " + savedUser.getId() + " - " + savedUser.getEmail() + " with role: " + savedUser.getRole());
            
            // Prepare user response (without password)
            Map<String, Object> userResponse = new HashMap<>();
            userResponse.put("id", savedUser.getId());
            userResponse.put("name", savedUser.getName());
            userResponse.put("email", savedUser.getEmail());
            userResponse.put("role", savedUser.getRole().toString());
            userResponse.put("companyName", savedUser.getCompanyName());
            userResponse.put("licenseNumber", savedUser.getLicenseNumber());
            userResponse.put("createdAt", savedUser.getCreatedAt());
            userResponse.put("active", savedUser.isActive());
            
            // Prepare success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("user", userResponse);
            
            System.out.println("REGISTRATION SUCCESSFUL FOR: " + email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            System.out.println("REGISTRATION ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping(value = "/logout", produces = "application/json")
    public ResponseEntity<?> logout() {
        System.out.println("=== LOGOUT REQUEST RECEIVED ===");
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(value = "/verify-token", produces = "application/json")
    public ResponseEntity<?> verifyToken() {
        System.out.println("=== TOKEN VERIFICATION REQUEST RECEIVED ===");
        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("message", "Token is valid");
        return ResponseEntity.ok(response);
    }
}