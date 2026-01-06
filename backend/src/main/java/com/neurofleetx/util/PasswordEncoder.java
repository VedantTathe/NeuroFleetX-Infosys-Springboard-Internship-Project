package com.neurofleetx.util;

import org.springframework.stereotype.Component;

@Component
public class PasswordEncoder {
    
    public String encode(String rawPassword) {
        // Simple encoding for now - in production use BCrypt
        return "encoded_" + rawPassword;
    }
    
    public boolean matches(String rawPassword, String encodedPassword) {
        // Simple matching for now - in production use BCrypt
        return ("encoded_" + rawPassword).equals(encodedPassword);
    }
}
